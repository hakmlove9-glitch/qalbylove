'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { GOVERNORATES, EDUCATION_LEVELS, JOB_TYPES, RELIGIOUS_LEVELS, MARITAL_STATUS } from '@/lib/constants'

const registerSchema = z.object({
  full_name: z.string().min(3, 'الاسم الكامل مطلوب'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح').optional(),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional(),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  gender: z.enum(['male', 'female'], { message: 'اختر النوع' }),
  birth_date: z.string().min(1, 'تاريخ الميلاد مطلوب'),
  governorate: z.string().min(1, 'المحافظة مطلوبة'),
  marital_status: z.string().min(1, 'الحالة الاجتماعية مطلوبة'),
  education: z.string().min(1, 'المؤهل العلمي مطلوب'),
  job: z.string().min(1, 'المهنة مطلوبة'),
  religious_level: z.string().min(1, 'مستوى الالتزام مطلوب'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true)
    try {
      const email = data.email || (data.phone ? `${data.phone}@qalbylove.com` : '')

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            phone: data.phone,
          },
        },
      })

      if (authError) throw authError

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user?.id,
          full_name: data.full_name,
          phone: data.phone,
          email,
          gender: data.gender,
          birth_date: data.birth_date,
          governorate: data.governorate,
          marital_status: data.marital_status,
          education: data.education,
          job: data.job,
          religious_level: data.religious_level,
        })

      if (profileError) throw profileError

      toast.success('تم إنشاء حسابك بنجاح!')
      router.push('/profile')
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ ما')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {step === 1 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
              <input {...register('full_name')} className="input-field" placeholder="" />
              {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">النوع *</label>
              <select {...register('gender')} className="input-field">
                <option value="">اختر النوع</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">تاريخ الميلاد *</label>
              <input type="date" {...register('birth_date')} className="input-field" />
              {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">المحافظة *</label>
              <select {...register('governorate')} className="input-field">
                <option value="">اختر المحافظة</option>
                {GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
              {errors.governorate && <p className="text-red-500 text-sm mt-1">{errors.governorate.message}</p>}
            </div>
          </div>

          <button type="button" onClick={() => setStep(2)} className="btn-primary w-full">
            التالي
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الحالة الاجتماعية *</label>
              <select {...register('marital_status')} className="input-field">
                <option value="">اختر الحالة</option>
                {MARITAL_STATUS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              {errors.marital_status && <p className="text-red-500 text-sm mt-1">{errors.marital_status.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">المؤهل العلمي *</label>
              <select {...register('education')} className="input-field">
                <option value="">اختر المؤهل</option>
                {EDUCATION_LEVELS.map((edu) => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </select>
              {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">المهنة *</label>
              <select {...register('job')} className="input-field">
                <option value="">اختر المهنة</option>
                {JOB_TYPES.map((job) => (
                  <option key={job} value={job}>{job}</option>
                ))}
              </select>
              {errors.job && <p className="text-red-500 text-sm mt-1">{errors.job.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">مستوى الالتزام *</label>
              <select {...register('religious_level')} className="input-field">
                <option value="">اختر المستوى</option>
                {RELIGIOUS_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              {errors.religious_level && <p className="text-red-500 text-sm mt-1">{errors.religious_level.message}</p>}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1">
              السابق
            </button>
            <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">
              التالي
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
              <input {...register('phone')} className="input-field" placeholder="" />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
              <input type="email" {...register('email')} className="input-field" placeholder="" dir="ltr" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">كلمة المرور *</label>
              <input type="password" {...register('password')} className="input-field" placeholder="" />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div className="bg-cream p-4 rounded-xl text-sm text-gray-600">
            <p className="font-semibold mb-2">ملاحظة:</p>
            <p>يمكنك التسجيل برقم الهاتف أو البريد الإلكتروني. إذا سجلت برقم الهاتف فقط، سيتم إنشاء بريد إلكتروني تلقائي لك.</p>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => setStep(2)} className="btn-outline flex-1">
              السابق
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
              {loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </div>
        </>
      )}
    </form>
  )
}
