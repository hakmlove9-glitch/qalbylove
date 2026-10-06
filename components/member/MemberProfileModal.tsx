"use client";

import Image from "next/image";
import {
  BadgeCheck,
  Briefcase,
  Crown,
  Eye,
  HeartPulse,
  Images,
  LockKeyhole,
  MapPin,
  Ruler,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import MemberInteractionButtons, { InteractionState } from "./MemberInteractionButtons";
import MemberSafetyNotice from "./MemberSafetyNotice";
import MarriageRequestButton from "./MarriageRequestButton";
import ReportMemberModal from "./ReportMemberModal";
import CompatibilityBreakdown from "./CompatibilityBreakdown";
import MemberContactButton from "@/components/common/MemberContactButton";
import { fallbackAvatar } from "@/lib/avatar-fallback";
import CountryFlag from "@/components/CountryFlag";
import { COUNTRY_CODES } from "@/lib/constants";

type Profile = Record<string, any> & {
  id: string;
  username?: string;
  photos?: Array<{ image_url?: string; url?: string; is_primary?: boolean }>;
  interactions?: InteractionState;
  is_premium?: boolean;
  is_founder?: boolean;
  verified?: boolean;
  membership_tier?: string | null;
  is_online?: boolean;
  photos_locked?: boolean;
  photo_visibility?: "all" | "mutual" | "request" | "private";
  photo_access_status?: string | null;
  approved_photo_count?: number;
  has_photos?: boolean;
  viewer_authenticated?: boolean;
};

const profileCache = new Map<string, Profile>();
const profileRequests = new Map<string, Promise<Profile>>();

async function loadMemberProfile(memberId: string) {
  const cached = profileCache.get(memberId);
  if (cached) return cached;
  const pending = profileRequests.get(memberId);
  if (pending) return pending;

  const request = fetch(`/api/member-profile?id=${encodeURIComponent(memberId)}`, { cache: "no-store" })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "تعذر تحميل الملف");
      if (!data?.profile) throw new Error("تعذر تحميل الملف");
      profileCache.set(memberId, data.profile);
      return data.profile as Profile;
    })
    .finally(() => profileRequests.delete(memberId));

  profileRequests.set(memberId, request);
  return request;
}

export function prefetchMemberProfile(memberId: string) {
  void loadMemberProfile(memberId).catch(() => undefined);
}

