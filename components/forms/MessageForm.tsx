'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { Send } from 'lucide-react'

const messageSchema = z.object({
  content: z.string().min(1, 'الرسالة فارغة').max(1000, 'الحد الأقصى 1000 حرف'),
})

type MessageFormData = z.infer<typeof messageSchema>

interface MessageFormProps {
  receiverId: string
  onSent?: () => void
}

export default function MessageForm({ receiverId, onSent }: MessageFormProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  })

  const onSubmit = async (data: MessageFormData) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('يجب تسجيل الدخول')
        return
      }

      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: data.content,
        })

      if (error) throw error

      reset()
      toast.success('تم إرسال الرسالة')
      onSent?.()
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ ما')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <input
        {...register('content')}
        className="input-field flex-1"
        placeholder="اكتب رسالتك..."
      />
      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
        <Send className="w-5 h-5" />
      </button>
      {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
    </form>
  )
}
