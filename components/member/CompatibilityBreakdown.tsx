"use client";

import { HeartHandshake, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type Breakdown = {
  score: number;
  strengths: string[];
  differences: string[];
};

export default function CompatibilityBreakdown({ memberId }: { memberId: string }) {
  const [data, setData] = useState<Breakdown | null>(null);

  useEffect(() => {
    fetch(`/api/compatibility?member_id=${encodeURIComponent(memberId)}`, { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => setData(payload?.compatibility || null))
      .catch(() => undefined);
  }, [memberId]);

  if (!data) return null;

  return (
    <section className="mt-4 rounded-[28px] border border-rose-100 bg-gradient-to-br from-white to-rose-50/60 p-5 shadow-[0_12px_30px_rgba(80,18,44,.05)]" dir="rtl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-black text-rose-900"><HeartHandshake className="h-4 w-4 text-rose-600" /> توافقكما المفسّر</div>
          <p className="mt-1 text-[11px] font-bold text-rose-500">مش مجرد رقم؛ بنوضح لك نقاط القرب والاختلاف.</p>
        </div>
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-600 text-lg font-black text-white shadow-lg shadow-rose-100">{data.score}%</div>
      </div>
      {!!data.strengths.length && <div className="mt-4"><div className="mb-2 flex items-center gap-1.5 text-xs font-black text-emerald-700"><Sparkles className="h-3.5 w-3.5" /> نقاط تقرّبكما</div><div className="flex flex-wrap gap-2">{data.strengths.map((item) => <span key={item} className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700">{item}</span>)}</div></div>}
      {!!data.differences.length && <div className="mt-4"><div className="mb-2 text-xs font-black text-amber-700">اختلافات تستحق الحوار</div><div className="flex flex-wrap gap-2">{data.differences.map((item) => <span key={item} className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-700">{item}</span>)}</div></div>}
    </section>
  );
}
