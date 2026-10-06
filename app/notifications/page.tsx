"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Bell, Eye, Heart, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import MemberShell from "@/components/member/MemberShell";

type NotificationItem = {
  id: string;
  content: string;
  type?: string;
  action_url?: string | null;
  is_read: boolean;
  created_at?: string;
};

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const unread = useMemo(() => items.filter((item) => !item.is_read).length, [items]);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications", { cache: "no-store" });
      const data = await response.json();
      if (response.ok) setItems(data.notifications || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function markRead(id?: string) {
    setWorking(true);
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { id } : { all: true }),
      });
      if (!response.ok) return;
      setItems((current) => current.map((item) => (!id || item.id === id ? { ...item, is_read: true } : item)));
    } finally {
      setWorking(false);
    }
  }

  return (
    <MemberShell title="تنبيهاتك" subtitle="كل تنبيه هنا ناتج عن حدث حقيقي في حسابك؛ لا رسائل مصطنعة ولا نشاط وهمي." unreadNotifications={unread}>
      <section className="overflow-hidden rounded-[32px] border border-rose-100 bg-white shadow-[0_20px_60px_rgba(70,14,37,.07)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 bg-gradient-to-l from-[#fff7fa] via-white to-[#fffaf2] p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600"><Bell className="h-5 w-5" /></span>
            <div><span className="text-xs font-black text-rose-500">نبض حسابك</span><h2 className="mt-1 text-2xl font-black text-[#3b0b1d]">آخر ما حدث</h2></div>
          </div>
          {unread > 0 && (
            <button disabled={working} onClick={() => void markRead()} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-black text-emerald-800 disabled:opacity-50">تحديد الكل كمقروء</button>
          )}
        </div>

        {loading ? <div className="py-16 text-center font-black text-rose-400">جاري تحميل التنبيهات...</div> : items.length === 0 ? <Empty /> : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => <Item key={item.id} item={item} onRead={() => void markRead(item.id)} />)}
          </div>
        )}
      </section>
    </MemberShell>
  );
}

function notificationIcon(type?: string) {
  const value = String(type || "").toLowerCase();
  if (value.includes("message")) return MessageCircle;
  if (value.includes("interest") || value.includes("like") || value.includes("match")) return Heart;
  if (value.includes("view")) return Eye;
  if (value.includes("verify") || value.includes("payment") || value.includes("subscription")) return BadgeCheck;
  if (value.includes("security") || value.includes("report")) return ShieldCheck;
  return Sparkles;
}

function Item({ item, onRead }: { item: NotificationItem; onRead: () => void }) {
  const Icon = notificationIcon(item.type);
  const body = (
    <div className={`flex items-center gap-3 p-4 transition md:px-6 ${item.is_read ? "bg-white" : "bg-rose-50/45"}`}>
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${item.is_read ? "bg-rose-50 text-rose-500" : "bg-rose-100 text-rose-700"}`}><Icon className="h-5 w-5" /></span>
      <div className="min-w-0 flex-1">
        <div className={`text-sm leading-6 ${item.is_read ? "font-bold text-rose-700" : "font-black text-[#3c0b20]"}`}>{item.content}</div>
        <div className="mt-1 text-[11px] font-bold text-rose-400">{item.created_at ? new Date(item.created_at).toLocaleString("ar-EG") : ""}</div>
      </div>
      {!item.is_read && <button onClick={(event) => { event.preventDefault(); onRead(); }} className="shrink-0 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700">مقروء</button>}
    </div>
  );

  return item.action_url ? <Link href={item.action_url} onClick={onRead}>{body}</Link> : body;
}

function Empty() {
  return <div className="py-16 text-center"><Sparkles className="mx-auto h-10 w-10 text-rose-300" /><h3 className="mt-4 text-xl font-black">أنت متابع لكل شيء.</h3><p className="mt-2 text-sm font-bold text-rose-500">أول اهتمام أو زيارة مسجلة أو رسالة أو تحديث حقيقي سيظهر هنا.</p></div>;
}
