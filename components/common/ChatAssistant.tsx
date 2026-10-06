'use client';
import React from 'react';
export default function ChatAssistant({ memberId }: { memberId?: string }) {
  return <div data-member-id={memberId} className="fixed bottom-24 right-6 z-50 w-80 rounded-xl bg-white p-4 shadow-xl border">Assistant</div>;
}
