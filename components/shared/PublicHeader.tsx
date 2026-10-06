"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Crown, Globe2, Headphones, Heart, Info, Mail, Search, UserPlus } from "lucide-react";


const nav = [
  { label: "الرئيسية", href: "/", cls: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100" },
  { label: "بحث", href: "/search", cls: "border-rose-200 bg-white text-rose-700 hover:bg-rose-50" },
  { label: "المتواجدون الآن", href: "/online", cls: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
  { label: "أعضاء جدد", href: "/new-members", cls: "border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100" },
  { label: "المتميزون", href: "/premium-members", cls: "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100" },
  { label: "المؤسسون", href: "/founders", cls: "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100" },
  { label: "الحالات الصحية", href: "/health-cases", cls: "border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100" },
] as const;

type FounderState = { founders?: number; remaining?: number; limit?: number };

export default function PublicHeader() {
  const pathname = usePathname();
  const [founder, setFounder] = useState<FounderState | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/founders/remaining", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => { if (active && data) setFounder(data); })
      .catch(() => { });
    return () => { active = false; };
  }, []);

  const founderOpen = Boolean(founder && founder.remaining != null && founder.remaining > 0);
  const founderText = founder?.remaining != null
    ? `متبقي ${founder.remaining.toLocaleString("ar-EG")} مكان في عضوية المؤسسين`
    : "عضوية المؤسسين لأول 1000 عضو حقيقي";

  return (
    <>
      {founderOpen && <div className="relative z-[130] overflow-hidden bg-[linear-gradient(90deg,#55102f,#7e1745_52%,#55102f)] text-white">
        <div className="mx-auto flex min-h-[38px] w-full max-w-[1500px] items-center justify-between gap-3 px-4 text-[10px] font-black sm:px-6 lg:px-8">
          <span className="flex min-w-0 items-center gap-2 truncate"><Crown className="h-4 w-4 shrink-0 text-amber-300" />{founderText}</span>
          <div className="hidden items-center gap-4 text-white/88 md:flex">
            <Link href="/about" className="inline-flex items-center gap-1.5 hover:text-white"><Info className="h-3.5 w-3.5" />من نحن</Link>
            <Link href="/contact" className="inline-flex items-center gap-1.5 hover:text-white"><Mail className="h-3.5 w-3.5" />اتصل بنا</Link>
            <Link href="/help" className="inline-flex items-center gap-1.5 hover:text-white"><Headphones className="h-3.5 w-3.5" />مساعدة</Link>
            <span className="inline-flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5" />العربية</span>
          </div>
        </div>
      </div>}

      <header className="ql-reference-header sticky top-0 z-[120] border-b border-rose-100/80 bg-white/95 shadow-[0_8px_28px_rgba(88,13,43,.06)] backdrop-blur-xl">
        <div className="relative overflow-hidden">
          <div className="relative mx-auto flex min-h-[76px] w-full max-w-[1500px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="ml-auto flex shrink-0 items-center gap-2" aria-label="قلبي لوڤي - الرئيسية">
              <span className="relative hidden h-[62px] w-[92px] overflow-hidden rounded-[22px] sm:block">
                <Image src="/images/site-v2/couples/couple-03.webp" alt="" fill priority className="object-cover object-center" sizes="92px" />
                <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.03),rgba(255,255,255,.78)_92%)]" />
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[linear-gradient(135deg,#ff5a90,#be0f4d)] text-white shadow-[0_10px_25px_rgba(216,27,91,.22)]"><Heart className="h-6 w-6" fill="currentColor" /></span>
              <span><b className="block text-xl font-black tracking-normal text-[#74133c] sm:text-2xl">قلبي لوڤي</b><small className="block text-[9px] font-black text-rose-500 sm:text-[10px]">حيث تبدأ حياة أجمل</small></span>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-1.5 xl:flex" aria-label="التنقل الرئيسي">
              {nav.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return <Link key={item.href} href={item.href} className={`rounded-full border px-4 py-2 text-xs font-black shadow-[0_4px_12px_rgba(88,13,43,.04)] transition duration-200 hover:-translate-y-0.5 ${item.cls} ${active ? "ring-2 ring-rose-200/80" : ""}`}>{item.label}</Link>;
              })}
            </nav>

            <Link href="/search" className="hidden h-10 w-10 place-items-center rounded-full border border-rose-200 bg-white text-rose-600 shadow-sm transition hover:border-rose-200 hover:text-rose-600 lg:grid" aria-label="بحث"><Search className="h-5 w-5" /></Link>
            <div className="flex shrink-0 items-center gap-2">
              <Link href="/login" className="inline-flex rounded-full border border-rose-300 bg-white px-3 py-2.5 text-[10px] font-black text-rose-600 shadow-sm sm:hidden">دخول</Link>
              <Link href="/login" className="hidden rounded-full border border-rose-300 bg-white px-5 py-2.5 text-xs font-black text-rose-600 shadow-sm transition hover:bg-rose-50 sm:inline-flex">تسجيل الدخول</Link>
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#b00f49,#ff4d82)] px-4 py-2.5 text-xs font-black text-white shadow-[0_10px_24px_rgba(217,22,87,.22)] sm:px-5"><UserPlus className="h-4 w-4" />إنشاء حساب</Link>
            </div>
          </div>

          <nav className="mx-auto flex w-full max-w-[1500px] gap-2 overflow-x-auto px-4 pb-2.5 xl:hidden sm:px-6 lg:px-8" aria-label="التنقل السريع">
            {nav.map((item) => <Link key={item.href} href={item.href} className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[10px] font-black ${item.cls}`}>{item.label}</Link>)}
          </nav>
        </div>
      </header>
    </>
  );
}