export default function MemberProfileModal({
  memberId,
  open,
  onClose,
}: {
  memberId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [photoRequestStatus, setPhotoRequestStatus] = useState<string | null>(null);
  const [photoRequestMessage, setPhotoRequestMessage] = useState("");
  const [viewerId, setViewerId] = useState("");

  useEffect(() => {
    if (!open) return;
    let active = true;
    fetch("/api/profile", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (active) setViewerId(String(data?.profile?.id || "")); })
      .catch(() => { if (active) setViewerId(""); });
    return () => { active = false; };
  }, [open]);

  useEffect(() => {
    if (!open || !memberId) return;
    const cached = profileCache.get(memberId);
    if (cached) {
      setProfile(cached);
      setPhotoRequestStatus(cached.photo_access_status || null);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setProfile(null);
    loadMemberProfile(memberId)
      .then((loaded) => {
        setProfile(loaded);
        setPhotoRequestStatus(loaded.photo_access_status || null);
      })
      .catch((requestError) =>
        setError(requestError instanceof Error ? requestError.message : "تعذر تحميل الملف"),
      )
      .finally(() => setLoading(false));
  }, [memberId, open]);

  useEffect(() => {
    if (!open || !memberId) return;
    fetch("/api/profile-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewed_id: memberId }),
    }).catch(() => undefined);
  }, [memberId, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, open]);

  const image = useMemo(() => {
    if (!profile) return fallbackAvatar("male", 30);
    const primary = profile.photos?.find((photo) => photo.is_primary) || profile.photos?.[0];
    return (
      primary?.image_url ||
      primary?.url ||
      profile.avatar_url ||
      fallbackAvatar(profile.gender, profile.age)
    );
  }, [profile]);
  const countryCode = profile?.country === "مصر" ? "eg" : COUNTRY_CODES[String(profile?.country || "")];

  async function requestPhotoAccess() {
    if (!profile?.id) return;
    if (profile.viewer_authenticated === false) {
      window.location.href = `/signup?next=${encodeURIComponent(`/member/${profile.id}`)}`;
      return;
    }
    setPhotoRequestMessage("");
    const response = await fetch("/api/photos/privacy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "request", ownerId: profile.id }),
    });
    const data = await response.json();
    if (!response.ok) {
      setPhotoRequestMessage(data.error || "تعذر إرسال الطلب");
      return;
    }
    setPhotoRequestStatus("pending");
    setPhotoRequestMessage("تم إرسال طلب مشاهدة الصور لصاحب الملف.");
  }

  if (!open || !memberId) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-[#2d0718]/60 backdrop-blur-[3px]"
      dir="rtl"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="member-profile-modal-title" className="absolute left-1/2 top-1/2 max-h-[94vh] w-[min(900px,96vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[34px] border border-rose-100 bg-[#fff9fb] shadow-[0_30px_90px_rgba(45,7,24,.32)]">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-rose-100 bg-white/95 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div>
            <div id="member-profile-modal-title" className="text-[11px] font-black text-rose-600">ملف عضو قلبي لوڤي</div>
            <div className="mt-0.5 text-sm font-black text-[#3a0c20]">
              كل التفاصيل في شاشة واحدة واضحة
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-4 p-5 sm:p-6">
            <div className="h-[190px] animate-pulse rounded-[32px] bg-rose-100" />
            <div className="h-28 animate-pulse rounded-[28px] bg-white" />
            <div className="h-48 animate-pulse rounded-[28px] bg-white" />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="rounded-[28px] border border-red-100 bg-red-50 p-8 text-sm font-black text-red-700">
              {error}
            </div>
          </div>
        ) : profile ? (
          <div className="p-4 sm:p-6">
            <section className="relative overflow-hidden rounded-[30px] border border-rose-100 bg-gradient-to-l from-white via-[#fff9fb] to-rose-50/70 p-5 shadow-[0_18px_45px_rgba(45,7,24,.10)] sm:p-6">
              <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-amber-100/50 blur-3xl" />
              <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                <div className="relative shrink-0">
                  <div className={`relative h-28 w-28 overflow-hidden rounded-full bg-white ring-[5px] ${profile.is_founder ? "ring-amber-100" : "ring-rose-100"} sm:h-32 sm:w-32`}>
                    <Image
                      src={profile.photos_locked ? fallbackAvatar(profile.gender, profile.age) : image}
                      alt={profile.username || "عضو"}
                      fill
                      className={profile.photos_locked ? "object-contain p-2" : "object-cover"}
                      sizes="128px"
                    />
                    <span className={`absolute bottom-2 left-2 h-4 w-4 rounded-full ring-[3px] ring-white ${profile.is_online ? "bg-emerald-500" : "bg-rose-300"}`} />
                  </div>
                  {profile.photos_locked && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-black text-amber-800">
                      صور خاصة
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1 text-center sm:text-right">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <h2 className="text-2xl font-black tracking-normal text-[#35101f] sm:text-3xl">
                      {profile.display_name || profile.username || profile.full_name || "عضو قلبي لوڤي"}
                    </h2>
                    {profile.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-black text-white">
                        <BadgeCheck className="h-3.5 w-3.5" /> موثّق
                      </span>
                    )}
                    {profile.is_founder && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-black text-amber-950">
                        <Crown className="h-3.5 w-3.5" /> مؤسس
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-black text-rose-600 sm:justify-start">
                    {profile.age && <span>{profile.age} سنة</span>}
                    {profile.marital_status && <span>{profile.marital_status}</span>}
                    {(profile.city || profile.governorate || profile.country) && (
                      <span className="inline-flex items-center gap-1">
                        {countryCode && <CountryFlag code={countryCode} size={16} />}
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        {[profile.country, profile.governorate, profile.city].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <MiniStat label="رقم العضوية" value={profile.member_number} />
                    <MiniStat label="آخر زيارة" value={profile.is_online ? "متواجد الآن" : formatLastSeen(profile.last_seen)} tone={profile.is_online ? "green" : "default"} />
                    <MiniStat label="تاريخ التسجيل" value={formatDate(profile.created_at)} className="col-span-2 sm:col-span-1" />
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-4 rounded-[28px] border border-rose-100 bg-white p-4 shadow-[0_14px_34px_rgba(70,14,37,.05)] sm:p-5">
              <MemberInteractionButtons
                memberId={profile.id}
                memberName={profile.display_name || profile.username || "العضو"}
                initial={profile.interactions}
                authenticated={profile.viewer_authenticated !== false}
                onReport={() => setReportOpen(true)}
              />
              {viewerId && viewerId !== profile.id && <div className="mt-3 border-t border-rose-50 pt-3"><MarriageRequestButton memberId={profile.id} /></div>}
              {viewerId && viewerId !== profile.id && <div className="mt-3 border-t border-rose-50 pt-3"><MemberContactButton memberId={profile.id} currentMemberId={viewerId} /></div>}
            </div>

            {profile.photos_locked && profile.has_photos && (
              <section className="mt-4 overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-[0_14px_34px_rgba(70,14,37,.05)]">
                <div className="h-1.5 bg-gradient-to-l from-amber-300 via-rose-400 to-rose-600" />
                <div className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-amber-700">
                        <Images className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="text-base font-black text-[#4b0d2b]">
                          لديه {profile.approved_photo_count || 0}{" "}
                          {Number(profile.approved_photo_count || 0) === 1 ? "صورة خاصة" : "صور خاصة"}
                        </div>
                        <div className="mt-1 text-[11px] font-bold leading-5 text-rose-600">
                          الصور موجودة بالفعل، لكن ظهورها يحترم إعداد الخصوصية الذي اختاره صاحب الملف.
                        </div>
                      </div>
                    </div>

                    {profile.photo_visibility === "request" && photoRequestStatus !== "approved" && (
                      <button
                        type="button"
                        disabled={photoRequestStatus === "pending"}
                        onClick={() => void requestPhotoAccess()}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-[#a71450] to-[#e22d6d] px-4 py-2.5 text-[11px] font-black text-white shadow-lg shadow-rose-100 disabled:opacity-60"
                      >
                        <UserCheck className="h-4 w-4" />
                        {photoRequestStatus === "pending" ? "تم إرسال الطلب" : "طلب مشاهدة الصور"}
                      </button>
                    )}

                    {profile.photo_visibility === "mutual" && (
                      <span className="rounded-full bg-rose-50 px-3 py-2 text-[10px] font-black text-rose-700">
                        تظهر بعد اهتمام متبادل
                      </span>
                    )}

                    {profile.photo_visibility === "private" && (
                      <span className="rounded-full bg-rose-100 px-3 py-2 text-[10px] font-black text-rose-600">
                        خاصة بصاحب الحساب
                      </span>
                    )}
                  </div>
                  {photoRequestMessage && (
                    <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[10px] font-black text-amber-700">
                      {photoRequestMessage}
                    </div>
                  )}
                </div>
              </section>
            )}

            {!profile.photos_locked && (profile.photos?.length || 0) > 1 && (
              <section className="mt-4 rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_12px_28px_rgba(70,14,37,.04)]">
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-[#3a0c20]">
                  <Eye className="h-4 w-4 text-rose-600" />
                  صور العضو
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {profile.photos?.slice(0, 8).map((photo, index) => (
                    <div
                      key={`${photo.image_url || photo.url}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-2xl bg-rose-100"
                    >
                      <Image
                        src={photo.image_url || photo.url || image}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-4">
              <MemberSafetyNotice
                onReport={() => {
                  if (profile.viewer_authenticated === false) {
                    window.location.href = `/signup?next=${encodeURIComponent(`/member/${profile.id}`)}`;
                    return;
                  }
                  setReportOpen(true);
                }}
              />
            </div>

            <CompatibilityBreakdown memberId={profile.id} />

            {profile.voice_intro_url && (
              <section className="mt-4 rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_12px_28px_rgba(70,14,37,.04)]">
                <h3 className="text-sm font-black text-[#3a0c20]">اسمع تعريفه بصوته</h3>
                <p className="mt-1 text-xs font-bold text-rose-600">
                  تعريف صوتي اختياري قصير من العضو.
                </p>
                <audio controls src={profile.voice_intro_url} className="mt-4 h-11 w-full" />
              </section>
            )}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InfoCard
                title="بيانات العضوية"
                icon={<Sparkles className="h-4 w-4" />}
                rows={[
                  ["رقم العضوية", profile.member_number],
                  ["الحالة الآن", profile.is_online ? "متواجد الآن" : formatLastSeen(profile.last_seen)],
                  ["تاريخ التسجيل", formatDate(profile.created_at)],
                ]}
              />
              <InfoCard
                title="السكن والحالة الاجتماعية"
                icon={<MapPin className="h-4 w-4" />}
                rows={[
                  ["الجنسية", profile.nationality || profile.country],
                  ["مكان الإقامة", [profile.country, profile.governorate, profile.city].filter(Boolean).join(" - ")],
                  ["الحالة العائلية", profile.marital_status],
                  ["الأبناء", profile.has_children === true ? (profile.children_count ? `${profile.children_count} أبناء` : "لديه أبناء") : profile.has_children === false ? "بدون أطفال" : null],
                  ["إقامة الأبناء", profile.children_living],
                  ["نوع / نية الزواج", profile.marriage_type || profile.marriage_intent],
                  ["السكن بعد الزواج", profile.housing_plan || profile.housing],
                  ["الفترة المتوقعة للزواج", profile.marriage_timeline],
                ]}
              />
              <InfoCard
                title="الدين ونمط الحياة"
                icon={<ShieldCheck className="h-4 w-4" />}
                rows={[
                  ["الالتزام الديني", profile.religiosity || profile.religious_level],
                  ["الصلاة", profile.prayer_status],
                  ["التدخين", profile.smoking],
                  ["نمط الملابس", profile.clothing_style],
                ]}
              />
              <InfoCard
                title="المظهر والصحة"
                icon={<Ruler className="h-4 w-4" />}
                rows={[
                  ["لون البشرة", profile.skin_color],
                  ["لون العينين", profile.eye_color],
                  ["لون الشعر", profile.hair_color],
                  ["الطول", profile.height ? `${profile.height} سم` : null],
                  ["الوزن", profile.weight ? `${profile.weight} كجم` : null],
                  ["بنية الجسم", profile.body_type],
                  [profile.gender === "female" ? "الحجاب" : "اللحية", profile.gender === "female" ? profile.hijab_style : profile.beard_style],
                  ["الحالة الصحية", profile.health_status],
                  ["تفاصيل صحية", profile.health_details],
                ]}
              />
              <InfoCard
                title="الدراسة والعمل"
                icon={<Briefcase className="h-4 w-4" />}
                rows={[
                  ["المؤهل التعليمي", profile.education],
                  ["حالة العمل", profile.work_status],
                  ["مجال العمل", profile.job_field],
                  ["الوظيفة", profile.job],
                  ["الدخل الشهري", profile.monthly_income || profile.income],
                  ["الوضع المادي", profile.financial_status],
                ]}
              />
              <InfoCard
                title="الشخصية والاهتمامات"
                icon={<HeartPulse className="h-4 w-4" />}
                rows={[
                  ["الشخصية", readable(profile.personality_traits)],
                  ["الاهتمامات", readable(profile.interests)],
                  ["الهوايات", readable(profile.hobbies)],
                ]}
              />
            </div>

            <TextCard title="مواصفاتي أنا" text={profile.bio || profile.about_me || ""} />
            <TextCard title="مواصفات شريك حياتي" text={profile.partner_preferences || profile.partner_specs || profile.partner_description || ""} />

            <div className="mt-4 rounded-[28px] border border-rose-100 bg-gradient-to-l from-rose-50 to-pink-50 p-5">
              <div className="text-sm font-black text-rose-800">ابدأ بهدوء وباحترام</div>
              <p className="mt-1 text-xs font-bold leading-6 text-rose-800/90">
                لو لفتك الملف، أرسل اهتمامًا أولًا. وعند تبادل الاهتمام بينكما تُفتح المحادثة داخل المنصة تلقائيًا.
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {profile && (
        <ReportMemberModal
          open={reportOpen}
          memberId={profile.id}
          memberName={profile.display_name || profile.username || "العضو"}
          onClose={() => setReportOpen(false)}
        />
      )}
    </div>
  );
}

function MiniStat({ label, value, tone = "default", className = "" }: { label: string; value: any; tone?: "default" | "green"; className?: string }) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  return (
    <div className={`rounded-2xl border border-rose-100 bg-white px-3 py-2.5 ${className}`}>
      <div className="text-[9px] font-black text-rose-600">{label}</div>
      <div className={`mt-1 truncate text-[11px] font-black ${tone === "green" ? "text-emerald-600" : "text-rose-700"}`}>{String(value)}</div>
    </div>
  );
}

function InfoCard({
  title,
  icon,
  rows,
}: {
  title: string;
  icon: React.ReactNode;
  rows: Array<[string, any]>;
}) {
  const visible = rows.filter(
    ([, value]) => value !== null && value !== undefined && String(value).trim() !== "",
  );
  if (!visible.length) return null;

  return (
    <section className="rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_12px_28px_rgba(70,14,37,.04)]">
      <div className="flex items-center gap-2 text-sm font-black text-[#3a0c20]">
        <span className="text-rose-600">{icon}</span>
        {title}
      </div>
      <dl className="mt-4 space-y-3">
        {visible.map(([label, value]) => (
          <div
            key={label}
            className="flex items-start justify-between gap-4 border-b border-rose-50 pb-2 last:border-0"
          >
            <dt className="text-xs font-bold text-rose-500">{label}</dt>
            <dd className="max-w-[65%] text-left text-xs font-black text-rose-800">{String(value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function TextCard({ title, text }: { title: string; text: string }) {
  return (
    <section className="mt-4 rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_12px_28px_rgba(70,14,37,.04)]">
      <h3 className="text-sm font-black text-[#3a0c20]">{title}</h3>
      <p className="mt-3 whitespace-pre-wrap text-sm font-bold leading-7 text-rose-700">{text && String(text).trim() ? text : "لا توجد بيانات"}</p>
    </section>
  );
}

function formatDate(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ar-EG", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

function formatLastSeen(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `منذ ${Math.max(minutes, 1)} دقيقة`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

function readable(value: unknown) {
  if (Array.isArray(value)) return value.join("، ");
  if (typeof value === "object" && value)
    return Object.values(value as Record<string, unknown>)
      .filter(Boolean)
      .join("، ");
  return value ? String(value) : "";
}
