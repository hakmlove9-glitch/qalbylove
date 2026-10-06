'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function RevenueChart() {
  const [data, setData] = useState([])
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: true })

      const monthlyData: any = {}
      payments?.forEach((payment) => {
        const month = new Date(payment.created_at).toLocaleDateString('ar-EG', { month: 'short' })
        monthlyData[month] = (monthlyData[month] || 0) + payment.amount
      })

      const chartData = Object.entries(monthlyData).map(([name, amount]) => ({
        name,
        الإيرادات: amount,
      }))

      setData(chartData as any)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-primary mb-6">الإيرادات الشهرية</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="الإيرادات" stroke="#D4AF37" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
