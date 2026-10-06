"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Heart, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { fallbackAvatar } from "@/lib/avatar-fallback";

interface MemberCardProps {
  id: string;
  name: string;
  age?: number;
  city?: string;
  image?: string;
  status?: string;
  interests?: string[];
  matchScore?: number;
  isOnline?: boolean;
  gender?: string;
}

function avatarFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return `/avatars/members/member-${String((hash % 40) + 1).padStart(2, "0")}.png`;
}

export default function MemberCard({ id, name, age, city, image, status, interests = [], matchScore, isOnline = false, gender }: MemberCardProps) {
  const avatar = image || fallbackAvatar(gender, age, { seed: id }) || avatarFor(id);
  return (
    <article dir="rtl" className="group overflow-hidden rounded-[26px] border border-rose-100 bg-white shadow-[0_18px_55px_rgba(104,23,56,.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_70px_rgba(104,23,56,.13)]">
      <div className="relative aspect-[4/4.55] overflow-hidden bg-gradient-to-br from-rose-50 via-white to-sky-50">
        <Image src={avatar} alt={`صورة ${name}`} fill sizes="(max-width:640px) 88vw,(max-width:1024px) 45vw,270px" className="object-cover transition duration-700 group-hover:scale-[1.035]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2a0617]/88 via-transparent to-transparent" />
        <div className="absolute right-3 top-3 flex flex-wrap gap-2">{status && <span className="rounded-full border border-white/60 bg-white/92 px-3 py-1.5 text-[10px] font-black text-rose-600 shadow-sm backdrop-blur">{status}</span>}</div>
        {matchScore && <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/92 px-3 py-1.5 text-[10px] font-black text-violet-600 shadow-sm backdrop-blur"><Sparkles className="h-3.5 w-3.5" />{matchScore}% توافق</div>}
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <div className="flex items-end justify-between gap-3">
            <div><h3 className="flex items-center gap-1.5 text-xl font-black">{name}<BadgeCheck className="h-4 w-4 fill-emerald-500/20 text-emerald-300" />{age ? <span className="text-base font-extrabold text-white/90">، {age}</span> : null}</h3>{city && <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-white/80"><MapPin className="h-3.5 w-3.5" />{city}</p>}</div>
            {isOnline && <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-black text-white shadow"><span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse" />متصل الآن</span>}
          </div>
        </div>
      </div>
      <div className="p-4">
        {interests.length > 0 && <div className="flex flex-wrap gap-2">{interests.slice(0, 3).map((interest) => <span key={interest} className="rounded-full bg-[#fff2f6] px-3 py-1.5 text-[10px] font-black text-rose-600">{interest}</span>)}</div>}
        <div className="mt-4 grid grid-cols-[1fr_auto_auto] gap-2">
          <Link href={`/member/${id}`} className="rounded-2xl bg-gradient-to-l from-[#b40b4d] to-[#e61e62] px-4 py-3 text-center text-xs font-black text-white shadow-[0_10px_24px_rgba(190,24,93,.18)] transition hover:-translate-y-0.5">مشاهدة الملف</Link>
          <Link href="/favorites" aria-label="إضافة إلى قائمة الاهتمام" className="grid h-11 w-11 place-items-center rounded-2xl border border-rose-200 text-rose-600 transition hover:bg-rose-50"><Heart className="h-4.5 w-4.5" /></Link>
          <Link href={`/messages/${id}`} aria-label="إرسال رسالة" className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"><MessageCircle className="h-4.5 w-4.5" /></Link>
        </div>
      </div>
    </article>
  );
}
