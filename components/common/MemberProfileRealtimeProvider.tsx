"use client"
import { useEffect } from "react"
import { useMemberProfile } from "./MemberProfilePageProvider"
import { supabase } from "@/lib/supabase/client"

export default function MemberProfileRealtimeProvider({ memberId, children }: { memberId: string, children: React.ReactNode }) {
  const { reload } = useMemberProfile()

  useEffect(() => {
    const channel = supabase.channel(`member-${memberId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members', filter: `id=eq.${memberId}` }, () => {
        if (reload) reload()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [memberId, reload])

  return <>{children}</>
}
