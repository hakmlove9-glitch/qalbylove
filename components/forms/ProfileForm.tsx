'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import { GOVERNORATES, EDUCATION_LEVELS, JOB_TYPES, RELIGIOUS_LEVELS, MARITAL_STATUS } from '@/lib/constants'

const profileSchema = z.object({
  full_name: z.string().min(3, 'الاسم الكامل مطلوب'),
  governorate: z.string().min(1, 'المحافظة مطلوبة'),
  marital_status: z.string().min(1, 'الحالة الاجتماعية مطلوبة'),
  education: z.string().min(1, 'المؤهل العلمي مطلوب'),
  job: z.string().min(1, 'المهنة مطلوبة'),
  religious_level: z.string().min(1, 'مستوى الالتزام مطلوب'),
  height: z.string().optional(),
  weight: z.string().optional(),
  about: z.string().max(500, 'الحد الأقصى 500 حرف').optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  profile: any
  onSuccess?: () => void
}

export default function ProfileForm({ profile, onSuccess }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      governorate: profile?.governorate || '',
      marital_status: profile?.marital_status || '',
      education: profile?.education || '',
      job: profile?.job || '',
      religious_level: profile?.religious_level || '',
      height: profile?.height || '',
      weight: profile?.weight || '',
      about: profile?.about || '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('يجب تسجيل الدخول')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('تم حفظ التعديلات بنجاح')
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ ما')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
          <input {...register('full_name')} className="input-field" />
          {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">المحافظة *</label>
          <select {...register('governorate')} className="input-field">
            {GOVERNORATES.map((gov) => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>
          {errors.governorate && <p className="text-red-500 text-sm mt-1">{errors.governorate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">الحالة الاجتماعية *</label>
          <select {...register('marital_status')} className="input-field">
            {MARITAL_STATUS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.marital_status && <p className="text-red-500 text-sm mt-1">{errors.marital_status.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">المؤهل العلمي *</label>
          <select {...register('education')} className="input-field">
            {EDUCATION_LEVELS.map((edu) => (
              <option key={edu} value={edu}>{edu}</option>
            ))}
          </select>
          {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">المهنة *</label>
          <select {...register('job')} className="input-field">
            {JOB_TYPES.map((job) => (
              <option key={job} value={job}>{job}</option>
            ))}
          </select>
          {errors.job && <p className="text-red-500 text-sm mt-1">{errors.job.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">مستوى الالتزام *</label>
          <select {...register('religious_level')} className="input-field">
            {RELIGIOUS_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {errors.religious_level && <p className="text-red-500 text-sm mt-1">{errors.religious_level.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">الطول (سم)</label>
          <input type="number" {...register('height')} className="input-field" placeholder="" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">الوزن (كجم)</label>
          <input type="number" {...register('weight')} className="input-field" placeholder="" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">نبذة عني</label>
        <textarea {...register('about')} rows={4} className="input-field" placeholder="اكتب نبذة قصيرة عن نفسك..." />
        {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about.message}</p>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
      </button>
    </form>
  )
}
