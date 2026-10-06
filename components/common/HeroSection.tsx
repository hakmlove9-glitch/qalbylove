"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Gem, Heart, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

const stats = [
  { value: "+5,000", label: "عضو نشط", icon: Heart },
  { value: "+1,200", label: "قصة نجاح", icon: UsersRound },
  { value: "موثوق", label: "بيئة أكثر أمانًا", icon: ShieldCheck },
  { value: "مميزة", label: "مزايا أكثر خصوصية", icon: Gem },
];

export default function HeroSection() {
  return (
    <section dir="rtl" className="px-4 pt-4 sm:px-6 sm:pt-5">
      <div className="relative mx-auto min-h-[590px] max-w-7xl overflow-hidden rounded-[34px] border border-white/30 bg-[#320816] shadow-[0_30px_90px_rgba(63,9,31,.20)] sm:min-h-[620px] lg:min-h-[650px]">
        <Image
          src="/slide4.png"
          alt="زوجان في أجواء رومانسية هادئة"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,4,15,.78)_0%,rgba(60,7,27,.54)_44%,rgba(30,3,12,.22)_76%,rgba(15,2,8,.08)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(32,3,14,.94)_0%,rgba(45,6,21,.20)_42%,rgba(0,0,0,.03)_100%)]" />
        <div className="absolute -right-20 top-4 h-72 w-72 rounded-full bg-rose-300/15 blur-3xl" />

        <div className="relative z-10 flex min-h-[590px] flex-col justify-between px-6 pb-6 pt-10 sm:min-h-[620px] sm:px-9 sm:pb-8 lg:min-h-[650px] lg:px-14 lg:pb-10 lg:pt-14">
          <div className="mr-auto max-w-2xl text-right lg:mr-0 lg:max-w-[660px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-xs font-black text-white shadow-lg backdrop-blur-md">
              <BadgeCheck className="h-4 w-4 text-rose-200" />
              مساحة مصرية للزواج الجاد والتعارف باحترام
            </div>

            <h1 className="mt-6 max-w-[640px] text-[46px] font-black leading-[1.12] tracking-normal text-white sm:text-6xl lg:text-[72px]">
              ابدأ رحلتك نحو
              <span className="mt-1 block bg-gradient-to-l from-[#ffd2df] via-[#ffb7cf] to-white bg-clip-text text-transparent">شريك الحياة المناسب</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm font-bold leading-7 text-white/86 sm:text-base sm:leading-8">
              قلبي لوڤي مساحة دافئة تساعدك على التعارف الجاد واكتشاف أشخاص أقرب لشخصيتك واهتماماتك وهدفك من الزواج.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-[#bd0f50] to-[#f02e72] px-6 py-3.5 text-sm font-black text-white shadow-[0_18px_38px_rgba(205,20,85,.34)] transition hover:-translate-y-0.5">
                <Heart className="h-4 w-4 fill-white" />
                إنشاء حساب الآن
              </Link>
              <Link href="/search" className="rounded-full border border-white/45 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/18">
                اكتشف الأعضاء
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold text-white/75 sm:text-xs">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-rose-200" /> خصوصية ووضوح</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-rose-200" /> ملفات أكثر اكتمالًا</span>
              <span className="inline-flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-rose-200" /> هدف جاد من البداية</span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="group flex items-center gap-3 rounded-[22px] border border-white/18 bg-white/10 px-4 py-3.5 shadow-lg backdrop-blur-xl transition hover:bg-white/14">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10 text-rose-200 ring-1 ring-white/10">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span>
                  <strong className="block text-lg font-black text-white">{value}</strong>
                  <span className="mt-0.5 block text-[10px] font-bold text-white/65">{label}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
