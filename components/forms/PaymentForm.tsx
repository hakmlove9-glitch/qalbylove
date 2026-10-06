'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { PAYMENT_PHONE } from '@/lib/constants'
import { Upload, Phone } from 'lucide-react'

const paymentSchema = z.object({
  transactionId: z.string().min(1, 'رقم العملية مطلوب'),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentFormProps {
  subscriptionId: string
  planId: string
  planName: string
  amount: number
  durationMonths: number
}

export default function PaymentForm({ subscriptionId, planId, planName, amount, durationMonths }: PaymentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [receipt, setReceipt] = useState<File | null>(null)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  })

  const onSubmit = async (data: PaymentFormData) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('يجب تسجيل الدخول')
        router.push('/login')
        return
      }

      let receiptUrl = null
      if (receipt) {
        const fileExt = receipt.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, receipt)

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('receipts')
            .getPublicUrl(fileName)
          receiptUrl = publicUrl
        }
      }

      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          subscription_id: subscriptionId,
          plan_id: planId,
          plan_name: planName,
          amount,
          duration_months: durationMonths,
          transaction_id: data.transactionId,
          receipt_url: receiptUrl,
          status: 'pending',
        })

      if (error) throw error

      toast.success('تم إرسال بيانات التحويل بنجاح')
      router.push('/profile')
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ ما')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-primary/5 p-6 rounded-xl">
        <h3 className="font-bold mb-4">بيانات التحويل:</h3>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
            <Phone className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-gray-600 mb-1">رقم التحويل (فودافون كاش):</p>
            <p className="text-3xl font-bold text-primary" dir="ltr">{PAYMENT_PHONE}</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">رقم العملية *</label>
        <input {...register('transactionId')} className="input-field" placeholder="أدخل رقم عملية التحويل" />
        {errors.transactionId && <p className="text-red-500 text-sm mt-1">{errors.transactionId.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">صورة الإيصال (اختياري)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">اضغط لرفع صورة الإيصال</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setReceipt(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? 'جارٍ الإرسال...' : 'تأكيد إتمام التحويل'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        سيتم مراجعة التحويل وتفعيل اشتراكك خلال 24 ساعة كحد أقصى
      </p>
    </form>
  )
}
