"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, Crown, ShieldCheck } from "lucide-react";

type Subscription = {
  id: string;
  plan_name: string;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  plan_price: number;
  duration_months: number;
  description?: string;
};

export default function MySubscriptionPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [founder, setFounder] = useState(false);
  const [memberNumber, setMemberNumber] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/my-subscription", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setSubscription(data.subscription ?? null);
        setFounder(Boolean(data.founder));
        setMemberNumber(data.memberNumber ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const active = subscription?.status === "active" && subscription.ends_at && new Date(subscription.ends_at) > new Date();

  return (
    <main dir="rtl" className="min-h-screen bg-[#fff9fb] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[32px] border border-rose-100 bg-white p-7 shadow-[0_24px_80px_rgba(83,23,52,.08)] md:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-black text-rose-700">
                <Crown size={16} /> امتيازاتي
              </span>
              <h1 className="mt-4 text-3xl font-black text-rose-950">اشتراكك في قلبي لوڤي</h1>
            </div>
            <ShieldCheck size={52} className={active ? "text-emerald-500" : "text-slate-300"} />
          </div>

          {loading ? (
            <div className="mt-8 h-40 animate-pulse rounded-3xl bg-rose-100" />
          ) : founder ? (
            <div className="mt-8 rounded-3xl bg-gradient-to-l from-[#4d0a2b] via-[#8d164c] to-[#c51459] p-6 text-white shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div><p className="text-sm font-black text-amber-200">عضوية مؤسس دائمة</p><h2 className="mt-1 text-3xl font-black">أنت من أوائل أعضاء قلبي لوڤي 👑</h2></div>
                {memberNumber && <span className="rounded-full bg-amber-300 px-4 py-2 text-sm font-black text-amber-950">مؤسس رقم {memberNumber}</span>}
              </div>
              <p className="mt-4 text-sm font-bold leading-7 text-white/80">أنت لا تحتاج إلى اشتراك مدفوع للاستفادة من مزايا المؤسسين. شارة المؤسس دائمة وتظهر على ملفك أمام الأعضاء.</p>
            </div>
          ) : active && subscription ? (
            <div className="mt-8 rounded-3xl bg-gradient-to-l from-rose-950 to-rose-800 p-6 text-white">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-rose-200">الباقة الحالية</p>
                  <h2 className="mt-1 text-3xl font-black">{subscription.plan_name}</h2>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-black text-emerald-300">فعّالة الآن</span>
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm text-rose-200">
                <CalendarDays size={18} />
                تنتهي في {new Date(subscription.ends_at!).toLocaleDateString("ar-EG")}
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-rose-200 bg-rose-50/60 p-7 text-center">
              <h2 className="text-xl font-black text-rose-900">لا توجد باقة تميّز فعالة حاليًا</h2>
              <p className="mt-2 text-sm leading-7 text-rose-600">يمكنك استخدام قلبي لوڤي مجانًا، والاشتراك يمنحك مزايا إضافية فقط.</p>
            </div>
          )}

          <Link href={founder ? "/founders" : "/subscriptions"} className="mt-7 block rounded-2xl bg-gradient-to-l from-rose-600 to-fuchsia-600 px-5 py-4 text-center font-black text-white">
            {founder ? "مشاهدة مجتمع المؤسسين" : "عرض الباقات وأكواد التفعيل"}
          </Link>
        </div>
      </div>
    </main>
  );
}
