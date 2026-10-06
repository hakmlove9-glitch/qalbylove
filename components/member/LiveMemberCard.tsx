"use client";

import Image from "next/image";
import { BadgeCheck, Camera, Crown, Heart, MapPin, MessageCircle, UserRound } from "lucide-react";
import { useState } from "react";
import MemberProfileModal, { prefetchMemberProfile } from "./MemberProfileModal";
import { fallbackAvatar } from "@/lib/avatar-fallback";
import CountryFlag from "@/components/CountryFlag";
import { COUNTRY_CODES } from "@/lib/constants";

type Member = {
  id: string;
  member_number?: number | null;
  username?: string | null;
  display_name?: string | null;
  full_name?: string | null;
  age?: number | null;
  city?: string | null;
  governorate?: string | null;
  country?: string | null;
  gender?: string | null;
  marital_status?: string | null;
  image?: string | null;
  avatar_url?: string | null;
  is_online?: boolean;
  is_premium?: boolean;
  is_founder?: boolean;
  verified?: boolean;
  membership_tier?: string | null;
  photos_locked?: boolean;
  has_photos?: boolean;
  approved_photo_count?: number;
  hijab_style?: string | null;
  beard_style?: string | null;
};

export default function LiveMemberCard({ member }: { member: Member; index?: number }) {
  const [liked, setLiked] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [mutual, setMutual] = useState(false);
  const [feedback, setFeedback] = useState("");

  const name = member.display_name || member.username || member.full_name || "عضو قلبي لوفي";
  const fallback = fallbackAvatar(member.gender, member.age, {
    hijabStyle: member.hijab_style,
    beardStyle: member.beard_style,
    seed: member.id,
  });
  const realImage = member.has_photos && !member.photos_locked && !imageFailed ? (member.image || member.avatar_url || "") : "";
  const image = realImage || fallback;
  const place = member.city || member.governorate || member.country || "";
  const countryCode = member.country === "مصر" ? "eg" : COUNTRY_CODES[String(member.country || "")];

  function openProfile() {
    setProfileOpen(true);
  }

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
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "تعذر إرسال الاهتمام");
      setLiked(true);
      setFeedback(data?.message || "تم إرسال الاهتمام.");
      const statusResponse = await fetch(`/api/interactions/status?member_id=${encodeURIComponent(member.id)}`, { cache: "no-store" });
      const statusData = statusResponse.ok ? await statusResponse.json() : null;
      setMutual(Boolean(statusData?.state?.mutual));
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "تعذر إرسال الاهتمام");
    } finally {
      setBusy(false);
    }
  }

  function openConversation() {
    if (!mutual) {
      openProfile();
      return;
    }
    window.dispatchEvent(new CustomEvent("qalbylove:open-chat", {
      detail: { memberId: member.id, memberName: name, avatarUrl: image },
    }));
  }

  return (
    <>
      <article
        onPointerEnter={() => prefetchMemberProfile(member.id)}
        onFocus={() => prefetchMemberProfile(member.id)}
        className={`group relative overflow-hidden rounded-[24px] border bg-white p-4 shadow-[0_10px_28px_rgba(76,18,41,.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(76,18,41,.11)] ${member.is_founder ? "border-amber-300 ring-1 ring-amber-100" : "border-rose-100"
          }`}
      >
        <div className="absolute right-3 top-3 z-10 flex flex-wrap gap-1">
          {member.is_founder && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2 py-1 text-[9px] font-black text-amber-950 shadow-sm">
              <Crown className="h-3 w-3" /> مؤسس
            </span>
          )}
          {member.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-[9px] font-black text-white shadow-sm">
              <BadgeCheck className="h-3 w-3" /> موثق
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={openProfile}
          className="block w-full rounded-[18px] text-center outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
          aria-label={`فتح ملف ${name}`}
        >
          <span className={`relative mx-auto block h-[82px] w-[82px] overflow-hidden rounded-full bg-[#fff9fb] ring-4 ${member.is_founder ? "ring-amber-100" : "ring-rose-50"}`}>
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="82px"
              onError={() => setImageFailed(true)}
            />
            <span className={`absolute bottom-1 left-1 h-3 w-3 rounded-full ring-[3px] ring-white ${member.is_online ? "bg-emerald-500" : "bg-rose-300"}`} />
          </span>

          {!realImage && (
            <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-black text-rose-500">
              <Camera className="h-3 w-3" /> صورة افتراضية
            </span>
          )}

          <b className="mt-1.5 block truncate text-[15px] font-black text-[#35101f] transition group-hover:text-rose-700">{name}</b>

          <span className="mt-1 flex min-h-[18px] items-center justify-center gap-1.5 text-[11px] font-black text-rose-700">
            {member.age ? <span>{member.age} سنة</span> : null}
            {member.age && place ? <span className="text-rose-300">•</span> : null}
            {place ? (
              <span className="inline-flex max-w-[130px] items-center gap-1 truncate">
                {countryCode && <CountryFlag code={countryCode} size={14} />}
                <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                <span className="truncate">{place}</span>
              </span>
            ) : null}
          </span>

          <span className="mt-1.5 block min-h-[18px] truncate text-[10px] font-extrabold text-rose-600">
            {member.marital_status || ""}
            {member.marital_status && member.country ? " · " : ""}
            {member.country || ""}
          </span>
        </button>

        <div className="mt-3 grid grid-cols-[42px_1fr_42px] items-center gap-2 border-t border-rose-50 pt-3">
          <button
            type="button"
            onClick={sendInterest}
            disabled={busy || liked}
            aria-label="إرسال اهتمام"
            title={liked ? "تم إرسال الاهتمام" : "إرسال اهتمام"}
            className={`ql-heart-action grid h-10 w-10 place-items-center rounded-full border shadow-sm transition ${liked ? "border-rose-600 bg-rose-600 text-white" : "border-rose-100 bg-white text-rose-400 hover:border-rose-300 hover:text-rose-600"
              }`}
          >
            <Heart className="h-5 w-5" fill={liked ? "currentColor" : "none"} />
          </button>

          <button
            type="button"
            onClick={openProfile}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-3 text-[10px] font-black text-rose-800 transition hover:bg-rose-100"
          >
            <UserRound className="h-3.5 w-3.5" /> الملف الكامل
          </button>

          <button
            type="button"
            onClick={openConversation}
            className="grid h-10 w-10 place-items-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
            aria-label={mutual ? "فتح المحادثة" : "عرض الملف لبدء تواصل"}
            title={mutual ? "فتح المحادثة" : "المراسلة بعد الاهتمام المتبادل"}
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>
        {feedback && <p className="mt-2 text-center text-[9px] font-bold text-rose-600" role="status">{feedback}</p>}
      </article>

      <MemberProfileModal memberId={member.id} open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
