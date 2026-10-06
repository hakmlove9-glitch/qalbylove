'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import UserAvatar from '@/components/shared/UserAvatar'
import StatusBadge from '@/components/shared/StatusBadge'

export default function RecentUsers() {
  const [users, setUsers] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">أحدث المستخدمين</h2>
        <Link href="/admin/users" className="text-sm text-primary hover:text-primary-700">
          عرض الكل
        </Link>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <UserAvatar name={user.full_name} size="md" avatarUrl={user.avatar_url} />
            <div className="flex-1">
              <p className="font-semibold text-sm">{user.full_name}</p>
              <p className="text-xs text-gray-500">{user.governorate}</p>
            </div>
            <StatusBadge status={user.is_approved ? 'approved' : 'pending'} />
          </div>
        ))}
      </div>
    </div>
  )
}
