"use client";

import Link from "next/link";
import Image from "next/image";
import { Children, useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Crown,
  Eye,
  Heart,
  HeartHandshake,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Sparkles,
  UsersRound,
} from "lucide-react";
import CountryFlag from "@/components/CountryFlag";
import { COUNTRY_CODES } from "@/lib/constants";
import { fallbackAvatar } from "@/lib/avatar-fallback";
import MemberShell from "@/components/member/MemberShell";

type DashboardStats = {
  messages?: number;
  notifications?: number;
  interests?: number;
  views?: number;
  matches?: number;
  online?: number;
};

type SuggestedMember = {
  id: string;
  username?: string | null;
  display_name?: string | null;
  age?: number | null;
  city?: string | null;
  governorate?: string | null;
  country?: string | null;
  gender?: string | null;
  hijab_style?: string | null;
  beard_style?: string | null;
  image?: string | null;
  has_photos?: boolean;
  photos_locked?: boolean;
  is_online?: boolean;
  is_founder?: boolean;
  verified?: boolean;
};

type ActivityVisit = {
  id: string;
  created_at?: string | null;
  viewer?: { username?: string | null } | null;
};

type ActivityNotification = {
  id: string;
  content?: string | null;
  created_at?: string | null;
  is_read?: boolean;
};

