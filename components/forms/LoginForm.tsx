'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  identifier: z.string().min(3, 'أدخل البريد الإلكتروني أو رقم الهاتف'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      let email = data.identifier
      if (!email.includes('@')) {
        email = `${data.identifier}@qalbylove.com`
      }

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password: data.password,
      })

      if (error) throw error

      toast.success('تم تسجيل الدخول بنجاح!')

      if (email === 'admin@qalbylove.com') {
        router.push('/admin/dashboard')
      } else {
        router.push('/profile')
      }

      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'بيانات الدخول غير صحيحة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">البريد الإلكتروني أو رقم الهاتف</label>
        <input {...register('identifier')} className="input-field" placeholder="example@email.com أو 01xxxxxxxxx" />
        {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">كلمة المرور</label>
        <input type="password" {...register('password')} className="input-field" placeholder="••••••••" />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? 'جارٍ الدخول...' : 'تسجيل الدخول'}
      </button>
    </form>
  )
}
