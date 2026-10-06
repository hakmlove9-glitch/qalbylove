'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface PhotoUploadProps {
  onUploaded?: (url: string) => void
}

export default function PhotoUpload({ onUploaded }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة كبير جداً (الحد الأقصى 5MB)')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('نوع الملف غير مدعوم')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('يجب تسجيل الدخول')
        return
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName)

      const { error: dbError } = await supabase
        .from('photos')
        .insert({
          user_id: user.id,
          url: publicUrl,
          status: 'pending',
        })

      if (dbError) throw dbError

      toast.success('تم رفع الصورة بنجاح، بانتظار مراجعة الإدارة')
      onUploaded?.(publicUrl)
    } catch (error: any) {
      toast.error(error.message || 'حدث خطأ ما')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {preview ? (
        <div className="relative">
          <img src={preview} alt="معاينة" className="w-full h-48 object-cover rounded-xl" />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
              <p className="text-white font-semibold">جارٍ الرفع...</p>
            </div>
          )}
        </div>
      ) : (
        <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer block">
          <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">اضغط لرفع صورة</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP - حتى 5MB</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
  )
}
