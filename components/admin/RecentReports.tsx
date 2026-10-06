'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function RecentReports() {
  const [reports, setReports] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*, reporter:profiles!reporter_id(full_name), reported:profiles!reported_id(full_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setReports(data || [])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">أحدث البلاغات</h2>
        <Link href="/admin/reports" className="text-sm text-primary hover:text-primary-700">
          عرض الكل
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          لا توجد بلاغات معلقة
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">بلاغ ضد: {report.reported?.full_name}</p>
                <p className="text-xs text-gray-500">{report.reason}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(report.created_at).toLocaleDateString('ar-EG')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
