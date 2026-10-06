'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, CreditCard, DollarSign, Image, AlertTriangle } from 'lucide-react'

export default function AdminStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    pendingPhotos: 0,
    pendingReports: 0,
    totalRevenue: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      const { count: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      const { count: pendingPayments } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      const { count: pendingPhotos } = await supabase
        .from('photos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      const { count: pendingReports } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'approved')

      const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0

      setStats({
        totalUsers: totalUsers || 0,
        activeSubscriptions: activeSubscriptions || 0,
        pendingPayments: pendingPayments || 0,
        pendingPhotos: pendingPhotos || 0,
        pendingReports: pendingReports || 0,
        totalRevenue,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const cards = [
    { title: 'إجمالي المستخدمين', value: stats.totalUsers, icon: Users, color: 'bg-primary' },
    { title: 'الاشتراكات النشطة', value: stats.activeSubscriptions, icon: CreditCard, color: 'bg-gold' },
    { title: 'تحويلات معلقة', value: stats.pendingPayments, icon: DollarSign, color: 'bg-blue-500' },
    { title: 'صور بانتظار المراجعة', value: stats.pendingPhotos, icon: Image, color: 'bg-purple-500' },
    { title: 'بلاغات معلقة', value: stats.pendingReports, icon: AlertTriangle, color: 'bg-red-500' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="card">
          <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
            <card.icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-primary">{card.value}</div>
          <div className="text-sm text-gray-600 mt-1">{card.title}</div>
        </div>
      ))}
    </div>
  )
}
