interface StatCardProps {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="card">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-3xl font-bold text-primary">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{title}</div>
    </div>
  )
}
