"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  BookOpen,
  Camera,
  ChevronDown,
  Crown,
  Gem,
  Heart,
  HeartHandshake,
  HeartPulse,
  Home,
  Images,
  KeyRound,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  UserSearch,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { fallbackAvatar } from "@/lib/avatar-fallback";


type TopNavItem = {
  label: string;
  href: string;
  Icon: any;
  style: string;
  soft: string;
  premium: boolean;
};

const topNav: TopNavItem[] = [
  { label: "الرئيسية", href: "/dashboard", Icon: Home, style: "from-[#b20f4e] to-[#ef2d69]", soft: "bg-rose-50 text-rose-700", premium: false },
  { label: "البحث", href: "/search", Icon: Search, style: "from-[#8f123f] to-[#d51f60]", soft: "bg-rose-50 text-rose-700", premium: false },
  { label: "المتواجدون الآن", href: "/online", Icon: UsersRound, style: "from-[#a7164f] to-[#e54b79]", soft: "bg-rose-50 text-rose-700", premium: false },
  { label: "أعضاء جدد", href: "/new-members", Icon: Sparkles, style: "from-[#c41459] to-[#f06a8f]", soft: "bg-rose-50 text-rose-700", premium: false },
  { label: "المؤسسون", href: "/founders", Icon: Crown, style: "from-[#a7651f] via-[#d7a33c] to-[#f1d778]", soft: "bg-amber-50 text-amber-800", premium: false },
  { label: "باقات التميّز", href: "/subscriptions", Icon: Gem, style: "from-[#946300] via-[#d5a724] to-[#f0d36e]", soft: "bg-amber-50 text-amber-800", premium: true },
  { label: "الحالات الصحية", href: "/health-cases", Icon: HeartPulse, style: "from-[#7f173f] to-[#d82c67]", soft: "bg-rose-50 text-rose-700", premium: false },
];

const accountNav = [
  { label: "ملفي الشخصي", href: "/profile", Icon: UserRound },
  { label: "تعديل بياناتي", href: "/profile/edit", Icon: Settings },
  { label: "صورتي وصوري", href: "/photos", Icon: Images },
  { label: "الإشعارات", href: "/notifications", Icon: Bell },
  { label: "الرسائل", href: "/messages", Icon: MessageCircle },
  { label: "قائمة الاهتمام", href: "/favorites", Icon: Heart },
  { label: "من يهتم بي", href: "/who-likes-me", Icon: UserSearch },
  { label: "توافق الاهتمام", href: "/mutual-interests", Icon: HeartHandshake },
  { label: "من زار بياناتي", href: "/profile-views", Icon: UsersRound },
  { label: "امتيازاتي", href: "/privileges", Icon: Crown },
  { label: "تفعيل كود التميّز", href: "/subscriptions#activation", Icon: KeyRound },
  { label: "اشتراكي الحالي", href: "/my-subscription", Icon: BadgeCheck },
  { label: "مركز المعرفة", href: "/knowledge", Icon: BookOpen },
  { label: "مركز الأمان", href: "/safety-center", Icon: ShieldAlert },
  { label: "الإعدادات", href: "/settings", Icon: ShieldCheck },
] as const;

const quickMenu = [
  { label: "ملفي الشخصي", href: "/profile", Icon: UserRound },
  { label: "مشاهدة ملفي كما يراه الآخرون", href: "/profile", Icon: BadgeCheck },
  { label: "تعديل بياناتي", href: "/profile/edit", Icon: Settings },
  { label: "صورتي وصوري", href: "/photos", Icon: Images },
  { label: "الخصوصية والإعدادات", href: "/settings", Icon: ShieldCheck },
  { label: "الإشعارات", href: "/notifications", Icon: Bell },
  { label: "باقاتي وامتيازاتي", href: "/my-subscription", Icon: Crown },
  { label: "تفعيل كود", href: "/subscriptions#activation", Icon: KeyRound },
  { label: "مركز الأمان", href: "/safety-center", Icon: ShieldAlert },
] as const;

type Props = {
  children: React.ReactNode;
  username?: string;
  title?: string;
  subtitle?: string;
  unreadNotifications?: number;
};



type BannerMeta = {
  banner: string;
  badgePrimary: string;
  badgeSecondary: string;
  sideTitle: string;
  sideText: string;
  progress: string;
};

