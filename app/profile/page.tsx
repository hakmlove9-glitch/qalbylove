"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Camera,
  GraduationCap,
  Heart,
  HeartHandshake,
  MapPin,
  Pencil,
  Ruler,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import MemberShell from "@/components/member/MemberShell";
import AdamHawaGuide from "@/components/member/AdamHawaGuide";
import { fallbackAvatar } from "@/lib/avatar-fallback";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [completion, setCompletion] = useState<any>({ percentage: 0, missing: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/profile/completion", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([profileData, completionData]) => {
        setProfile(profileData.profile || null);
        setCompletion(completionData || { percentage: 0, missing: [] });
      })
      .finally(() => setLoading(false));
  }, []);

  const photo = useMemo(() => {
    if (!profile) return "";
    return (
      profile.photos?.find((item: any) => item.is_primary)?.image_url ||
      profile.photos?.[0]?.image_url ||
      fallbackAvatar(profile.gender, profile.age, {
        hijabStyle: profile.hijab_style,
        beardStyle: profile.beard_style,
        seed: profile.id || profile.username,
      })
    );
  }, [profile]);

  if (loading) {
    return <MemberShell title="ملفي الشخصي"><div className="rounded-[28px] bg-white p-12 text-center font-black">جاري تجهيز ملفك...</div></MemberShell>;
  }

  if (!profile) {
    return <MemberShell title="ملفي الشخصي"><div className="rounded-[28px] bg-white p-10 text-center font-black">تعذر تحميل ملفك الآن.</div></MemberShell>;
  }

  return (
    <MemberShell username={profile.username} title="ملفي الشخصي" subtitle="شاهد ملفك كما يظهر بصورة مرتبة، وعدّل أي جزء من زر واحد.">
      <section className="overflow-hidden rounded-[34px] border border-rose-100 bg-white shadow-[0_22px_70px_rgba(78,16,45,.09)]">
        <div className="relative min-h-[250px] bg-gradient-to-l from-[#4b0828] via-[#78133f] to-[#b82766]">
          <Image src="/images/site-v2/pages/member-profile/02.webp" alt="" fill className="object-cover opacity-25" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#401023]/95 via-[#661237]/75 to-transparent" />
        </div>
        <div className="relative px-5 pb-7 md:px-8">
          <div className="-mt-20 flex flex-col items-center gap-4 md:flex-row md:items-end">
            <div className="relative h-40 w-40 overflow-hidden rounded-full bg-white ring-8 ring-white shadow-2xl">
              <img src={photo} alt={profile.username} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 text-center md:pb-3 md:text-right">
              <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                <h1 className="text-3xl font-black text-[#4a0d2b]">{profile.username}</h1>
                {profile.is_founder && <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black text-amber-700">عضو مؤسس</span>}
              </div>
              <p className="mt-2 text-sm font-bold text-rose-500">
                {[profile.age && `${profile.age} سنة`, profile.governorate, profile.city].filter(Boolean).join(" • ")}
              </p>
            </div>
            <div className="flex gap-2 md:pb-3">
              <Link href="/profile/edit" className="inline-flex items-center gap-2 rounded-xl bg-[#5b0c31] px-5 py-3 text-xs font-black text-white"><Pencil className="h-4 w-4" />تعديل ملفي</Link>
              <Link href={`/member/${profile.id}`} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-xs font-black text-rose-700"><UserRound className="h-4 w-4" />كما يراه الآخرون</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Card title="نبذة عني" icon={<Sparkles />}>
            <p className="text-sm font-bold leading-8 text-rose-600">{profile.bio || "لم تتم إضافة نبذة بعد."}</p>
          </Card>

          <Card title="بياناتي الأساسية" icon={<UserRound />}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Info icon={<MapPin />} label="الإقامة" value={[profile.governorate, profile.city].filter(Boolean).join(" - ") || profile.country} />
              <Info icon={<Heart />} label="الحالة الاجتماعية" value={profile.marital_status} />
              <Info icon={<GraduationCap />} label="المؤهل" value={profile.education} />
              <Info icon={<Briefcase />} label="العمل" value={profile.job} />
              <Info icon={<Ruler />} label="الطول" value={profile.height ? `${profile.height} سم` : ""} />
              <Info icon={<ShieldCheck />} label="الصحة" value={profile.health_status} />
            </div>
          </Card>

          <Card title="شخصيتي واهتماماتي" icon={<Heart />}>
            <Tags title="صفاتي" values={profile.personality_traits || []} />
            <Tags title="اهتماماتي" values={profile.interests || []} />
          </Card>

          <Card title="شريك الحياة الذي أبحث عنه" icon={<HeartHandshake />}>
            <p className="text-sm font-bold leading-8 text-rose-600">{profile.partner_specs || "لم تتم إضافة مواصفات الشريك بعد."}</p>
          </Card>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[28px] bg-[#3d0b20] p-5 text-white">
            <div className="flex items-center justify-between"><span className="text-sm font-black">اكتمال الملف</span><span className="text-3xl font-black">{completion.percentage || 0}%</span></div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-l from-rose-300 to-amber-200" style={{ width: `${completion.percentage || 0}%` }} /></div>
            {completion.missing?.length > 0 && <div className="mt-4 rounded-xl bg-white/10 p-3 text-[10px] font-bold leading-5 text-rose-50">الناقص: {completion.missing.slice(0, 5).join("، ")}</div>}
            <Link href="/profile/edit" className="mt-4 flex h-11 items-center justify-center rounded-xl bg-white text-xs font-black text-rose-700">استكمال الملف</Link>
          </div>
          <AdamHawaGuide gender={profile.gender} completion={completion.percentage || 0} />
        </aside>
      </section>
    </MemberShell>
  );
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_14px_38px_rgba(80,18,45,.05)]"><div className="mb-4 flex items-center gap-2 text-lg font-black text-[#47102a]"><span className="text-rose-500 [&>svg]:h-5 [&>svg]:w-5">{icon}</span>{title}</div>{children}</section>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | number }) {
  return <div className="rounded-2xl bg-rose-50 p-4"><div className="flex items-center gap-2 text-[10px] font-black text-rose-400"><span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>{label}</div><div className="mt-2 text-sm font-black text-rose-700">{value || "غير محدد"}</div></div>;
}

function Tags({ title, values }: { title: string; values: string[] }) {
  return <div className="mt-3"><div className="text-xs font-black text-rose-500">{title}</div><div className="mt-2 flex flex-wrap gap-2">{values.length ? values.map((item) => <span key={item} className="rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-black text-rose-700">{item}</span>) : <span className="text-xs font-bold text-rose-400">لم تتم الإضافة بعد</span>}</div></div>;
}
