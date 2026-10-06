interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const configs: any = {
      pending: { label: 'قيد المراجعة', className: 'bg-yellow-100 text-yellow-700' },
      active: { label: 'نشط', className: 'bg-green-100 text-green-700' },
      approved: { label: 'مقبول', className: 'bg-green-100 text-green-700' },
      rejected: { label: 'مرفوض', className: 'bg-red-100 text-red-700' },
      expired: { label: 'منتهي', className: 'bg-gray-100 text-gray-700' },
      cancelled: { label: 'ملغي', className: 'bg-gray-100 text-gray-700' },
      resolved: { label: 'تم الحل', className: 'bg-green-100 text-green-700' },
      dismissed: { label: 'مرفوض', className: 'bg-red-100 text-red-700' },
    }

    const config = configs[status] || { label: status, className: 'bg-gray-100 text-gray-700' }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.className}`}>
        {config.label}
      </span>
    )
  }

  return getStatusConfig(status)
}