function memberBannerMeta(pathname: string): BannerMeta {
  if (pathname.startsWith("/messages")) return { banner: "/images/site-v2/route-banners/messages.webp", badgePrimary: "رسائل واضحة ومحترمة", badgeSecondary: "محادثات أسهل", sideTitle: "تنظيم الرسائل", sideText: "كل محادثة ظاهرة بوضوح مع وصول أسرع للردود المهمة.", progress: "64%" };
  if (pathname.startsWith("/profile") || pathname.startsWith("/myaccount")) return { banner: "/images/site-v2/route-banners/profile.webp", badgePrimary: "ملف أنيق وجذاب", badgeSecondary: "تفاصيل مرتبة", sideTitle: "بناء الانطباع الأول", sideText: "اجعل بياناتك أوضح، وصورتك أجمل، ونبذتك أصدق.", progress: "82%" };
  if (pathname.startsWith("/photos") || pathname.startsWith("/gallery") || pathname.startsWith("/member-photos")) return { banner: "/images/site-v2/route-banners/photos.webp", badgePrimary: "صور أوضح لكل عضو", badgeSecondary: "عرض أجمل", sideTitle: "ألبومك الشخصي", sideText: "اختر صورًا متنوعة ومرتبة لتزيد جاذبية الملف وثقة الزوار.", progress: "71%" };
  if (pathname.startsWith("/safety") || pathname.startsWith("/reports") || pathname.startsWith("/block")) return { banner: "/images/site-v2/route-banners/safety.webp", badgePrimary: "خصوصية وأمان", badgeSecondary: "هدوء نفسي", sideTitle: "أدوات الحماية", sideText: "إبلاغ، حظر، وضبط خصوصية في مكان واحد وبواجهة سهلة.", progress: "90%" };
  if (pathname.startsWith("/settings")) return { banner: "/images/site-v2/route-banners/settings.webp", badgePrimary: "تحكم كامل", badgeSecondary: "خيارات أوضح", sideTitle: "إعداداتك المريحة", sideText: "خصص تجربتك بالطريقة التي تناسبك بدون تعقيد.", progress: "58%" };
  if (pathname.startsWith("/subscriptions") || pathname.startsWith("/pricing") || pathname.startsWith("/my-subscription")) return { banner: "/images/site-v2/route-banners/subscriptions.webp", badgePrimary: "امتيازات اختيارية", badgeSecondary: "شكل فاخر", sideTitle: "قيمة إضافية", sideText: "تعرف على الباقات بصورة جذابة وواضحة بعيدًا عن الزحام.", progress: "76%" };
  if (pathname.startsWith("/search") || pathname.startsWith("/members") || pathname.startsWith("/new-members") || pathname.startsWith("/premium-members") || pathname.startsWith("/founders")) return { banner: "/images/site-v2/route-banners/search.webp", badgePrimary: "اكتشاف أعضاء أوضح", badgeSecondary: "نتائج مريحة", sideTitle: "رحلة البحث", sideText: "فلترة أسهل وصور أقوى وبطاقات تعرض أهم المعلومات من أول نظرة.", progress: "68%" };
  if (pathname.startsWith("/online")) return { banner: "/images/site-v2/route-banners/online.webp", badgePrimary: "أعضاء متواجدون الآن", badgeSecondary: "تفاعل أسرع", sideTitle: "نبض المنصة", sideText: "اعرف من المتواجد الآن وابدأ الاهتمام أو الرسالة في الوقت المناسب.", progress: "73%" };
  if (pathname.startsWith("/knowledge")) return { banner: "/images/site-v2/route-banners/knowledge.webp", badgePrimary: "محتوى نافع", badgeSecondary: "فهم أعمق", sideTitle: "معرفة تبني الثقة", sideText: "مقالات وإرشادات تساعدك على اتخاذ قرارات أفضل في كل مرحلة.", progress: "61%" };
  return { banner: "/images/site-v2/route-banners/dashboard.webp", badgePrimary: "واجهة أغنى بالصور", badgeSecondary: "ألوان مريحة", sideTitle: "لوحة تحكم نابضة", sideText: "روابط سريعة، أقسام أوضح، وتجربة أهدأ من أول زيارة.", progress: "79%" };
}

