"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Check, Crown, Gem, KeyRound, Medal, ShieldCheck } from "lucide-react";
import { MEMBERSHIP_PLANS } from "@/lib/constants";

const planVisuals = {
  silver: { icon: Medal, tone: "from-slate-400 to-slate-600", ring: "border-slate-200" },
  gold: { icon: Crown, tone: "from-amber-400 to-yellow-600", ring: "border-amber-300" },
  diamond: { icon: Gem, tone: "from-cyan-300 to-sky-600", ring: "border-sky-300" },
  royal: { icon: Crown, tone: "from-[#7b5200] via-[#d4a928] to-[#f0d775]", ring: "border-amber-400" },
} as const;

export default function SubscriptionsPage() {
  const [code, setCode] = useState("");
  const [activating, setActivating] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function activateCode() {
    if (!code.trim()) {
      setIsError(true);
      setMessage("اكتب كود التفعيل أولًا.");
      return;
    }
    setActivating(true);
    setMessage("");
    setIsError(false);
    try {
      const response = await fetch("/api/subscriptions/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تفعيل العضوية");
      setMessage("تم تفعيل عضويتك بنجاح.");
      setCode("");
    } catch (error) {
      setIsError(true);
      setMessage(error instanceof Error ? error.message : "تعذر تفعيل العضوية");
    } finally {
      setActivating(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[radial-gradient(circle_at_8%_8%,rgba(16,185,129,.08),transparent_24%),radial-gradient(circle_at_92%_20%,rgba(212,169,40,.10),transparent_22%),linear-gradient(180deg,#fffdf8,#fff8fb)] px-4 py-9 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[34px] border border-amber-100 bg-white shadow-[0_24px_80px_rgba(96,25,60,.07)]">
          <div className="grid lg:grid-cols-[1fr_360px]">
            <div className="p-7 md:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-[#7b5200] via-[#c79a1d] to-[#e9c55c] px-4 py-2 text-xs font-black text-white shadow-lg"><Gem className="h-4 w-4"/>عضويات اختيارية بعد التسجيل</span>
              <h1 className="mt-5 text-3xl font-black leading-tight text-[#38101f] md:text-5xl">الأساس مجاني، والتميّز اختيارك.</h1>
              <p className="mt-4 max-w-3xl text-sm font-bold leading-8 text-rose-600">التسجيل والبحث وتصفح الملفات وإرسال الاهتمام متاحون بدون اشتراك. يبدأ التواصل فقط بعد اهتمام متبادل بين الطرفين، والعضوية المدفوعة لا تتجاوز هذا الشرط ولا تشتري التوثيق.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["التسجيل مجاني 100%","البحث والتصفح مجاني","التواصل باهتمام متبادل","التوثيق مستقل عن الدفع"].map((item)=><span key={item} className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-800">{item}</span>)}
              </div>
            </div>
            <div className="relative min-h-[300px]"><Image src="/images/site-v2/pages/pricing/01.webp" alt="عضويات قلبي لوڤي الاختيارية" fill className="object-cover" sizes="360px" priority /></div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {MEMBERSHIP_PLANS.map((plan) => {
            const visual = planVisuals[plan.id];
            const Icon = visual.icon;
            return (
              <article key={plan.id} className={`relative overflow-hidden rounded-[30px] border bg-white p-6 shadow-[0_16px_45px_rgba(80,18,45,.06)] transition hover:-translate-y-1 ${visual.ring}`}>
                {plan.featured && <span className="absolute left-4 top-4 rounded-full bg-emerald-600 px-3 py-1 text-[9px] font-black text-white">اختيار متوازن</span>}
                {plan.id === "royal" && <span className="absolute left-4 top-4 rounded-full bg-gradient-to-l from-amber-500 to-yellow-300 px-3 py-1 text-[9px] font-black text-amber-950">أعلى مستوى</span>}
                <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${visual.tone} text-white shadow-lg`}><Icon className="h-7 w-7" /></span>
                <div className="mt-5 text-[10px] font-black text-rose-400">{plan.badge}</div>
                <h2 className="mt-1 text-xl font-black text-[#441127]">{plan.title}</h2>
                <p className="mt-1 text-xs font-bold text-rose-500">{plan.planName}</p>
                <div className="mt-5 text-4xl font-black text-[#9a6500]">{plan.price}<span className="mr-1 text-xs text-rose-500">جنيه</span></div>
                <div className="mt-5 space-y-2.5">{plan.features.map((feature)=><div key={feature} className="flex items-start gap-2 text-[11px] font-bold leading-5 text-rose-600"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600"><Check className="h-3 w-3"/></span>{feature}</div>)}</div>
                <Link href={`/payments?plan=${plan.id}`} className={`mt-6 flex h-12 items-center justify-center rounded-xl bg-gradient-to-l ${visual.tone} text-xs font-black text-white shadow-lg`}>اختيار {plan.title}</Link>
              </article>
            );
          })}
        </section>

        <section className="mt-8 rounded-[30px] border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><BadgeCheck className="h-6 w-6"/></span><div><h2 className="text-lg font-black text-[#38101f]">شارة التوثيق ليست للبيع</h2><p className="mt-1 text-xs font-bold leading-6 text-rose-500">التوثيق يظهر فقط بعد مراجعة حقيقية للحساب، سواء كان العضو مجانيًا أو مشتركًا.</p></div></div>
            <div className="flex gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-50 text-amber-600"><ShieldCheck className="h-6 w-6"/></span><div><h2 className="text-lg font-black text-[#38101f]">الدفع لا يفتح محادثة من طرف واحد</h2><p className="mt-1 text-xs font-bold leading-6 text-rose-500">قاعدة الاهتمام المتبادل ثابتة على الجميع حفاظًا على الخصوصية والجدية.</p></div></div>
          </div>
        </section>

        <section id="activation" className="mt-8 grid gap-5 lg:grid-cols-[1fr_.8fr]">
          <div className="rounded-[28px] border border-amber-100 bg-white p-6">
            <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-600"><ShieldCheck className="h-6 w-6"/></span><div><h2 className="text-xl font-black">الدفع ومراجعة الإدارة</h2><p className="text-xs font-bold text-rose-500">بعد التحويل ترفع الإيصال، والإدارة تراجع الطلب قبل تفعيل العضوية.</p></div></div>
            <Link href="/payments" className="mt-5 inline-flex rounded-xl bg-[#4f0d2d] px-5 py-3 text-xs font-black text-white">الذهاب للدفع</Link>
          </div>
          <div className="rounded-[28px] border border-rose-100 bg-white p-6">
            <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600"><KeyRound className="h-5 w-5"/></span><div><h2 className="text-xl font-black">معك كود تفعيل؟</h2><p className="text-xs font-bold text-rose-500">اكتبه كما هو لتفعيل العضوية المعتمدة.</p></div></div>
            <input value={code} onChange={(event)=>setCode(event.target.value.toUpperCase())} aria-label="كود التفعيل" className="mt-5 h-12 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-black outline-none focus:border-rose-300 focus:bg-white"/>
            <button type="button" onClick={activateCode} disabled={activating} className="mt-3 h-12 w-full rounded-2xl bg-gradient-to-l from-[#72113f] to-[#d31f69] text-sm font-black text-white disabled:opacity-50">{activating ? "جاري التفعيل..." : "تفعيل الكود"}</button>
            {message&&<div className={`mt-4 rounded-xl p-3 text-xs font-black ${isError?"bg-red-50 text-red-700":"bg-emerald-50 text-emerald-700"}`}>{message}</div>}
          </div>
        </section>
      </div>
    </main>
  );
}
