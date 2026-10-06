'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setLogs(data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const getActionLabel = (action: string) => {
    const labels: any = {
      approve_payment: 'تأكيد دفع',
      reject_payment: 'رفض دفع',
      update_user: 'تعديل مستخدم',
      delete_user: 'حذف مستخدم',
      ban_user: 'حظر مستخدم',
      update_photo: 'تحديث صورة',
      update_report: 'تحديث بلاغ',
      update_subscription: 'تحديث اشتراك',
      update_settings: 'تحديث إعدادات',
    }
    return labels[action] || action
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-primary mb-6">سجل العمليات</h2>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-sm">{getActionLabel(log.action)}</p>
              <p className="text-xs text-gray-500">
                {new Date(log.created_at).toLocaleString('ar-EG')}
              </p>
            </div>
            {log.details && (
              <span className="text-xs text-gray-400">
                {JSON.stringify(log.details).slice(0, 50)}...
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
