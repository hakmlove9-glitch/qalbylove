"use client";

import Image from "next/image";
import Link from "next/link";
import MemberShell from "@/components/member/MemberShell";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";

const cards = [{"title": "المقاس أولًا", "text": "البدلة المضبوطة على الجسم أهم من الماركة. الكتف والطول والبنطلون لازم يكونوا مناسبين."}, {"title": "لون مناسب", "text": "الكحلي والفحمي خيارات عملية وأنيقة، والاختيار النهائي يعتمد على وقت ومكان المناسبة."}, {"title": "تفاصيل قليلة", "text": "قميص مرتب وحذاء نظيف وإكسسوارات بسيطة كفاية لطلّة محترمة ومريحة."}];

export default function Page() {
  return (
    <MemberShell title="اختار بدلتك" subtitle="دليل بسيط للعريس يساعده يختار بدلة مناسبة لجسمه وطبيعة المناسبة ووقت الحفل.">
      <section className="overflow-hidden rounded-[30px] border border-rose-100 bg-white shadow-[0_18px_55px_rgba(80,18,45,.06)]">
        <div className="grid lg:grid-cols-[1fr_360px]">
          <div className="p-7">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-black text-rose-700"><Sparkles className="h-3.5 w-3.5"/>دليل قلبي لوڤي</span>
            <h2 className="mt-4 text-3xl font-black text-[#4b0d2b]">اختار بدلتك</h2>
            <p className="mt-3 max-w-2xl text-sm font-bold leading-8 text-rose-500">دليل بسيط للعريس يساعده يختار بدلة مناسبة لجسمه وطبيعة المناسبة ووقت الحفل.</p>
          </div>
          <div className="relative min-h-[260px]"><Image src="/images/site-v2/pages/member-profile/02.webp" alt="اختار بدلتك" fill className="object-cover" sizes="360px"/></div>
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map((card:any)=><article key={card.title} className="rounded-[26px] border border-rose-100 bg-white p-5 shadow-[0_12px_35px_rgba(80,18,45,.05)]"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-rose-600"><Heart className="h-4 w-4"/></span><h3 className="mt-4 text-lg font-black">{card.title}</h3><p className="mt-2 text-xs font-bold leading-7 text-rose-500">{card.text}</p></article>)}
      </section>
      <div className="mt-6 flex justify-end"><Link href="/knowledge" className="inline-flex items-center gap-2 rounded-xl bg-[#5a0b31] px-5 py-3 text-xs font-black text-white">المزيد من مركز المعرفة <ArrowLeft className="h-4 w-4"/></Link></div>
    </MemberShell>
  );
}
