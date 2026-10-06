"use client";

import { Check, Crown, Sparkles } from "lucide-react";

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  description?: string | null;
  features?: Record<string, boolean> | null;
  popular?: boolean;
};

const labels: Record<string, string> = {
  receive_messages: "تلقي الرسائل",
  message_anyone: "إرسال رسائل إلى أي عضو",
  message_interest_only: "مراسلة من أضافك إلى اهتمامه",
  message_privacy: "التحكم في من يراسلك",
  hide_ads: "تصفح بدون إعلانات",
  featured_profile: "إبراز ملفك بين الأعضاء",
  change_username: "إمكانية تعديل اسم المستخدم",
  hidden_login: "دخول متخفي",
  member_photos: "رؤية صور الأعضاء",
  priority_support: "أولوية الدعم والمراجعة",
};

export default function PlanCard({
  plan,
  onChoose,
}: {
  plan: SubscriptionPlan;
  onChoose: (plan: SubscriptionPlan) => void;
}) {
  const features = Object.entries(plan.features ?? {})
    .filter(([, enabled]) => enabled)
    .map(([key]) => labels[key] ?? key);

  const key = String(plan.name || "").toLowerCase();
  const isRoyal = key.includes("ملكي");
  const isDiamond = key.includes("ماسي");
  const isGold = key.includes("ذهبي");
  const isSilver = key.includes("فضي");
  const shell = isRoyal ? "border-amber-300/40 bg-[linear-gradient(145deg,#4b0b25,#6f0b30)] text-white" : isDiamond ? "border-fuchsia-300 bg-[linear-gradient(145deg,#fff,#fff1f6)]" : isGold ? "border-amber-200 bg-[linear-gradient(145deg,#fffdf7,#fff5d9)]" : isSilver ? "border-slate-200 bg-[linear-gradient(145deg,#fff,#f5f8fb)]" : "border-rose-100 bg-white";
  const accent = isRoyal ? "text-amber-300" : isGold ? "text-amber-600" : isSilver ? "text-slate-500" : "text-rose-600";
  const button = isRoyal ? "bg-gradient-to-l from-amber-300 to-yellow-400 text-[#4b0b25]" : isGold ? "bg-gradient-to-l from-amber-400 to-yellow-500 text-amber-950" : isSilver ? "bg-gradient-to-l from-slate-500 to-slate-700 text-white" : "bg-gradient-to-l from-[#a70c46] to-[#e41d64] text-white";

  return (
    <article
      className={`relative overflow-hidden rounded-[28px] border p-6 ${shell} shadow-[0_20px_70px_rgba(66,18,42,.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(150,37,87,.14)] ${
        plan.popular
          ? "border-rose-300 ring-4 ring-rose-50"
          : "border-rose-100"
      }`}
    >
      {plan.popular && (
        <div className="absolute left-5 top-5 flex items-center gap-1 rounded-full bg-gradient-to-l from-rose-600 to-fuchsia-600 px-3 py-1 text-xs font-black text-white">
          <Sparkles size={14} /> الأكثر اختيارًا
        </div>
      )}

      <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 ${accent}`}>
        <Crown size={24} />
      </div>

      <h3 className={`text-2xl font-black ${isRoyal ? "text-white" : "text-rose-900"}`}>{plan.name}</h3>
      <p className={`mt-2 min-h-10 text-sm leading-6 ${isRoyal ? "text-white/70" : "text-rose-500"}`}>
        {plan.description || "كل الأدوات التي تحتاجها لتجربة أكثر فعالية وخصوصية."}
      </p>

      <div className="my-6 flex items-end gap-2">
        <strong className={`text-4xl font-black ${accent}`}>{plan.price}</strong>
        <span className="pb-1 text-sm font-bold text-rose-500">جنيه</span>
      </div>

      <div className="mb-6 space-y-3">
        {(features.length ? features : Object.values(labels).slice(0, 6)).map((feature) => (
          <div key={feature} className="flex items-center gap-3 text-sm font-bold text-rose-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check size={14} strokeWidth={3} />
            </span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChoose(plan)}
        className={`w-full rounded-2xl px-5 py-3.5 font-black shadow-lg transition hover:scale-[1.01] active:scale-[.99] ${button}`}
      >
        اختر هذه الباقة
      </button>
    </article>
  );
}
