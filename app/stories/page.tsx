"use client";

import Link from "next/link";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";

export default function StoriesPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-[linear-gradient(180deg,#fffdfd,#fff7fa)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-[36px] border border-rose-100 bg-white shadow-[0_24px_80px_rgba(80,18,45,.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.08fr_.92fr]">
            <div className="p-8 md:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-700">
                <Heart className="h-4 w-4" fill="currentColor" /> قصص حقيقية فقط
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight text-[#3d0d24] md:text-5xl">لما تحصل أول قصة نجاح حقيقية، هتظهر هنا باسم أصحابها بعد موافقتهم.</h1>
              <p className="mt-4 max-w-2xl text-sm font-bold leading-8 text-rose-600">
                قلبي لوڤي منصة جديدة، ومش هنملأ الصفحة بقصص أو أرقام وهمية. القسم ده مخصص لتجارب حقيقية يتم مراجعتها قبل النشر، مع احترام خصوصية أصحابها بالكامل.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/contact" className="rounded-2xl bg-gradient-to-l from-[#ef2d69] to-[#b20f4e] px-6 py-3 text-sm font-black text-white shadow-lg">اسألنا عن مشاركة قصتك</Link>
                <Link href="/signup" className="rounded-2xl border border-rose-200 bg-white px-6 py-3 text-sm font-black text-rose-700">ابدأ رحلتك</Link>
              </div>
            </div>
            <div className="relative min-h-[340px] bg-[radial-gradient(circle_at_50%_30%,rgba(255,196,215,.62),transparent_18rem),linear-gradient(145deg,#4b0d2d,#a91557)]">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="w-full max-w-sm rounded-[30px] border border-white/20 bg-white/10 p-7 text-center text-white shadow-2xl backdrop-blur">
                  <Sparkles className="mx-auto h-8 w-8 text-amber-300" />
                  <div className="mt-4 text-2xl font-black">المصداقية قبل الأرقام</div>
                  <div className="mt-3 text-sm font-bold leading-7 text-white/80">لا قصة نجاح تُنشر إلا بعد مراجعة وموافقة أصحابها.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7 grid gap-5 md:grid-cols-3">
          {[
            ["لا قصص مختلقة", "القسم يبدأ فارغًا ويكبر مع نجاحات حقيقية فقط."],
            ["مراجعة قبل النشر", "أي قصة تمر على الإدارة قبل ظهورها للزوار."],
            ["خصوصية كاملة", "الأسماء والصور لا تُنشر إلا بالموافقة الصريحة."],
          ].map(([title,text]) => (
            <article key={title} className="rounded-[28px] border border-rose-100 bg-white p-6 shadow-[0_14px_38px_rgba(80,18,45,.05)]">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <h2 className="mt-4 text-lg font-black text-[#3d0d24]">{title}</h2>
              <p className="mt-2 text-xs font-bold leading-6 text-rose-500">{text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
