"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-rose-50 lg:pr-72">
      <AdminSidebar isOpen={open} onClose={() => setOpen(false)} />
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-rose-200 bg-white/90 px-4 backdrop-blur lg:px-8">
        <div>
          <p className="text-xs font-bold text-rose-600">قلبي لوڤي</p>
          <h1 className="font-black text-rose-900">لوحة الإدارة</h1>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="rounded-xl border border-rose-200 p-2 lg:hidden" aria-label="فتح قائمة الإدارة">
          <Menu size={22} />
        </button>
      </header>
      <div className="p-4 md:p-7 lg:p-9">{children}</div>
    </div>
  );
}
