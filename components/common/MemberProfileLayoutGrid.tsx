'use client';
import React from 'react';
export default function MemberProfileLayoutGrid({ children, memberId }: { children: React.ReactNode; memberId?: string }) {
  return <div data-member-id={memberId} className="grid grid-cols-1 gap-6 lg:grid-cols-3">{children}</div>;
}