function routeHeroVariant(pathname: string) {
  if (pathname.startsWith("/messages")) return "messages" as const;
  if (pathname.startsWith("/profile") || pathname.startsWith("/myaccount")) return "profile" as const;
  if (pathname.startsWith("/photos") || pathname.startsWith("/gallery") || pathname.startsWith("/member-photos")) return "photos" as const;
  if (pathname.startsWith("/safety") || pathname.startsWith("/reports") || pathname.startsWith("/block")) return "safety" as const;
  if (pathname.startsWith("/settings")) return "settings" as const;
  if (pathname.startsWith("/subscriptions") || pathname.startsWith("/pricing") || pathname.startsWith("/my-subscription")) return "subscriptions" as const;
  if (pathname.startsWith("/search") || pathname.startsWith("/members") || pathname.startsWith("/new-members") || pathname.startsWith("/premium-members") || pathname.startsWith("/founders")) return "search" as const;
  if (pathname.startsWith("/online")) return "online" as const;
  if (pathname.startsWith("/knowledge")) return "knowledge" as const;
  return "dashboard" as const;
}

function MemberRouteHero({ variant, bannerMeta, title, subtitle, shownPhoto, loadedName }: { variant: ReturnType<typeof routeHeroVariant>; bannerMeta: BannerMeta; title?: string; subtitle?: string; shownPhoto: string; loadedName: string }) {
  const portraitSets = {
    dashboard: ["/images/site-v2/members/women-hijab/02.webp", "/images/site-v2/members/men-modern/03.webp", "/images/site-v2/couples/couple-04.webp"],
    search: ["/images/site-v2/members/women-hijab/04.webp", "/images/site-v2/members/men-modern/01.webp", "/images/site-v2/members/women-hijab/05.webp"],
    online: ["/images/site-v2/members/men-modern/04.webp", "/images/site-v2/members/women-hijab/01.webp", "/images/site-v2/members/men-modern/02.webp"],
    messages: ["/images/site-v2/members/women-hijab/03.webp", "/images/site-v2/members/men-modern/05.webp", "/images/site-v2/couples/couple-07.webp"],
    profile: [shownPhoto, "/images/site-v2/members/women-hijab/02.webp", "/images/site-v2/members/men-modern/03.webp"],
    photos: ["/images/site-v2/members/women-hijab/05.webp", "/images/site-v2/couples/couple-03.webp", "/images/site-v2/members/men-modern/01.webp"],
    safety: ["/images/site-v2/route-banners/safety.webp", "/images/site-v2/members/women-hijab/01.webp", "/images/site-v2/members/men-modern/04.webp"],
    settings: ["/images/site-v2/members/men-modern/02.webp", "/images/site-v2/members/women-hijab/03.webp", "/images/site-v2/couples/couple-05.webp"],
    subscriptions: ["/images/site-v2/couples/couple-08.webp", "/images/site-v2/members/women-hijab/04.webp", "/images/site-v2/members/men-modern/05.webp"],
    knowledge: ["/images/site-v2/knowledge/knowledge-01.webp", "/images/site-v2/members/women-hijab/05.webp", "/images/site-v2/members/men-modern/03.webp"],
  } as const;
  const pics = portraitSets[variant];
  const accent = variant === "online" || variant === "search" || variant === "safety" ? "emerald" : variant === "subscriptions" || variant === "knowledge" ? "amber" : "rose";
  const accentBadge = accent === "emerald" ? "border-emerald-200 bg-emerald-50/90 text-emerald-700" : accent === "amber" ? "border-amber-200 bg-amber-50/90 text-amber-700" : "border-rose-200 bg-rose-50/90 text-rose-700";

  if (variant === "messages") {
    return <div className="mb-6 overflow-hidden rounded-[32px] border border-rose-100 bg-white shadow-[0_18px_55px_rgba(91,17,52,.08)]"><div className="grid min-h-[285px] lg:grid-cols-[1.05fr_.95fr]"><div className="relative overflow-hidden bg-gradient-to-br from-[#57102f] via-[#8f174d] to-[#c9336d] p-7 text-white"><div className="absolute inset-0 opacity-22"><Image src={bannerMeta.banner} alt="" fill className="object-cover" sizes="520px" /></div><div className="relative z-10 max-w-xl"><span className="inline-flex rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-[10px] font-black backdrop-blur">{bannerMeta.badgePrimary}</span>{title && <h1 className="mt-4 text-3xl font-black md:text-4xl">{title}</h1>}{subtitle && <p className="mt-2 text-sm font-bold leading-7 text-white/82">{subtitle}</p>}<div className="mt-5 space-y-2"><div className="mr-auto w-[72%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[11px] font-black text-[#53102f] shadow">رسالة واضحة ومحترمة من غير زحمة.</div><div className="ml-auto w-[64%] rounded-2xl rounded-br-md bg-emerald-500 px-4 py-3 text-[11px] font-black text-white shadow">والرد ظاهر في مكانه بسهولة.</div></div></div></div><div className="relative overflow-hidden bg-[#fff8fb] p-6"><div className="absolute -left-8 -bottom-10 h-40 w-40 opacity-20"><Image src="/images/site-v2/floral/bg-18.webp" alt="" fill className="object-contain" /></div><div className="relative z-10 flex h-full items-center justify-center gap-4"><MiniPortrait src={pics[0]} label="محادثة" rotate="-rotate-3" /><MiniPortrait src={pics[1]} label="توافق" rotate="rotate-3" /></div></div></div></div>;
  }

  if (variant === "profile") {
    return <div className="mb-6 overflow-hidden rounded-[32px] border border-rose-100 bg-white shadow-[0_18px_55px_rgba(91,17,52,.08)]"><div className="relative min-h-[300px] overflow-hidden"><Image src={bannerMeta.banner} alt="" fill className="object-cover" sizes="100vw" /><div className="absolute inset-0 bg-gradient-to-l from-white/96 via-white/84 to-white/25" /><div className="relative z-10 grid min-h-[300px] items-center gap-6 p-6 lg:grid-cols-[1fr_340px]"><div><div className="flex flex-wrap gap-2"><span className={`rounded-full border px-3 py-1.5 text-[10px] font-black ${accentBadge}`}>{bannerMeta.badgePrimary}</span><span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-700">{bannerMeta.badgeSecondary}</span></div>{title && <h1 className="mt-4 text-4xl font-black text-[#53102f]">{title}</h1>}{subtitle && <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-rose-600">{subtitle}</p>}<div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-rose-100 bg-white/88 px-4 py-3 shadow-sm"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /><span className="text-[11px] font-black text-rose-700">{bannerMeta.sideText}</span></div></div><div className="relative mx-auto h-[230px] w-[280px]"><div className="absolute right-8 top-0 h-40 w-40 overflow-hidden rounded-full border-[7px] border-white shadow-2xl"><Image src={pics[0]} alt={loadedName} fill className="object-cover" sizes="160px" /></div><div className="absolute bottom-0 left-0 h-28 w-24 rotate-[-6deg] overflow-hidden rounded-2xl border-[5px] border-white shadow-xl"><Image src={pics[1]} alt="" fill className="object-cover" sizes="96px" /></div><div className="absolute bottom-1 right-0 h-28 w-24 rotate-[6deg] overflow-hidden rounded-2xl border-[5px] border-white shadow-xl"><Image src={pics[2]} alt="" fill className="object-cover" sizes="96px" /></div></div></div></div></div>;
  }

  if (variant === "photos") {
    return <div className="mb-6 overflow-hidden rounded-[32px] border border-amber-100 bg-white shadow-[0_18px_55px_rgba(91,17,52,.08)]"><div className="grid min-h-[300px] lg:grid-cols-[.95fr_1.05fr]"><div className="relative bg-[#fff8f5] p-6"><div className="relative mx-auto h-[245px] max-w-[420px]"><PhotoTile src={pics[0]} cls="absolute right-2 top-2 h-[178px] w-[145px] rotate-[6deg]" /><PhotoTile src={pics[1]} cls="absolute left-[115px] top-[38px] h-[184px] w-[170px] -rotate-[3deg]" /><PhotoTile src={pics[2]} cls="absolute bottom-0 left-2 h-[145px] w-[120px] rotate-[5deg]" /></div></div><div className="relative overflow-hidden p-7"><Image src={bannerMeta.banner} alt="" fill className="object-cover opacity-18" sizes="520px" /><div className="relative z-10"><span className={`rounded-full border px-3 py-1.5 text-[10px] font-black ${accentBadge}`}>{bannerMeta.badgePrimary}</span>{title && <h1 className="mt-4 text-4xl font-black text-[#53102f]">{title}</h1>}{subtitle && <p className="mt-2 max-w-xl text-sm font-bold leading-7 text-rose-600">{subtitle}</p>}<div className="mt-5 grid grid-cols-3 gap-2"><StatChip label="صور متنوعة" /><StatChip label="ترتيب أسهل" /><StatChip label="عرض أجمل" /></div></div></div></div></div>;
  }

  if (variant === "online") {
    return <div className="mb-6 overflow-hidden rounded-[32px] border border-emerald-100 bg-gradient-to-l from-white to-emerald-50/45 shadow-[0_18px_55px_rgba(20,108,80,.08)]"><div className="grid min-h-[270px] items-center gap-4 p-6 lg:grid-cols-[1.15fr_.85fr]"><div><span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-[10px] font-black text-emerald-700"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />{bannerMeta.badgePrimary}</span>{title && <h1 className="mt-4 text-4xl font-black text-[#53102f]">{title}</h1>}{subtitle && <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-rose-600">{subtitle}</p>}<div className="mt-4 flex gap-2"><StatChip label="نشاط لحظي" /><StatChip label="صور واضحة" /></div></div><div className="relative mx-auto h-[215px] w-[340px]"><CirclePortrait src={pics[0]} cls="absolute right-4 top-8 h-32 w-32" /><CirclePortrait src={pics[1]} cls="absolute left-[105px] top-0 h-36 w-36 z-20" /><CirclePortrait src={pics[2]} cls="absolute left-4 bottom-0 h-28 w-28" /><div className="absolute bottom-2 right-[120px] z-30 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[9px] font-black text-emerald-700 shadow">متواجدون الآن</div></div></div></div>;
  }

  return <div className="mb-6 overflow-hidden rounded-[32px] border border-rose-100 bg-white shadow-[0_18px_55px_rgba(91,17,52,.08)]"><div className="relative min-h-[285px] overflow-hidden"><Image src={bannerMeta.banner} alt="" fill className="object-cover object-center" sizes="(max-width: 1280px) 100vw, 980px" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.16)_0%,rgba(255,255,255,.32)_38%,rgba(255,255,255,.92)_70%,rgba(255,255,255,.98)_100%)]" /><div className="relative z-10 grid min-h-[285px] items-center gap-5 p-6 lg:grid-cols-[1.1fr_.9fr]"><div className="max-w-3xl rounded-[28px] border border-white/85 bg-white/72 p-5 shadow-[0_18px_40px_rgba(91,17,52,.08)] backdrop-blur-md"><div className="flex flex-wrap gap-2"><span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black ${accentBadge}`}><Sparkles className="h-3.5 w-3.5" />{bannerMeta.badgePrimary}</span><span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50/90 px-3 py-1.5 text-[10px] font-black text-amber-700">{bannerMeta.badgeSecondary}</span></div>{title && <h1 className="mt-3 text-3xl font-black text-[#53102f] md:text-4xl">{title}</h1>}{subtitle && <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-rose-600">{subtitle}</p>}</div><div className="hidden lg:block"><div className="relative mr-auto h-[215px] w-[330px]"><MiniPortrait src={pics[0]} label={variant === "subscriptions" ? "امتيازات" : variant === "knowledge" ? "معرفة" : variant === "search" ? "اكتشاف" : "رحلتك"} rotate="rotate-6" /><div className="absolute bottom-0 left-3"><MiniPortrait src={pics[1]} label="صور أوضح" rotate="-rotate-6" /></div></div></div></div></div></div>;
}

