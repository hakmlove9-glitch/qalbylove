export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Crown,
  Globe2,
  Headphones,
  Heart,
  HeartHandshake,
  Leaf,
  LockKeyhole,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  UserPlus,
  UsersRound,
} from "lucide-react";
import CountryFlag from "@/components/CountryFlag";
import FounderRemaining from "@/app/components/FounderRemaining";
import { COUNTRY_CODES } from "@/lib/constants";
import { loadPublicHomeMembers, type PublicHomeMember } from "@/lib/public-home";


const IMG = {
  hero: "/images/final/hero.webp",
  story1: "/images/final/story-wedding.webp",
  story2: "/images/final/story-cafe.webp",
  story3: "/images/final/story-couple.webp",
};

export default async function HomePage() {
  if (cookies().get("qalbylove_session")?.value) redirect("/dashboard");
  const members = await loadPublicHomeMembers(8);

  return (
    <main dir="rtl" className="ql-home-stage min-h-screen overflow-x-hidden bg-[#fff8fb] text-[#361020]">
      <HomeHeader />
      <Hero />
      <TrustStrip />
      <SearchPanel />
      <MembersSection members={members} />
      <Stories />
      <CompactFooter />
    </main>
  );
}

function HomeHeader() {
  const links = [
    ["الرئيسية", "/"],
    ["اكتشف الأعضاء", "/members"],
    ["المتواجدون الآن", "/online"],
    ["قصص النجاح", "/stories"],
    ["مقالات ونصائح", "/knowledge"],
    ["الباقات", "/plans"],
  ];

  return (
    <header className="relative z-20 bg-white shadow-[0_6px_24px_rgba(81,15,45,.08)]">
      <div className="bg-[#651032] text-white">
        <div className="mx-auto flex min-h-[42px] max-w-[1536px] items-center justify-between gap-3 px-4 text-[10px] font-bold sm:px-6 lg:px-8" dir="rtl">
          <div className="flex min-w-0 items-center gap-2 truncate sm:gap-3">
            <Crown className="h-4 w-4 shrink-0 text-amber-300" />
            <span className="shrink-0">عضوية المؤسسين</span>
            <span className="text-amber-200">|</span>
            <FounderRemaining compact />
          </div>
          <div className="hidden shrink-0 items-center gap-5 text-white/85 sm:flex">
            <Link href="/help" className="inline-flex items-center gap-1.5"><Headphones className="h-3.5 w-3.5" /> مساعدة</Link>
            <span className="inline-flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5" /> العربية</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1536px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:flex-nowrap lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="قلبي لوڤي - الرئيسية">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f8d4e1] text-[#ed1d5d]"><Heart className="h-7 w-7 fill-current" /></span>
          <span><b className="block text-[22px] font-black leading-none text-[#74133c] sm:text-[25px]">قلبي لوڤي</b><small className="mt-1 block text-[9px] font-bold text-rose-600">حيث تبدأ حياة أجمل</small></span>
        </Link>

        <nav className="order-3 flex w-full gap-2 overflow-x-auto pb-1 lg:order-none lg:w-auto lg:flex-1 lg:justify-center lg:overflow-visible lg:pb-0" aria-label="التنقل الرئيسي">
          {links.map(([label, href], index) => <Link key={href} href={href} className={`shrink-0 rounded-full border px-3.5 py-2 text-[10px] font-black transition sm:text-xs ${index === 0 ? "border-[#ed1d5d] bg-[#ed1d5d] text-white shadow-[0_8px_20px_rgba(237,29,93,.2)]" : "border-rose-100 bg-white text-[#75133d] hover:border-rose-300 hover:bg-rose-50"}`}>{label}</Link>)}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link href="/search" aria-label="البحث" className="grid h-10 w-10 place-items-center rounded-full text-[#641032] hover:bg-rose-50"><Search className="h-5 w-5" /></Link>
          <Link href="/login" className="inline-flex rounded-full border border-rose-300 bg-white px-3 py-2.5 text-[10px] font-black text-rose-700 sm:hidden">دخول</Link>
          <Link href="/login" className="hidden rounded-full border border-rose-300 bg-white px-4 py-2.5 text-[11px] font-black text-rose-700 sm:inline-flex">تسجيل الدخول</Link>
          <Link href="/signup" className="inline-flex items-center gap-1.5 rounded-full bg-[#ed1d5d] px-4 py-2.5 text-[11px] font-black text-white shadow-[0_8px_20px_rgba(237,29,93,.2)]"><UserPlus className="h-4 w-4" /> إنشاء حساب</Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto grid min-h-[350px] max-w-[1536px] overflow-hidden bg-[linear-gradient(105deg,#ffdce7,#fff7fa_50%,#fff)] lg:grid-cols-[.58fr_1.2fr_.95fr]">
      <div className="relative order-2 min-h-[190px] lg:order-none lg:min-h-[350px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(242,57,112,.20),transparent_28%),radial-gradient(circle_at_70%_90%,rgba(255,183,205,.42),transparent_45%)]" />
        <div className="relative mx-auto h-[250px] w-full max-w-[440px] lg:absolute lg:inset-0 lg:h-full lg:max-w-none">
          <div className="absolute left-[7%] top-[7%] w-[47%] rotate-[-7deg] rounded-[14px] border-[5px] border-white bg-white p-1 shadow-[0_14px_35px_rgba(89,15,49,.22)]">
            <Image src={IMG.story1} alt="صورة توضيحية لزوجين في يوم زفافهما" width={600} height={360} priority sizes="(max-width: 1024px) 47vw, 230px" className="h-[102px] w-full rounded-[8px] object-cover sm:h-[125px]" />
          </div>
          <div className="absolute right-[5%] top-[19%] w-[49%] rotate-[6deg] rounded-[14px] border-[5px] border-white bg-white p-1 shadow-[0_14px_35px_rgba(89,15,49,.22)]">
            <Image src={IMG.story2} alt="صورة توضيحية لزوجين يحتفلان ببداية جديدة" width={600} height={360} sizes="(max-width: 1024px) 49vw, 240px" className="h-[104px] w-full rounded-[8px] object-cover sm:h-[128px]" />
          </div>
          <div className="absolute bottom-[5%] left-[24%] w-[53%] rotate-[-2deg] rounded-[14px] border-[5px] border-white bg-white p-1 shadow-[0_14px_35px_rgba(89,15,49,.22)]">
            <Image src={IMG.story3} alt="صورة توضيحية لزوجين" width={600} height={360} sizes="(max-width: 1024px) 53vw, 260px" className="h-[82px] w-full rounded-[8px] object-cover sm:h-[105px]" />
          </div>
          <Heart className="absolute right-[2%] top-[5%] h-8 w-8 text-rose-400" />
        </div>
      </div>

      <div dir="rtl" className="order-1 flex flex-col justify-center px-5 py-8 text-center lg:order-none lg:px-8 lg:text-right">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-[11px] font-black text-[#e91f61] lg:mx-0"><ShieldCheck className="h-4 w-4" /> منصة زواج جادة وموثوقة</span>
        <h1 className="mt-4 text-[32px] font-black leading-[1.2] text-[#421027] sm:text-[42px] lg:text-[46px]">شريك حياتك <span className="text-[#ed1d5d]">أقرب</span> مما تتخيل</h1>
        <p className="mt-3 text-[14px] font-bold leading-7 text-[#74616c] sm:text-[16px]">انضم إلى الباحثين عن الزواج الجاد في بيئة آمنة ومحترمة.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
          <HeroPill icon={<UsersRound />} text="أعضاء حقيقيون" />
          <HeroPill icon={<LockKeyhole />} text="خصوصية تامة" />
          <HeroPill icon={<Heart />} text="رحلة جادة نحو الاستقرار" />
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-3 lg:justify-start">
          <Link href="/signup" className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#ed1d5d] px-7 py-3 text-sm font-black text-white shadow-[0_12px_25px_rgba(233,31,97,.24)]"><Heart className="h-4 w-4 fill-current" /> ابدأ رحلتك الآن</Link>
          <Link href="/help" className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-[#ed1d5d] bg-white px-6 py-3 text-sm font-black text-[#ed1d5d]"><span>كيف يعمل الموقع؟</span><ArrowLeft className="h-4 w-4" /></Link>
        </div>
      </div>

      <div className="relative order-3 min-h-[250px] lg:min-h-[350px]">
        <Image src={IMG.hero} alt="صورة توضيحية لزوجين في حديقة مزهرة" fill priority sizes="(max-width: 1024px) 100vw, 35vw" className="object-cover object-[48%_42%]" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-rose-100/25" />
      </div>
    </section>
  );
}

function HeroPill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white/90 px-3 py-2 text-[10px] font-black text-[#72153d] shadow-sm [&>svg]:h-4 [&>svg]:w-4">{icon}{text}</span>;
}

function TrustStrip() {
  const items = [
    [<ShieldCheck key="privacy" />, "خصوصية وأمان", "بياناتك في أمان"],
    [<UsersRound key="members" />, "أعضاء حقيقيون", "مراجعة دقيقة للملفات"],
    [<Heart key="compatibility" />, "توافق أدق", "بناءً على الاهتمامات والقيم"],
    [<HeartHandshake key="marriage" />, "زواج جاد فقط", "للباحثين عن الاستقرار"],
    [<Star key="stories" />, "المصداقية أولًا", "لا قصة دون موافقة أصحابها"],
    [<Leaf key="content" />, "محتوى مفيد", "مقالات ونصائح عملية"],
  ];

  return (
    <section className="mx-auto max-w-[1456px] px-3 pt-2 sm:px-5">
      <div className="grid overflow-hidden rounded-[20px] border border-rose-100 bg-white/95 shadow-[0_8px_25px_rgba(92,20,52,.06)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {items.map(([icon, title, description]) => <div key={String(title)} className="flex min-h-[72px] items-center gap-3 border-b border-rose-50 px-3 py-2.5 last:border-b-0 xl:border-b-0 xl:border-l xl:last:border-l-0"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-50 text-[#ed1d5d] [&>svg]:h-5 [&>svg]:w-5">{icon}</span><span><b className="block text-[12px] font-black text-[#54142f]">{title}</b><small className="mt-0.5 block text-[9px] font-bold text-[#8a6e7b]">{description}</small></span></div>)}
      </div>
    </section>
  );
}

function SearchPanel() {
  return (
    <section className="mx-auto max-w-[1456px] px-3 pt-2 sm:px-5">
      <form action="/search" method="get" className="grid items-center gap-3 rounded-[20px] border border-rose-100 bg-white px-4 py-4 shadow-[0_8px_25px_rgba(92,20,52,.05)] xl:grid-cols-[1.15fr_1fr_1.1fr_1.25fr_1fr_auto]">
        <div dir="rtl"><h2 className="text-[19px] font-black text-[#5b1434]">ابحث عن شريك حياتك الآن</h2><p className="mt-1 text-[10px] font-bold text-[#8a6e7b]">اختر ما يناسبك لعرض الأعضاء المتوافقين.</p></div>
        <fieldset dir="rtl" className="min-w-0"><legend className="mb-1.5 text-[10px] font-black text-[#806b77]">أبحث عن</legend><div className="flex h-[42px] overflow-hidden rounded-xl border border-rose-200 bg-[#fff8fb] p-1"><label className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg bg-rose-100 text-[11px] font-black text-[#ed1d5d]"><input type="radio" name="gender" value="female" defaultChecked className="accent-[#ed1d5d]" /> امرأة</label><label className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg text-[11px] font-black text-[#806b77]"><input type="radio" name="gender" value="male" className="accent-[#ed1d5d]" /> رجل</label></div></fieldset>
        <SearchSelect label="المنطقة" name="city" options={["القاهرة", "الجيزة", "الإسكندرية", "المنصورة"]} placeholder="اختر المنطقة" />
        <div dir="rtl"><span className="mb-1.5 block text-[10px] font-black text-[#806b77]">العمر</span><div className="grid grid-cols-2 gap-2"><SearchSelect label="من" name="minAge" options={["20", "25", "30", "35", "40"]} placeholder="من" compact /><SearchSelect label="إلى" name="maxAge" options={["25", "30", "35", "40", "50"]} placeholder="إلى" compact /></div></div>
        <SearchSelect label="الالتزام الديني" name="religion" options={["غير مهم", "متوسط", "ملتزم"]} placeholder="غير مهم" />
        <button className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl bg-[#ed1d5d] px-6 text-xs font-black text-white shadow-[0_8px_20px_rgba(233,31,97,.18)]"><Search className="h-4 w-4" /> عرض النتائج</button>
      </form>
    </section>
  );
}

function SearchSelect({ label, name, options, placeholder, compact = false }: { label: string; name: string; options: string[]; placeholder: string; compact?: boolean }) {
  return <label dir="rtl" className="block min-w-0"><span className={compact ? "sr-only" : "mb-1.5 block text-[10px] font-black text-[#806b77]"}>{label}</span><select name={name} defaultValue="" className="h-[42px] w-full rounded-xl border border-rose-200 bg-[#fffafb] px-2 text-[10px] font-bold text-[#5b2440] outline-none focus:border-rose-400"><option value="">{placeholder}</option>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function MembersSection({ members }: { members: PublicHomeMember[] }) {
  return (
    <section className="mx-auto max-w-[1456px] px-3 pt-2 sm:px-5">
      <div className="mb-2 flex items-end justify-between" dir="rtl"><div><h2 className="text-[22px] font-black text-[#4b1230] sm:text-[25px]">أعضاء جدد مميزون <Heart className="inline h-5 w-5 fill-[#ed1d5d] text-[#ed1d5d]" /></h2></div><Link href="/members" className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-white px-3 py-1.5 text-[10px] font-black text-[#ed1d5d]">عرض المزيد <ArrowLeft className="h-3.5 w-3.5" /></Link></div>
      {members.length ? <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8">{members.map(member => <MemberCard key={member.id} member={member} />)}</div> : <div className="rounded-[18px] border border-dashed border-rose-200 bg-white px-4 py-8 text-center text-sm font-bold text-rose-600">سيظهر هنا الأعضاء الحقيقيون فور توفر ملفات عامة نشطة.</div>}
    </section>
  );
}

function MemberCard({ member }: { member: PublicHomeMember }) {
  const src = member.image || member.fallbackImage;
  const countryCode = member.country === "مصر" ? "eg" : COUNTRY_CODES[member.country];

  return (
    <article className="group min-w-0 overflow-hidden rounded-[14px] border border-rose-100 bg-white shadow-[0_6px_18px_rgba(91,18,50,.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(91,18,50,.12)]">
      <Link href={`/member/${member.id}`} className="block">
        <div className="relative h-[142px] overflow-hidden bg-rose-50 sm:h-[160px] xl:h-[112px]">
          <img src={src} alt={member.name} className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]" />
          <span aria-hidden="true" className="absolute bottom-2 left-2 grid h-7 w-7 place-items-center rounded-full border border-rose-100 bg-white text-[#ed1d5d] shadow-sm"><Heart className="h-4 w-4" /></span>
          {member.verified && <BadgeCheck className="absolute right-2 top-2 h-4 w-4 rounded-full bg-white text-emerald-600" aria-label="عضو موثق" />}
        </div>
        <div dir="rtl" className="px-2 py-2 text-center">
          <b className="block truncate text-[11px] font-black text-[#51132f]">{member.name}</b>
          {member.age ? <span className="mt-0.5 block text-[9px] font-bold text-[#76626d]">{member.age} سنة</span> : null}
          {member.city && <span className="mt-0.5 flex items-center justify-center gap-1 truncate text-[9px] font-bold text-[#76626d]">{countryCode && <CountryFlag code={countryCode} size={15} />}<MapPin className="h-3 w-3 shrink-0 text-rose-500" />{member.city}</span>}
          {member.online && <span className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> متواجد الآن</span>}
        </div>
      </Link>
    </article>
  );
}

function Stories() {
  return (
    <section className="mx-auto max-w-[1456px] px-3 pb-3 pt-3 sm:px-5">
      <div className="mb-2 flex items-center justify-between" dir="rtl"><h2 className="text-[22px] font-black text-[#4b1230] sm:text-[25px]">قصص نجاح حقيقية <Heart className="inline h-5 w-5 fill-[#ed1d5d] text-[#ed1d5d]" /></h2><Link href="/stories" className="inline-flex items-center gap-1 rounded-full border border-rose-300 bg-white px-3 py-1.5 text-[10px] font-black text-[#ed1d5d]">المزيد من القصص <ArrowLeft className="h-3.5 w-3.5" /></Link></div>
      <div className="rounded-[18px] border border-rose-100 bg-white px-4 py-5 text-center shadow-[0_6px_20px_rgba(91,18,50,.05)]"><p className="text-[12px] font-bold text-[#76626d]">ستظهر هنا قصص النجاح الحقيقية بعد موافقة أصحابها.</p></div>
    </section>
  );
}

function CompactFooter() {
  return (
    <footer className="mt-0 bg-[#3c061c] text-white">
      <div className="mx-auto grid max-w-[1450px] gap-4 px-5 py-3 md:grid-cols-4" dir="rtl">
        <div><h3 className="text-xl font-black">قلبي لوڤي <Heart className="inline h-4 w-4 fill-rose-400 text-rose-400" /></h3><p className="mt-1 max-w-xs text-[10px] font-bold leading-5 text-rose-100/75">منصة زواج جاد بواجهة هادئة وخصوصية واضحة وخطوات بسيطة للوصول إلى شريك مناسب.</p></div>
        <div><b className="text-xs font-black text-rose-100">روابط سريعة</b><div className="mt-2 grid gap-1 text-[10px] font-bold text-white/80"><Link href="/">الرئيسية</Link><Link href="/members">اكتشف الأعضاء</Link><Link href="/stories">قصص النجاح</Link></div></div>
        <div><b className="text-xs font-black text-rose-100">مساعدة ودعم</b><div className="mt-2 grid gap-1 text-[10px] font-bold text-white/80"><Link href="/help">مركز المساعدة</Link><Link href="/safety-center">مركز الأمان</Link><Link href="/terms">شروط الاستخدام</Link></div></div>
        <div><b className="text-xs font-black text-rose-100">تواصل معنا</b><p className="mt-2 text-[10px] font-bold leading-5 text-white/70">لو محتاج مساعدة أو عندك استفسار، تواصل مباشرة مع فريق المنصة.</p><Link href="/contact" className="mt-2 inline-flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-[10px] font-black text-[#5a1432]">اتصل بنا <ArrowLeft className="h-3 w-3" /></Link></div>
      </div>
      <div className="border-t border-white/10 py-1.5 text-center text-[9px] font-bold text-white/55">جميع الحقوق محفوظة © 2026 قلبي لوڤي</div>
    </footer>
  );
}
