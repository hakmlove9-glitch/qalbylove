"use client"
import React, { createContext, useContext, useCallback, useState } from "react"

type MemberProfileContextType = {
  memberId?: string
  reload?: () => void
  loading?: boolean
}

const MemberProfileContext = createContext<MemberProfileContextType>({})

export function useMemberProfile() {
  return useContext(MemberProfileContext)
}

export default function MemberProfilePageProvider({ 
  children, 
  memberId 
}: { 
  children: React.ReactNode
  memberId?: string 
}) {
  const [loading, setLoading] = useState(false)
  const reload = useCallback(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
  }, [])
  return (
    <MemberProfileContext.Provider value={{ memberId, reload, loading }}>
      {children}
    </MemberProfileContext.Provider>
  )
}
