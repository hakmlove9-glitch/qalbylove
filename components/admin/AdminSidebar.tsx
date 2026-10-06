"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CreditCard,
  Image,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const menuItems = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/members", label: "الأعضاء", icon: Users },
  { href: "/admin/messages", label: "الرسائل الإدارية", icon: MessagesSquare },
  { href: "/admin/subscriptions", label: "الاشتراكات", icon: CreditCard },
  { href: "/admin/codes", label: "أكواد التفعيل", icon: KeyRound },
  { href: "/admin/payments", label: "طلبات الدفع", icon: CreditCard },
  { href: "/admin/reports", label: "البلاغات والأمان", icon: AlertTriangle },
  { href: "/admin/photos", label: "مراجعة الصور", icon: Image },
  { href: "/admin/statistics", label: "الإحصائيات", icon: BarChart3 },
  { href: "/admin/logs", label: "سجل الإدارة", icon: Activity },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && <button aria-label="إغلاق القائمة" onClick={onClose} className="fixed inset-0 z-40 bg-black/30 lg:hidden" />}
      <aside className={`fixed right-0 top-0 z-50 h-full w-72 border-l border-white/10 bg-rose-950 text-white shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}>
        <div className="flex h-full flex-col p-5">
          <div className="mb-7 flex items-center justify-between rounded-2xl bg-white/5 p-3">
            <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-fuchsia-600 font-black">ق</span>
              <div>
                <div className="font-black">قلبي لوڤي</div>
                <div className="text-xs text-rose-400">إدارة المنصة</div>
              </div>
            </Link>
            <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-white/10 lg:hidden"><X size={19} /></button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
              return (
                <Link key={item.href} href={item.href} onClick={onClose} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${active ? "bg-gradient-to-l from-rose-600 to-fuchsia-600 text-white shadow-lg shadow-rose-950/30" : "text-rose-300 hover:bg-white/7 hover:text-white"}`}>
                  <item.icon size={19} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">
            <div className="mb-1 flex items-center gap-2 font-black"><ShieldCheck size={17} /> وضع الإدارة الآمن</div>
            كل عملية حساسة تُسجّل في سجل الإدارة.
          </div>
          <Link href="/logout" className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-rose-300 hover:bg-white/5">
            <LogOut size={17} /> تسجيل الخروج
          </Link>
        </div>
      </aside>
    </>
  );
}
