"use client";

import Link from "next/link";
import { ArrowLeft, Crown, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type FounderStats = {
  count: number;
  remaining: number;
  limit: number;
  open: boolean;
};

export default function FounderLaunchSection() {
  const [stats, setStats] = useState<FounderStats | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/public/founders", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("تعذر تحميل عداد المؤسسين");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setStats({
          count: Number(data.count || 0),
          remaining: Number(data.remaining ?? 1000),
          limit: Number(data.limit || 1000),
          open: Boolean(data.open),
        });
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const progress = useMemo(() => {
    if (!stats?.limit) return 0;
    return Math.max(0, Math.min(100, (stats.count / stats.limit) * 100));
  }, [stats]);

  // عند اكتمال أول 1000 عضو لا يبقى Placeholder ولا فراغ؛ القسم يختفي بالكامل.
  if (!stats || !stats.open) return null;

  return (
    <section className="ql-container py-6 md:py-8">
      <div className="overflow-hidden rounded-[30px] border border-amber-200/80 bg-gradient-to-l from-white via-[#fffdf9] to-amber-50/70 shadow-[0_20px_55px_rgba(93,33,46,.08)]">
        <div className="grid items-stretch lg:grid-cols-[1fr_340px]">
          <div className="relative p-6 md:p-7">
            <div className="absolute -right-14 -top-16 h-40 w-40 rounded-full bg-rose-100/45 blur-3xl" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-800">
                  <Crown className="h-3.5 w-3.5" /> عضوية المؤسسين
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" /> مزايا دائمة بلا اشتراك تلقائي
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-black leading-tight text-[#2d1020] md:text-4xl">
                كن من أول <span className="ql-gradient-text">1000 عضو مؤسس</span> في قلبي لوڤي
              </h2>

              <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-rose-600">
                أول ألف عضو حقيقي يكتمل تسجيله يحصل على شارة مؤسس دائمة ومزايا المؤسسين. عند اكتمال العدد يختفي هذا العرض تلقائيًا وتتحرك بقية الصفحة لمكانه بلا أي مساحة فارغة.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-rose-100 bg-white px-3 py-2 text-[11px] font-black text-[#6c2742]">
                  <Trophy className="h-3.5 w-3.5 text-amber-600" /> شارة مؤسس دائمة
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-rose-100 bg-white px-3 py-2 text-[11px] font-black text-[#6c2742]">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> أولوية في الدعم والمراجعة
                </span>
                <Link href="/signup" className="ql-btn-primary min-w-[170px]">
                  احجز مكانك <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative flex items-center border-t border-amber-100 bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-5 lg:border-r lg:border-t-0">
            <div className="w-full text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-amber-300 bg-white shadow-sm">
                <Crown className="h-7 w-7 text-amber-600" />
              </div>
              <div className="mt-3 text-[11px] font-black text-[#7b5b43]">تم حجز</div>
              <div className="text-4xl font-black text-[#3b1d25]">{stats.count.toLocaleString("ar-EG")}</div>
              <div className="mt-0.5 text-[11px] font-black text-[#7b5b43]">من أصل {stats.limit.toLocaleString("ar-EG")}</div>
              <div className="mx-auto mt-4 h-2.5 max-w-[250px] overflow-hidden rounded-full bg-amber-100">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-amber-500 via-rose-400 to-emerald-400 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] font-black text-[#6b4b3d]">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                متبقي {stats.remaining.toLocaleString("ar-EG")} مكان
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