function MiniPortrait({ src, label, rotate = "" }: { src: string; label: string; rotate?: string }) { return <div className={`w-[150px] overflow-hidden rounded-[22px] border-[6px] border-white bg-white shadow-[0_20px_44px_rgba(87,18,47,.18)] ${rotate}`}><div className="relative h-[145px]"><Image src={src} alt="" fill className="object-cover" sizes="150px" /></div><div className="px-3 py-2 text-[10px] font-black text-[#53102f]">{label}</div></div>; }
function PhotoTile({ src, cls }: { src: string; cls: string }) { return <div className={`${cls} overflow-hidden rounded-[22px] border-[6px] border-white bg-white shadow-[0_18px_40px_rgba(87,18,47,.15)]`}><Image src={src} alt="" fill className="object-cover" sizes="180px" /></div>; }
function CirclePortrait({ src, cls }: { src: string; cls: string }) { return <div className={`${cls} overflow-hidden rounded-full border-[7px] border-white bg-white shadow-[0_20px_40px_rgba(25,114,84,.16)]`}><Image src={src} alt="" fill className="object-cover" sizes="144px" /></div>; }
function StatChip({ label }: { label: string }) { return <span className="inline-flex items-center justify-center rounded-full border border-rose-100 bg-white/90 px-3 py-2 text-[9px] font-black text-rose-700 shadow-sm">{label}</span>; }

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MemberShell({
  children,
  username = "عضو قلبي لوڤي",
  title,
  subtitle,
  unreadNotifications = 0,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const bannerMeta = memberBannerMeta(pathname);
  const memberBanner = bannerMeta.banner;
  const heroVariant = routeHeroVariant(pathname);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loadedName, setLoadedName] = useState(username);

  useEffect(() => {
    fetch("/api/profile", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!data?.profile) return;
        setProfile(data.profile);
        if (data.profile.username) setLoadedName(data.profile.username);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    setAccountOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  const realPhoto = useMemo(() => {
    const photos = profile?.photos || [];
    return photos.find((item: any) => item.is_primary)?.image_url || photos[0]?.image_url || "";
  }, [profile]);

  const shownPhoto = realPhoto || fallbackAvatar(profile?.gender || "female", profile?.age, {
    hijabStyle: profile?.hijab_style,
    beardStyle: profile?.beard_style,
    seed: profile?.id || loadedName,
  });
  const hasRealPhoto = Boolean(realPhoto);

  async function logout() {
    await fetch("/api/logout", { method: "POST" }).catch(() => undefined);
    try {
      localStorage.removeItem("qalby_user");
      localStorage.removeItem("qalby_token");
    } catch { }
    router.replace("/login");
    router.refresh();
  }

  return (
    <div dir="rtl" className="relative min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fff8fb_0%,#ffffff_32%,#fffaf6_100%)] text-[#30101d]">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Image src="/images/site-v2/floral/bg-03.webp" alt="" width={420} height={420} className="absolute -right-32 top-[28%] w-[360px] opacity-[0.10] mix-blend-multiply" />
        <Image src="/images/site-v2/floral/bg-08.webp" alt="" width={420} height={420} className="absolute -left-36 top-[58%] w-[390px] opacity-[0.09] mix-blend-multiply" />
        <div className="absolute right-[7%] top-[46%] h-28 w-28 rounded-full bg-emerald-100/30 blur-3xl" />
        <div className="absolute left-[12%] top-[18%] h-24 w-24 rounded-full bg-amber-100/35 blur-3xl" />
      </div>
      <header className="sticky top-0 z-50 overflow-hidden border-b border-rose-100 bg-white/95 shadow-[0_9px_32px_rgba(71,12,39,.06)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[330px] lg:block">
          <Image src={memberBanner} alt="" fill className="object-cover object-right opacity-95" sizes="330px" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,.86)_28%,rgba(255,255,255,.12)_100%)]" />
        </div>
        <div className="ql-container relative flex min-h-[82px] items-center gap-3 py-2">
          <Link href="/dashboard" className="relative z-10 flex shrink-0 items-center gap-3 lg:pr-[135px]">
            <span className="relative grid h-13 w-13 place-items-center overflow-hidden rounded-[18px] bg-gradient-to-br from-[#be1e62] via-[#ec477d] to-[#ff7894] text-white shadow-[0_12px_28px_rgba(204,36,104,.22)]">
              <Heart className="h-6 w-6" fill="currentColor" />
              <span className="absolute bottom-1 left-1 h-2 w-2 rounded-full bg-amber-300 ring-2 ring-white/60" />
            </span>
            <span className="hidden sm:block">
              <b className="block text-xl font-black leading-none text-[#8f123f]">قلبي لوڤي</b>
              <small className="mt-1.5 block text-[9px] font-black tracking-normal text-rose-400">زواج جاد للمصريين في مصر والخارج</small>
            </span>
          </Link>

          <nav className="mx-auto hidden items-center gap-1.5 2xl:flex">
            {topNav.map(({ label, href, Icon, style, soft, premium }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center gap-2 rounded-2xl px-3 py-2.5 text-[11px] font-black transition duration-200 ${premium
                      ? `bg-gradient-to-l ${style} text-white shadow-[0_10px_26px_rgba(188,137,17,.28)] ring-1 ring-amber-200/80 hover:-translate-y-0.5`
                      : active
                        ? `bg-gradient-to-l ${style} text-white shadow-lg`
                        : `${soft} hover:-translate-y-0.5 hover:shadow-sm`
                    }`}
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-xl ${premium || active ? "bg-white/16 text-white" : "bg-white/75"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mr-auto flex items-center gap-2">
            <Link
              href="/notifications"
              aria-label="الإشعارات"
              className="relative grid h-11 w-11 place-items-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -left-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[9px] font-black text-white ring-2 ring-white">
                  {unreadNotifications > 99 ? "99+" : unreadNotifications}
                </span>
              )}
            </Link>

            <div ref={dropdownRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className="flex h-12 items-center gap-2.5 rounded-2xl border border-rose-100 bg-white px-2.5 shadow-sm transition hover:border-rose-200 hover:shadow-md"
              >
                <span className="relative h-9 w-9 overflow-hidden rounded-xl bg-rose-50 ring-1 ring-rose-100">
                  <Image src={shownPhoto} alt={loadedName} fill className="object-cover" sizes="36px" />
                </span>
                <span className="max-w-28 truncate text-xs font-black text-[#4b0d2b]">{loadedName}</span>
                <ChevronDown className={`h-4 w-4 text-rose-400 transition ${accountOpen ? "rotate-180" : ""}`} />
              </button>

              {accountOpen && (
                <div className="absolute left-0 top-[calc(100%+10px)] w-[310px] overflow-hidden rounded-[26px] border border-rose-100 bg-white shadow-[0_24px_70px_rgba(62,10,35,.18)]">
                  <div className="bg-gradient-to-l from-[#5c0b31] via-[#8d164d] to-[#c92569] p-4 text-white">
                    <div className="flex items-center gap-3">
                      <span className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white/10 ring-2 ring-white/20">
                        <Image src={shownPhoto} alt={loadedName} fill className="object-cover" sizes="56px" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-rose-100">حسابك في قلبي لوڤي</div>
                        <div className="mt-1 truncate text-sm font-black">{loadedName}</div>
                        {!hasRealPhoto && <div className="mt-1 text-[9px] font-bold text-amber-200">الصورة الحالية مؤقتة</div>}
                      </div>
                    </div>
                  </div>

                  <div className="max-h-[58vh] overflow-y-auto p-2">
                    {quickMenu.map(({ label, href, Icon }) => (
                      <Link key={`${href}-${label}`} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-black text-rose-600 transition hover:bg-rose-50 hover:text-rose-700">
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-rose-50 text-rose-600"><Icon className="h-4 w-4" /></span>
                        <span>{label}</span>
                      </Link>
                    ))}
                    <button onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-black text-red-600 transition hover:bg-red-50">
                      <span className="grid h-8 w-8 place-items-center rounded-xl bg-red-50"><LogOut className="h-4 w-4" /></span>
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen((value) => !value)}
              aria-label="القائمة"
              className="grid h-11 w-11 place-items-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 2xl:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] 2xl:hidden">
          <button aria-label="إغلاق القائمة" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-[#2d0718]/45 backdrop-blur-sm" />
          <div className="absolute inset-y-0 right-0 w-[330px] max-w-[90vw] overflow-y-auto bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="font-black text-[#8f123f]">قلبي لوڤي</div>
              <button onClick={() => setMobileOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-600"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 grid gap-2">
              {topNav.map(({ label, href, Icon, style }) => (
                <Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl bg-gradient-to-l ${style} px-4 py-3 text-xs font-black text-white`}>
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              ))}
            </div>
            <div className="my-4 h-px bg-rose-100" />
            <SidebarLinks pathname={pathname} />
            <button onClick={logout} className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-red-50 px-3 py-3 text-xs font-black text-red-600"><LogOut className="h-4 w-4" />تسجيل الخروج</button>
          </div>
        </div>
      )}

      <div className="ql-container relative z-10 grid gap-6 py-6 xl:grid-cols-[286px_minmax(0,1fr)]">
        <aside className="hidden xl:block">
          <div className="sticky top-[104px] max-h-[calc(100vh-120px)] overflow-y-auto rounded-[28px] border border-rose-100 bg-white p-3 shadow-[0_18px_55px_rgba(72,14,41,.06)]">
            <div className="mb-3 overflow-hidden rounded-[24px] bg-gradient-to-b from-[#5a0a30] via-[#86144a] to-[#be2867] p-4 text-center text-white">
              <div className="relative mx-auto h-24 w-24">
                <div className="relative h-24 w-24 overflow-hidden rounded-full bg-white/10 ring-4 ring-white/20 shadow-xl">
                  <Image src={shownPhoto} alt={loadedName} fill className="object-cover" sizes="96px" />
                </div>
                {!hasRealPhoto && (
                  <Link href="/profile/edit" aria-label="إضافة صورة شخصية" title="إضافة صورة شخصية" className="absolute -bottom-1 -left-1 grid h-9 w-9 place-items-center rounded-full bg-white text-rose-600 shadow-lg ring-2 ring-rose-100">
                    <Camera className="h-4 w-4" />
                  </Link>
                )}
              </div>
              <div className="mt-3 text-[10px] font-bold text-rose-100">مرحبًا</div>
              <div className="mt-1 truncate text-sm font-black">{loadedName}</div>
              {!hasRealPhoto && <div className="mt-1 text-[9px] font-bold text-amber-200">صورة مؤقتة حتى تضيف صورتك</div>}
            </div>

            <SidebarLinks pathname={pathname} />

            <button onClick={logout} className="mt-2 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-xs font-black text-rose-500 transition hover:bg-rose-50">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-rose-100"><LogOut className="h-4 w-4" /></span>
              تسجيل الخروج
            </button>
          </div>
        </aside>

        <main className="min-w-0">
          {(title || subtitle) && (
            <MemberRouteHero variant={heroVariant} bannerMeta={bannerMeta} title={title} subtitle={subtitle} shownPhoto={shownPhoto} loadedName={loadedName} />
          )}
          {children}
        </main>
      </div>

      <footer className="mt-8 border-t border-rose-100 bg-[#36071c] text-white">
        <div className="ql-container grid gap-8 py-9 md:grid-cols-4">
          <div>
            <div className="text-xl font-black">قلبي لوڤي</div>
            <p className="mt-3 text-xs font-bold leading-6 text-rose-100/75">منصة زواج مصرية جادة، هدفها الوضوح والخصوصية والتعارف المحترم.</p>
          </div>
          <div>
            <div className="text-sm font-black">رحلة الزواج</div>
            <div className="mt-3 grid gap-2 text-xs text-rose-100/80">
              <Link href="/stories">قصص النجاح</Link>
              <Link href="/guides/getting-to-know">إرشادات التعارف</Link>
              <Link href="/guides/engagement">إرشادات الخطوبة</Link>
              <Link href="/engagement-wedding-photos">صور الخطوبة والزواج</Link>
            </div>
          </div>
          <div>
            <div className="text-sm font-black">اختياراتك</div>
            <div className="mt-3 grid gap-2 text-xs text-rose-100/80">
              <Link href="/style/suits">اختار بدلتك</Link>
              <Link href="/style/dresses">اختاري فستانك</Link>
              <Link href="/knowledge">مركز المعرفة</Link>
              <Link href="/safety-center">مركز الأمان</Link>
            </div>
          </div>
          <div>
            <div className="text-sm font-black">الإدارة والمساعدة</div>
            <div className="mt-3 grid gap-2 text-xs text-rose-100/80">
              <Link href="/contact">اتصل بنا</Link>
              <Link href="/contact">التواصل مع الإدارة</Link>
              <Link href="/help">المساعدة</Link>
              <Link href="/privacy">الخصوصية</Link>
              <Link href="/terms">الشروط</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SidebarLinks({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-1">
      {accountNav.map(({ label, href, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={`${href}-${label}`}
            href={href}
            className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[11px] font-black transition ${active ? "bg-gradient-to-l from-rose-50 to-amber-50 text-rose-700 ring-1 ring-rose-100" : "text-rose-600 hover:bg-rose-50"
              }`}
          >
            <span className={`grid h-8 w-8 place-items-center rounded-xl ${active ? "bg-white text-rose-600 shadow-sm" : "bg-rose-50 text-rose-500"}`}>
              <Icon className="h-4 w-4" />
            </span>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