async function readJson(url: string) {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function formatActivityDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return date.toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({});
  const [suggestions, setSuggestions] = useState<SuggestedMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [completionData, setCompletionData] = useState<any>(null);
  const [visits, setVisits] = useState<ActivityVisit[]>([]);
  const [visitsAvailable, setVisitsAvailable] = useState(false);
  const [notifications, setNotifications] = useState<ActivityNotification[]>([]);
  const [notificationsAvailable, setNotificationsAvailable] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState<number | null>(null);
  const [suggestionsAvailable, setSuggestionsAvailable] = useState(false);
  const [compatibilityScores, setCompatibilityScores] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const [profileData, dashboardData, completionResponse, searchData, viewsData, notificationsData, favoritesData] = await Promise.all([
        readJson("/api/profile"),
        readJson("/api/dashboard"),
        readJson("/api/profile/completion"),
        readJson("/api/search?limit=8"),
        readJson("/api/profile-view"),
        readJson("/api/notifications"),
        readJson("/api/favorites"),
      ]);

      if (!active) return;
      const members = Array.isArray(searchData?.members) ? searchData.members as SuggestedMember[] : [];
      setProfile(profileData?.profile || null);
      setStats(dashboardData?.stats || {});
      setCompletionData(completionResponse);
      setSuggestions(members);
      setSuggestionsAvailable(Array.isArray(searchData?.members));
      setVisits(Array.isArray(viewsData?.views) ? viewsData.views : []);
      setVisitsAvailable(Array.isArray(viewsData?.views));
      setNotifications(Array.isArray(notificationsData?.notifications) ? notificationsData.notifications : []);
      setNotificationsAvailable(Array.isArray(notificationsData?.notifications));
      setFavoriteCount(Array.isArray(favoritesData?.favorites) ? favoritesData.favorites.length : null);
      setLoading(false);

      const scoreEntries = await Promise.all(members.slice(0, 4).map(async (member) => {
        const result = await readJson(`/api/compatibility?member_id=${encodeURIComponent(member.id)}`);
        const score = Number(result?.compatibility?.score);
        return Number.isFinite(score) ? [member.id, score] as const : null;
      }));

      if (!active) return;
      setCompatibilityScores(Object.fromEntries(scoreEntries.filter((entry): entry is NonNullable<typeof entry> => entry !== null)));
    }

    void loadDashboard();
    return () => { active = false; };
  }, []);

  const completion = Math.max(0, Math.min(100, Number(completionData?.percentage || 0)));
  const completionAvailable = typeof completionData?.percentage === "number";
  const memberName = profile?.display_name || profile?.username || "عضو قلبي لوڤي";

  if (loading) {
    return <MemberShell><div className="rounded-[24px] border border-rose-100 bg-white p-8 text-center font-black text-rose-700">بنجهز لك لوحة حياتك...</div></MemberShell>;
  }

  if (!profile) {
    return (
      <MemberShell>
        <div className="rounded-[24px] border border-rose-100 bg-white p-8 text-center sm:p-10">
          <div className="font-black">سجّل دخولك لفتح مساحتك الخاصة.</div>
          <Link href="/login" className="ql-btn-primary mt-4 inline-flex">تسجيل الدخول</Link>
        </div>
      </MemberShell>
    );
  }

  return (
    <MemberShell username={memberName} unreadNotifications={Number(stats.notifications || 0)}>
      <div className="space-y-5 pb-4">
        <section className="relative isolate overflow-hidden rounded-[26px] bg-gradient-to-l from-[#520d2d] via-[#8b174a] to-[#c32768] p-5 text-white shadow-[0_16px_40px_rgba(81,14,47,.15)] sm:p-7">
          <Image src="/images/site-v2/pages/dashboard/01.webp" alt="" fill priority className="-z-10 object-cover opacity-25" sizes="(max-width: 1280px) 100vw, 1100px" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-l from-[#520d2d]/95 via-[#8b174a]/85 to-[#c32768]/65" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black"><Sparkles className="h-4 w-4 text-amber-200" /> لوحتك اليوم</span>
              <h1 className="mt-3 text-[24px] font-black leading-tight sm:text-[32px]">أهلاً يا {memberName} <span aria-hidden="true">❤️</span></h1>
              <p className="mt-2 max-w-xl text-xs font-bold leading-6 text-rose-100 sm:text-sm">كل خطوة بتقربك من تعارف جاد. شوف جديدك وكمل ملفك براحتك.</p>
            </div>
            {profile.is_founder && <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/50 bg-amber-300 px-3 py-2 text-[10px] font-black text-amber-950"><Crown className="h-4 w-4" /> عضو مؤسس</span>}
            <Link href="/search" className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black text-[#75133d] shadow"><UsersRound className="h-4 w-4" /> اكتشف الأعضاء</Link>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6" aria-label="ملخص النشاط">
          <Metric href="/messages" label="رسائلي" value={stats.messages} icon={<MessageCircle />} accent="rose" />
          <Metric href="/notifications" label="تنبيهات" value={stats.notifications} icon={<Bell />} accent="gold" />
          <Metric href="/who-likes-me" label="اهتمامات وصلتك" value={stats.interests} icon={<Heart />} accent="rose" />
          <Metric href="/profile-views" label="زيارات ملفي" value={stats.views} icon={<Eye />} accent="gold" />
          <Metric href="/favorites" label="المفضلة" value={favoriteCount ?? undefined} icon={<HeartHandshake />} accent="rose" />
          <Metric href="/matches" label="التطابقات" value={stats.matches} icon={<Sparkles />} accent="gold" />
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)]">
          <div className="rounded-[24px] border border-rose-100 bg-white p-4 shadow-[0_10px_28px_rgba(80,18,45,.05)] sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div><span className="text-[10px] font-black text-rose-500">ملفك الشخصي</span><h2 className="mt-1 text-lg font-black text-[#48112e]">اكتمال الملف</h2></div>
              {completionAvailable && <div className="text-2xl font-black text-[#9c194f]">{completion}%</div>}
            </div>
            {completionAvailable ? <>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-rose-100" role="progressbar" aria-label="اكتمال الملف" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion}>
                <div className="h-full rounded-full bg-gradient-to-l from-[#e62a69] to-[#b51655] transition-[width] duration-500" style={{ width: `${completion}%` }} />
              </div>
              {completion === 100 ? <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800">مبروك، أصبح ملفك جاهزًا للظهور للأعضاء.</p> : <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <CompletionList title="تم استكماله" items={completionData?.completed || []} completed />
                <CompletionList title="ينقص ملفك" items={completionData?.missing || []} />
              </div>}
              {completion < 100 && <Link href="/profile/edit" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#ed1d5d] px-4 py-2 text-xs font-black text-white"><LockKeyhole className="h-4 w-4" /> استكمل بياناتك <ArrowLeft className="h-4 w-4" /></Link>}
            </> : <p className="mt-3 rounded-xl bg-rose-50/60 px-3 py-4 text-center text-[10px] font-bold text-rose-600">اكتمال الملف غير متاح حالياً.</p>}
          </div>

          <DashboardAssistant gender={profile.gender} completion={completion} />
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <ActivityPanel title="زيارات ملفي" href="/profile-views" icon={<Eye />} available={visitsAvailable} empty="لسه مفيش زيارات جديدة لملفك.">
            {visits.slice(0, 4).map((visit) => <ActivityRow key={visit.id} title={visit.viewer?.username || "عضو زار ملفك"} detail="زار ملفك الشخصي" date={formatActivityDate(visit.created_at)} />)}
          </ActivityPanel>
          <ActivityPanel title="التنبيهات" href="/notifications" icon={<Bell />} available={notificationsAvailable} empty="مفيش تنبيهات جديدة دلوقتي.">
            {notifications.slice(0, 4).map((notification) => <ActivityRow key={notification.id} title={notification.content || "تحديث جديد"} detail={notification.is_read ? "تمت قراءته" : "جديد"} date={formatActivityDate(notification.created_at)} unread={!notification.is_read} />)}
          </ActivityPanel>
        </section>

        <section>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div><span className="text-[10px] font-black text-rose-500">اقتراحات حقيقية</span><h2 className="mt-1 text-xl font-black text-[#48112e]">أعضاء ممكن يناسبوك</h2></div>
            <Link href="/search" className="inline-flex items-center gap-1 text-xs font-black text-rose-700">كل الأعضاء <ArrowLeft className="h-4 w-4" /></Link>
          </div>
          {suggestions.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{suggestions.slice(0, 4).map((member) => <SuggestionCard key={member.id} member={member} compatibility={compatibilityScores[member.id]} />)}</div> : <div className="rounded-[20px] border border-dashed border-rose-200 bg-white px-4 py-7 text-center text-xs font-bold text-rose-600">{suggestionsAvailable ? "مفيش اقتراحات متاحة حالياً." : "تعذر تحميل اقتراحات الأعضاء حالياً."}</div>}
        </section>
      </div>
    </MemberShell>
  );
}

function Metric({ href, label, value, icon, accent }: { href: string; label: string; value?: number; icon: React.ReactNode; accent: "rose" | "gold" }) {
  const tone = accent === "gold" ? "border-amber-100 bg-amber-50 text-amber-700" : "border-rose-100 bg-rose-50 text-rose-700";
  return <Link href={href} className="flex min-h-[82px] items-center justify-between gap-2 rounded-[18px] border border-rose-100 bg-white px-3 py-3 shadow-[0_7px_20px_rgba(80,18,45,.04)] transition hover:-translate-y-0.5 hover:shadow-md">
    <span><b className="block text-2xl font-black text-[#48112e]">{typeof value === "number" ? value : "—"}</b><span className="mt-1 block text-[10px] font-bold text-rose-600">{label}</span></span>
    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border [&>svg]:h-5 [&>svg]:w-5 ${tone}`}>{icon}</span>
  </Link>;
}

function CompletionList({ title, items, completed = false }: { title: string; items: string[]; completed?: boolean }) {
  const visibleItems = items.slice(0, 4);
  return <div>
    <h3 className="mb-2 text-[10px] font-black text-[#6d2444]">{title}</h3>
    {visibleItems.length ? <ul className="space-y-1.5">{visibleItems.map((item) => <li key={item} className="flex items-center gap-2 text-[10px] font-bold text-[#735e69]">{completed ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> : <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />}{item}</li>)}</ul> : <p className="text-[10px] font-bold text-[#8a7882]">{completed ? "لم تكتمل بيانات بعد." : "كل البيانات الأساسية مكتملة."}</p>}
    {items.length > visibleItems.length && <span className="mt-1 block text-[9px] font-bold text-rose-500">و{items.length - visibleItems.length} عناصر أخرى</span>}
  </div>;
}

function ActivityPanel({ title, href, icon, available, empty, children }: { title: string; href: string; icon: React.ReactNode; available: boolean; empty: string; children: React.ReactNode }) {
  const hasItems = Children.count(children) > 0;
  return <section className="rounded-[22px] border border-rose-100 bg-white p-4 shadow-[0_8px_24px_rgba(80,18,45,.045)] sm:p-5">
    <div className="mb-3 flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 text-sm font-black text-[#48112e]"><span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 text-rose-600 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>{title}</h2><Link href={href} className="text-[10px] font-black text-rose-700">عرض الكل</Link></div>
    {available ? hasItems ? <div className="divide-y divide-rose-50">{children}</div> : <p className="rounded-xl bg-rose-50/60 px-3 py-4 text-center text-[10px] font-bold text-rose-600">{empty}</p> : <p className="rounded-xl bg-rose-50/60 px-3 py-4 text-center text-[10px] font-bold text-rose-600">المعلومات غير متاحة حالياً.</p>}
  </section>;
}

function ActivityRow({ title, detail, date, unread = false }: { title: string; detail: string; date: string; unread?: boolean }) {
  return <div className="flex min-w-0 items-center gap-2.5 py-2.5 first:pt-0 last:pb-0">
    <span className={`h-2 w-2 shrink-0 rounded-full ${unread ? "bg-rose-500" : "bg-rose-200"}`} />
    <span className="min-w-0 flex-1"><b className="block truncate text-[10px] font-black text-[#511530]">{title}</b><small className="mt-0.5 block text-[9px] font-bold text-rose-500">{detail}</small></span>
    {date && <time className="shrink-0 text-[9px] font-bold text-[#8a7882]">{date}</time>}
  </div>;
}

function SuggestionCard({ member, compatibility }: { member: SuggestedMember; compatibility?: number }) {
  const [imageFailed, setImageFailed] = useState(false);
  const fallback = fallbackAvatar(member.gender, member.age, { hijabStyle: member.hijab_style, beardStyle: member.beard_style, seed: member.id });
  const image = member.image && member.has_photos && !member.photos_locked && !imageFailed ? member.image : fallback;
  const name = member.display_name || member.username || "عضو";
  const place = member.city || member.governorate || member.country || "";
  const countryCode = member.country === "مصر" ? "eg" : COUNTRY_CODES[String(member.country || "")];

  return <article className="min-w-0 overflow-hidden rounded-[18px] border border-rose-100 bg-white shadow-[0_8px_24px_rgba(80,18,45,.055)]">
    <Link href={`/member/${member.id}`} className="block">
      <div className="relative h-[130px] overflow-hidden bg-rose-50 sm:h-[155px]">
        <img src={image} alt={name} className="h-full w-full object-cover object-top" onError={() => setImageFailed(true)} />
        {member.is_online && <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-white/95 px-2 py-1 text-[8px] font-black text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> متصل الآن</span>}
        {member.is_founder && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-300 px-2 py-1 text-[8px] font-black text-amber-950"><Crown className="h-3 w-3" /> مؤسس</span>}
      </div>
      <div className="p-2.5" dir="rtl">
        <b className="block truncate text-[11px] font-black text-[#511530]">{name}</b>
        <span className="mt-1 flex min-h-4 items-center gap-1 truncate text-[9px] font-bold text-[#796470]">{member.age ? <span>{member.age} سنة</span> : null}{member.age && place ? <span>·</span> : null}{countryCode && <CountryFlag code={countryCode} size={13} />}<MapPin className="h-3 w-3 shrink-0 text-rose-500" />{place}</span>
        {typeof compatibility === "number" && <span className="mt-1 inline-flex rounded-full bg-rose-50 px-2 py-1 text-[8px] font-black text-rose-700">توافق محسوب {compatibility}%</span>}
      </div>
    </Link>
  </article>;
}

function DashboardAssistant({ gender, completion }: { gender?: string | null; completion: number }) {
  const femaleMember = gender === "female" || gender === "أنثى";
  const maleMember = gender === "male" || gender === "ذكر";
  const assistantName = maleMember ? "حواء" : femaleMember ? "آدم" : "مساعدك الشخصي";
  const image = maleMember ? "/images/site-v2/assistants/female/01.webp" : femaleMember ? "/images/site-v2/assistants/male/01.webp" : "/images/site-v2/couples/couple-02.webp";
  const message = completion < 100 ? "يلا نكمل ملفك خطوة بخطوة، كل معلومة بتساعد على ترشيحات أوضح." : "برافو عليك، ملفك جاهز. راجع اقتراحات الأعضاء وخد وقتك في الاختيار.";

  return <aside className="relative min-h-[200px] overflow-hidden rounded-[22px] border border-rose-100 bg-gradient-to-br from-white to-[#fff0f6] p-4 shadow-[0_8px_24px_rgba(80,18,45,.05)]">
    <div className="relative z-10 max-w-[70%]" dir="rtl"><span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[9px] font-black text-rose-700"><Sparkles className="h-3 w-3" /> مساعدك الشخصي</span><h2 className="mt-3 text-lg font-black text-[#541433]">{maleMember || femaleMember ? `${assistantName} معك` : assistantName}</h2><p className="mt-2 text-[10px] font-bold leading-5 text-rose-600">{message}</p><Link href={completion < 100 ? "/profile/edit" : "/search"} className="mt-3 inline-flex items-center gap-1 text-[10px] font-black text-rose-700">{completion < 100 ? "كمّل ملفك" : "شوف اقتراحاتك"}<ArrowLeft className="h-3 w-3" /></Link></div>
    <Image src={image} alt={assistantName} width={130} height={170} className="absolute bottom-0 left-1 h-[88%] w-auto object-contain object-bottom" />
  </aside>;
}
