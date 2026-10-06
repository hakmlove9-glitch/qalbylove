"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, CreditCard, Image, KeyRound, Users, UserRound, UserRoundX, Clock3, Crown, Mail, MessagesSquare } from "lucide-react";

type Stats = {
  members: number;
  activeSubscriptions: number;
  pendingPayments: number;
  pendingReports: number;
  pendingPhotos: number;
  todayMembers: number;
  onlineMembers: number;
  men: number;
  women: number;
  incompleteProfiles: number;
  founders: number;
  founderSeats: number;
  usedCodes: number;
  unusedCodes: number;
  pendingRequests: number;
  pendingMessages: number;
};

const cards = [
  { key: "members", label: "إجمالي الأعضاء", href: "/admin/members", icon: Users },
  { key: "todayMembers", label: "أعضاء اليوم", href: "/admin/members", icon: Clock3 },
  { key: "onlineMembers", label: "متواجدون الآن", href: "/admin/members", icon: UserRound },
  { key: "men", label: "الرجال", href: "/admin/members", icon: UserRound },
  { key: "women", label: "النساء", href: "/admin/members", icon: UserRound },
  { key: "incompleteProfiles", label: "ملفات غير مكتملة", href: "/admin/members", icon: UserRoundX },
  { key: "activeSubscriptions", label: "اشتراكات فعالة", href: "/admin/subscriptions", icon: CreditCard },
  { key: "pendingPayments", label: "طلبات دفع معلقة", href: "/admin/payments", icon: KeyRound },
  { key: "pendingReports", label: "بلاغات تحتاج مراجعة", href: "/admin/reports", icon: AlertTriangle },
  { key: "pendingPhotos", label: "صور تنتظر المراجعة", href: "/admin/photos", icon: Image },
  { key: "usedCodes", label: "أكواد مستخدمة", href: "/admin/codes", icon: KeyRound },
  { key: "unusedCodes", label: "أكواد غير مستخدمة", href: "/admin/codes", icon: KeyRound },
  { key: "pendingRequests", label: "طلبات زواج معلقة", href: "/admin/members", icon: Mail },
  { key: "pendingMessages", label: "رسائل غير مقروءة", href: "/admin/messages", icon: MessagesSquare },
  { key: "founders", label: "المؤسسون", href: "/admin/members", icon: Crown },
  { key: "founderSeats", label: "مقاعد المؤسسين المتبقية", href: "/admin/members", icon: Crown },
] as const;

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({ members: 0, todayMembers: 0, onlineMembers: 0, men: 0, women: 0, incompleteProfiles: 0, founders: 0, founderSeats: 1000, usedCodes: 0, unusedCodes: 0, pendingRequests: 0, pendingMessages: 0, activeSubscriptions: 0, pendingPayments: 0, pendingReports: 0, pendingPhotos: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => setStats(data.stats ?? stats))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main>
      <div className="mb-8 flex flex-col gap-2">
        <span className="text-sm font-black text-rose-600">الإدارة المركزية</span>
        <h2 className="text-3xl font-black text-rose-950">كل المنصة أمامك في مكان واحد</h2>
        <p className="max-w-3xl leading-7 text-rose-500">راجع الأعضاء والبلاغات والصور والاشتراكات وأكواد التفعيل دون التنقل بين أنظمة منفصلة.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.key} href={card.href} className="rounded-[20px] border border-rose-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><card.icon size={21} /></div>
            <div className="text-3xl font-black text-rose-950">{loading ? "—" : stats[card.key]}</div>
            <div className="mt-1 text-sm font-bold text-rose-500">{card.label}</div>
          </Link>
        ))}
      </div>

      <section className="mt-7 grid gap-5 lg:grid-cols-2">
        <Link href="/admin/codes" className="rounded-[28px] bg-gradient-to-l from-rose-600 to-fuchsia-600 p-7 text-white shadow-xl shadow-rose-100">
          <KeyRound size={32} />
          <h3 className="mt-5 text-2xl font-black">إنشاء كود تفعيل</h3>
          <p className="mt-2 text-sm leading-7 text-rose-50">أنشئ كودًا لأي باقة، ثم أرسله للعضو ليقوم بالتفعيل بنفسه.</p>
        </Link>
        <Link href="/admin/reports" className="rounded-[28px] bg-rose-950 p-7 text-white shadow-xl">
          <AlertTriangle size={32} className="text-amber-300" />
          <h3 className="mt-5 text-2xl font-black">مركز الأمان والبلاغات</h3>
          <p className="mt-2 text-sm leading-7 text-rose-300">البلاغات المتعلقة بالابتزاز، طلب الأموال، الإساءة والحسابات المشبوهة تظهر هنا للمراجعة.</p>
        </Link>
      </section>
    </main>
  );
}
