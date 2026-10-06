"use client";

import Image from "next/image";
import { BadgeCheck, Camera, Crown, Heart, MapPin } from "lucide-react";
import { useState } from "react";
import type { PublicHomeMember } from "@/lib/public-home";
import MemberProfileModal from "@/components/member/MemberProfileModal";

export default function HomeMemberCard({ member }: { member: PublicHomeMember }) {
  const [src, setSrc] = useState(member.image || member.fallbackImage);
  const [profileOpen, setProfileOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(false);
  const usingFallback = src === member.fallbackImage || !member.hasRealPhoto;

  async function sendInterest() {
    if (busy || liked) return;
    setBusy(true);
    try {
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_id: member.id }),
      });
      if (response.status === 401) {
        window.location.href = `/signup?next=${encodeURIComponent(`/member/${member.id}`)}`;
        return;
      }
      if (response.ok) setLiked(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <article className={`group relative overflow-hidden rounded-[26px] border bg-white shadow-[0_14px_35px_rgba(88,17,48,.08)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_48px_rgba(88,17,48,.14)] ${member.founder ? "border-amber-300 ring-1 ring-amber-100" : "border-rose-100"}`}>
        <button type="button" onClick={() => setProfileOpen(true)} className="block w-full text-right">
          <div className="relative h-[220px] overflow-hidden bg-[#fff7fa]">
            {usingFallback ? (
              <Image src={member.fallbackImage} alt="صورة افتراضية للعضو" fill sizes="(max-width: 768px) 50vw, 240px" className="object-cover transition duration-500 group-hover:scale-[1.035]" />
            ) : (
              <Image src={src} alt={member.name} fill quality={76} sizes="(max-width: 768px) 50vw, 240px" className="object-cover transition duration-500 group-hover:scale-[1.035]" onError={() => setSrc(member.fallbackImage)} />
            )}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#3c1029]/85 via-[#3c1029]/35 to-transparent" />

            <div className="absolute right-3 top-3 flex gap-1.5">
              {member.founder && <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1.5 text-[9px] font-black text-amber-950 shadow-sm"><Crown className="h-3 w-3" /> مؤسس</span>}
              {member.verified && <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white shadow"><BadgeCheck className="h-4 w-4" /></span>}
            </div>

            <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between gap-2 text-white">
              <div className="min-w-0">
                <b className="block truncate text-[17px] font-black drop-shadow-sm">{member.name}</b>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-white/90">
                  {member.age ? <span>{member.age} سنة</span> : null}
                  {member.age && member.city ? <span className="opacity-60">•</span> : null}
                  {member.city ? <span className="inline-flex min-w-0 items-center gap-1"><MapPin className="h-3.5 w-3.5 shrink-0" /><span className="truncate">{member.city}</span></span> : null}
                </div>
              </div>
              <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-white/25 bg-white/16 px-2.5 py-1 text-[9px] font-black backdrop-blur ${member.online ? "text-emerald-100" : "text-white/80"}`}>
                <span className={`h-2 w-2 rounded-full ${member.online ? "bg-emerald-400" : "bg-white/50"}`} />
                {member.online ? "متواجد الآن" : "ملف عام"}
              </span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 p-3">
          <button type="button" onClick={() => setProfileOpen(true)} className="flex-1 rounded-xl bg-rose-50 px-3 py-2.5 text-[10px] font-black text-rose-700 transition hover:bg-rose-100">عرض الملف</button>
          <button type="button" onClick={sendInterest} disabled={busy || liked} aria-label="إرسال اهتمام" className={`ql-heart-action grid h-10 w-10 place-items-center rounded-xl border transition ${liked ? "border-rose-600 bg-rose-600 text-white" : "border-rose-100 bg-white text-rose-400 hover:border-rose-300 hover:text-rose-600"}`}><Heart className="h-4.5 w-4.5" fill={liked ? "currentColor" : "none"} /></button>
        </div>

        {usingFallback && <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/70 bg-white/88 px-2 py-1 text-[8px] font-black text-rose-500 shadow-sm backdrop-blur"><Camera className="h-3 w-3" /> صورة مناسبة مؤقتًا</div>}
      </article>
      <MemberProfileModal memberId={member.id} open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
