'use client';
import React from 'react';
export default function ChatButton({ onClick, memberId }: { onClick?: () => void; memberId?: string }) {
  return <button onClick={onClick} data-member-id={memberId} className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-white shadow-lg">💬</button>;
}
