"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import PublicHeader from "@/components/shared/PublicHeader";
import MemberShell from "./MemberShell";
import { Search, Sparkles, UsersRound } from "lucide-react";

function guestVisual(pathname: string) {
  if (pathname.startsWith("/online")) return {
    banner: "/images/site-v2/route-banners/online.webp",
    accent: "emerald",
    label: "متواجدون الآن",
    images: ["/images/site-v2/members/women-hijab/01.webp", "/images/site-v2/members/men-modern/04.webp", "/images/site-v2/members/women-hijab/05.webp"],
  };
  if (pathname.startsWith("/founders")) return {
    banner: "/images/site-v2/route-banners/subscriptions.webp",
    accent: "amber",
    label: "المؤسسون",
    images: ["/images/site-v2/members/men-modern/05.webp", "/images/site-v2/members/women-hijab/04.webp", "/images/site-v2/couples/couple-08.webp"],
  };
  if (pathname.startsWith("/health-cases")) return {
    banner: "/images/site-v2/route-banners/safety.webp",
    accent: "emerald",
    label: "الحالات الصحية",
    images: ["/images/site-v2/members/women-hijab/03.webp", "/images/site-v2/members/men-modern/02.webp", "/images/site-v2/couples/couple-05.webp"],
  };
  return {
    banner: "/images/site-v2/route-banners/search.webp",
    accent: "rose",
    label: pathname.startsWith("/new-members") ? "أعضاء جدد" : pathname.startsWith("/premium-members") ? "أعضاء مميزون" : "اكتشف الأعضاء",
    images: ["/images/site-v2/members/women-hijab/04.webp", "/images/site-v2/members/men-modern/01.webp", "/images/site-v2/members/women-hijab/02.webp"],
  };
}

export default function DirectoryShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  const pathname = usePathname();
  const visual = guestVisual(pathname);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/profile", { cache: "no-store" })
      .then((response) => {
        if (active) setAuthenticated(response.ok);
      })
      .catch(() => {
        if (active) setAuthenticated(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (authenticated === true) {
    return <MemberShell title={title} subtitle={subtitle}>{children}</MemberShell>;
  }

  const accent = visual.accent === "emerald" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : visual.accent === "amber" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <div dir="rtl" className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fff9fb_0%,#ffffff_42%,#fffaf6_100%)] text-[#30101d]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Image src="/images/site-v2/floral/bg-03.webp" alt="" width={420} height={420} className="absolute -right-32 top-[30%] w-[360px] opacity-[0.08]" />
        <Image src="/images/site-v2/floral/bg-08.webp" alt="" width={420} height={420} className="absolute -left-36 top-[62%] w-[390px] opacity-[0.07]" />
      </div>
      <PublicHeader />
      <main className="relative z-10 mx-auto w-full max-w-[1450px] px-4 py-7 sm:px-6 lg:px-8">
        <section className="mb-7 overflow-hidden rounded-[32px] border border-rose-100 bg-white shadow-[0_18px_55px_rgba(83,16,47,.08)]">
          <div className="relative min-h-[310px] overflow-hidden">
            <Image src={visual.banner} alt="" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.16)_0%,rgba(255,255,255,.26)_42%,rgba(255,255,255,.92)_70%,rgba(255,255,255,.98)_100%)]" />
            <div className="relative z-10 grid min-h-[310px] items-center gap-5 p-6 lg:grid-cols-[1.15fr_.85fr] lg:p-8">
              <div className="max-w-3xl rounded-[28px] border border-white/85 bg-white/72 p-5 shadow-[0_18px_40px_rgba(91,17,52,.08)] backdrop-blur-md">
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black ${accent}`}><Search className="h-3.5 w-3.5" />{visual.label}</span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-700"><Sparkles className="h-3.5 w-3.5" />تصفح بدون تسجيل</span>
                </div>
                <h1 className="mt-4 text-3xl font-black text-[#3b1021] sm:text-4xl">{title}</h1>
                <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-rose-600">{subtitle}</p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/75 px-4 py-3 text-[11px] font-black text-emerald-700"><UsersRound className="h-4 w-4" />يمكنك فتح الملفات العامة بدون تسجيل؛ التسجيل المجاني مطلوب فقط عند التفاعل.</p>
              </div>

              <div className="hidden lg:block">
                <div className="relative mr-auto h-[235px] w-[350px]">
                  <GuestPhoto src={visual.images[0]} cls="absolute right-12 top-0 h-[175px] w-[145px] rotate-[6deg] z-20" />
                  <GuestPhoto src={visual.images[1]} cls="absolute left-8 top-10 h-[165px] w-[140px] -rotate-[7deg] z-10" />
                  <GuestPhoto src={visual.images[2]} cls="absolute bottom-0 right-[112px] h-[125px] w-[160px] rotate-[2deg] z-30" />
                </div>
              </div>
            </div>
          </div>
        </section>
        {children}
      </main>
    </div>
  );
}

function GuestPhoto({ src, cls }: { src: string; cls: string }) {
  return <div className={`${cls} overflow-hidden rounded-[22px] border-[6px] border-white bg-white shadow-[0_20px_45px_rgba(83,16,47,.17)]`}><Image src={src} alt="" fill className="object-cover" sizes="170px" /></div>;
}
