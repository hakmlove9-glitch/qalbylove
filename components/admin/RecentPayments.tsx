'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import StatusBadge from '@/components/shared/StatusBadge'

export default function RecentPayments() {
  const [payments, setPayments] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setPayments(data || [])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">أحدث التحويلات</h2>
        <Link href="/admin/payments" className="text-sm text-primary hover:text-primary-700">
          عرض الكل
        </Link>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{payment.profiles?.full_name}</p>
              <p className="text-xs text-gray-500">{payment.plan_name}</p>
            </div>
            <div className="text-left">
              <p className="font-bold text-primary">{payment.amount} جنيه</p>
              <StatusBadge status={payment.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
