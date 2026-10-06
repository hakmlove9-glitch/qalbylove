"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, UserPlus, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "الرئيسية", href: "/" },
  { label: "اكتشف الأعضاء", href: "/search" },
  { label: "المتواجدون الآن", href: "/online" },
  { label: "قصص النجاح", href: "/stories" },
  { label: "مقالات ونصائح", href: "/knowledge" },
  { label: "الباقات", href: "/pricing" },
] as const;

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[80] border-b border-[#f5dbe4] bg-white/95 shadow-[0_10px_36px_rgba(79,15,42,.08)] backdrop-blur-xl" dir="rtl">
      <div className="ql-container flex min-h-[76px] items-center justify-between gap-4 py-2">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="relative grid h-12 w-12 place-items-center rounded-[18px] bg-[linear-gradient(145deg,#ff6d9a,#c20d50_64%,#7a082e)] text-white shadow-[0_10px_28px_rgba(194,13,80,.28)] transition group-hover:-translate-y-0.5">
            <Heart className="h-6 w-6" fill="currentColor" />
            <span className="absolute -left-1 -top-1 h-3.5 w-3.5 rounded-full bg-[#ffbfd2]/80 blur-[1px]" />
          </span>
          <span>
            <b className="block text-[22px] font-black leading-none text-[#97113f]">قلبي لوڤي</b>
            <small className="mt-1 block text-[10px] font-extrabold text-[#df648a]">حيث تبدأ حياة أجمل</small>
          </span>
        </Link>

        <nav className="hidden items-center gap-1.5 xl:flex">
          {links.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2.5 text-[12px] font-black transition ${
                  active
                    ? "bg-[#fff0f5] text-[#bd0d4d] shadow-sm ring-1 ring-[#f7cfdd]"
                    : "text-[#4e3440] hover:bg-[#fff5f8] hover:text-[#bd0d4d]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/search" aria-label="بحث" className="grid h-10 w-10 place-items-center rounded-full text-[#4b5362] transition hover:bg-[#fff1f5] hover:text-[#bd0d4d]">
            <Search className="h-4.5 w-4.5" />
          </Link>
          <Link href="/login" className="rounded-xl border border-[#f0a8bf] bg-white px-5 py-3 text-sm font-black text-[#bd0d4d] transition hover:-translate-y-0.5 hover:bg-[#fff5f8]">
            تسجيل الدخول
          </Link>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,#a70943,#e01b62,#ff5c8d)] px-5 py-3 text-sm font-black text-white shadow-[0_12px_28px_rgba(194,13,80,.25)] transition hover:-translate-y-0.5">
            <UserPlus className="h-4 w-4" /> إنشاء حساب
          </Link>
        </div>

        <button onClick={() => setOpen((v) => !v)} aria-label="القائمة" className="grid h-11 w-11 place-items-center rounded-xl border border-[#f3d3de] bg-[#fff6f8] text-[#bd0d4d] xl:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#f5dbe4] bg-white/98 p-4 shadow-xl xl:hidden">
          <div className="ql-container grid gap-2 sm:grid-cols-2">
            {links.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl bg-[#fff6f8] px-4 py-3 text-sm font-black text-[#7e173a] ring-1 ring-[#f5dbe4]">
                {item.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-xl border border-[#f0a8bf] px-4 py-3 text-center text-sm font-black text-[#bd0d4d]">تسجيل الدخول</Link>
            <Link href="/signup" onClick={() => setOpen(false)} className="rounded-xl bg-[linear-gradient(135deg,#a70943,#ff477f)] px-4 py-3 text-center text-sm font-black text-white">إنشاء حساب</Link>
          </div>
        </div>
      )}
    </header>
  );
}
