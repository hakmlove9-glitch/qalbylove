"use client";

import Link from "next/link";
import { BookHeart, Clock3, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import MemberShell from "@/components/member/MemberShell";
import { knowledgeArticles } from "@/lib/knowledge/articles";

const categoryIcon: Record<string, React.ReactNode> = {
  "البداية": <Sparkles className="h-4 w-4" />,
  "التعارف": <HeartHandshake className="h-4 w-4" />,
  "الخطوبة": <BookHeart className="h-4 w-4" />,
  "الأمان": <ShieldCheck className="h-4 w-4" />,
  "الاستعداد للزواج": <BookHeart className="h-4 w-4" />,
};

export default function KnowledgePage() {
  return (
    <MemberShell title="مركز المعرفة" subtitle="محتوى عملي وقصير يساعدك من أول تعارف لحد قرار الزواج، من غير تنظير أو كلام محفوظ.">
      <section className="rounded-[32px] bg-gradient-to-l from-[#451027] via-[#78133f] to-[#b01f61] p-6 text-white shadow-[0_25px_70px_rgba(90,16,52,.2)] md:p-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black"><BookHeart className="h-4 w-4" /> معرفة تقرّبك من قرار أنضج</span>
          <h2 className="mt-4 text-2xl font-black md:text-4xl">مش هدفنا إنك تقضي وقت أطول هنا… هدفنا إنك توصل لاختيار أوضح.</h2>
          <p className="mt-3 text-sm font-semibold leading-8 text-rose-100">اقرأ على قد السؤال اللي عندك. كل موضوع قصير، عملي، ومكتوب بلغة بسيطة تناسب رحلة التعارف الجاد.</p>
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {knowledgeArticles.map((article) => (
          <article key={article.slug} className="rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_14px_40px_rgba(75,16,42,.05)]">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-black text-rose-700">{categoryIcon[article.category]} {article.category}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400"><Clock3 className="h-3.5 w-3.5" /> {article.readMinutes} دقائق</span>
            </div>
            <h3 className="mt-4 text-lg font-black leading-8 text-rose-900">{article.title}</h3>
            <p className="mt-2 text-xs font-semibold leading-7 text-rose-500">{article.summary}</p>
            <details className="group mt-4 rounded-2xl bg-rose-50 p-4">
              <summary className="cursor-pointer list-none text-xs font-black text-rose-600">افتح الموضوع كاملًا</summary>
              <div className="mt-4 space-y-4">{article.sections.map((section) => <div key={section.title}><h4 className="text-xs font-black text-rose-800">{section.title}</h4><p className="mt-1 text-xs font-semibold leading-7 text-rose-500">{section.body}</p></div>)}</div>
            </details>
          </article>
        ))}
      </section>
      <section className="mt-6 rounded-[28px] border border-rose-100 bg-white p-6 text-center"><ShieldCheck className="mx-auto h-8 w-8 text-rose-600" /><h3 className="mt-3 text-xl font-black">لو في موقف مقلق، النصيحة وحدها مش كفاية.</h3><p className="mt-2 text-sm font-semibold text-rose-500">ادخل مركز الأمان واعرف تتصرف فورًا لو حصل طلب أموال، ابتزاز، إساءة أو شك في حساب.</p><Link href="/safety-center" className="ql-btn-primary mt-4 inline-flex">فتح مركز الأمان</Link></section>
    </MemberShell>
  );
}
