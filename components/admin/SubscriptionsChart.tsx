'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SubscriptionsChart() {
  const [data, setData] = useState([])
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('created_at')
        .order('created_at', { ascending: true })

      const monthlyData: any = {}
      subscriptions?.forEach((sub) => {
        const month = new Date(sub.created_at).toLocaleDateString('ar-EG', { month: 'short' })
        monthlyData[month] = (monthlyData[month] || 0) + 1
      })

      const chartData = Object.entries(monthlyData).map(([name, count]) => ({
        name,
        الاشتراكات: count,
      }))

      setData(chartData as any)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-primary mb-6">الاشتراكات الشهرية</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="الاشتراكات" fill="#800020" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
