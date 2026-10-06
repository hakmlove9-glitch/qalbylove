"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, BookOpen, Crown, Eye, Heart, HeartHandshake, Images, KeyRound, LogOut, MessageCircle, Settings, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import MemberShell from "@/components/member/MemberShell";

type MemberRequest = {
  id: string;
  sender_id: string;
  status: string;
  created_at: string;
  sender?: { display_name?: string | null; username?: string | null; age?: number | null; city?: string | null; governorate?: string | null };
};

export default function MyAccountPage() {
  const [profile, setProfile] = useState<any>(null);
  const [membership, setMembership] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/my-subscription", { cache: "no-store" }).then((r) => r.json()),
    ]).then(([p, m]) => { setProfile(p.profile || null); setMembership(m); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <MemberShell title="حسابي"><div className="ql-page-card p-12 text-center font-black text-rose-400">جاري تجهيز حسابك...</div></MemberShell>;

  return (
    <MemberShell username={profile?.username} title="حسابي" subtitle="كل ما يخص بياناتك وخصوصيتك وعضويتك في مكان واحد.">
      <section className="grid gap-5 lg:grid-cols-[1fr_330px]">
        <div className="ql-page-card p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-[22px] bg-gradient-to-br from-rose-100 to-amber-50 text-rose-700"><UserRound className="h-7 w-7" /></span>
            <div className="flex-1"><div className="text-xs font-black text-rose-500">الحساب الحالي</div><h2 className="mt-1 text-2xl font-black text-[#3c0b20]">{profile?.username || "عضو قلبي لوڤي"}</h2><div className="mt-2 flex flex-wrap gap-2">{membership?.founder && <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-black text-amber-800">👑 عضو مؤسس</span>}{profile?.verification_status === "verified" && <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-800">✓ موثّق</span>}</div></div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Shortcut href="/profile" icon={<UserRound />} title="ملفي الشخصي" text="شاهد ملفك كما يراه الأعضاء" />
            <Shortcut href="/profile/edit" icon={<Settings />} title="تعديل بياناتي" text="البيانات ومواصفات شريك الحياة" />
            <Shortcut href="/photos" icon={<Images />} title="صوري" text="إدارة الصور والخصوصية" />
            <Shortcut href="/notifications" icon={<Bell />} title="الإشعارات" text="التحديثات والتنبيهات الجديدة" />
            <Shortcut href="/messages" icon={<MessageCircle />} title="رسائلي" text="محادثاتك النصية والصوتية" />
            <Shortcut href="/favorites" icon={<Heart />} title="قائمة اهتمامي" text="الملفات التي أضفتها للمفضلة" />
            <Shortcut href="/who-likes-me" icon={<UsersRound />} title="من يهتم بي" text="الاهتمامات التي وصلتك" />
            <Shortcut href="/mutual-interests" icon={<HeartHandshake />} title="الاهتمام المتبادل" text="التوافق وفتح التواصل" />
            <Shortcut href="/blocks" icon={<ShieldCheck />} title="التجاهل والحظر" text="إدارة الأعضاء المحظورين" />
            <Shortcut href="/profile-views" icon={<Eye />} title="من زار ملفي" text="الزيارات المسجلة لملفك" />
            <Shortcut href="/my-subscription" icon={<Crown />} title="اشتراكي" text="حالة العضوية والامتيازات" />
            <Shortcut href="/subscriptions#activation" icon={<KeyRound />} title="تفعيل كود" text="لديك كود تفعيل؟ أدخله هنا" />
            <Shortcut href="/settings" icon={<Settings />} title="الإعدادات" text="الظهور والرسائل وآخر ظهور" />
            <Shortcut href="/knowledge" icon={<BookOpen />} title="مركز المعرفة" text="إرشادات لكل خطوة في رحلتك" />
            <Shortcut href="/logout" icon={<LogOut />} title="تسجيل الخروج" text="إنهاء الجلسة على هذا الجهاز" />
          </div>
        </div>

        <aside className={`rounded-[30px] p-6 shadow-[0_20px_55px_rgba(80,32,17,.12)] ${membership?.founder ? "border border-amber-200 bg-gradient-to-b from-[#5e3a0b] to-[#a56a13] text-white" : "border border-rose-100 bg-gradient-to-b from-[#4d0b28] to-[#8f1648] text-white"}`}>
          <Crown className="h-8 w-8 text-amber-200" />
          <div className="mt-4 text-xs font-black opacity-80">حالة العضوية</div>
          <h2 className="mt-1 text-2xl font-black">{membership?.presentation?.title || (membership?.founder ? "عضو مؤسس" : "عضو أساسي")}</h2>
          {membership?.founder && <p className="mt-2 text-xs font-bold leading-6 text-amber-50">عضوية المؤسس مستقلة عن الاشتراكات المدفوعة وتظل مرتبطة بحسابك.</p>}
          <div className="mt-5 flex flex-wrap gap-2"><Link href="/my-subscription" className="inline-flex rounded-xl bg-white px-4 py-2.5 text-xs font-black text-[#5a1732]">تفاصيل العضوية</Link><Link href="/privileges" className="inline-flex rounded-xl border border-white/35 px-4 py-2.5 text-xs font-black text-white">عرض الامتيازات</Link></div>
        </aside>
      </section>
      {profile?.id && <MemberRequestsInbox memberId={profile.id} />}
    </MemberShell>
  );
}

function MemberRequestsInbox({ memberId }: { memberId: string }) {
  const [requests, setRequests] = useState<MemberRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/member-requests", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (active) setRequests(Array.isArray(data?.requests) ? data.requests : []); })
      .catch(() => { if (active) setMessage("تعذر تحميل طلبات الزواج حالياً."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [memberId]);

  async function updateRequest(requestId: string, status: "accepted" | "rejected") {
    setBusyId(requestId);
    setMessage("");
    try {
      const response = await fetch("/api/member-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: requestId, status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "تعذر تحديث الطلب");
      setRequests((current) => current.map((item) => item.id === requestId ? { ...item, status } : item));
      setMessage(status === "accepted" ? "تم القبول وفتح التواصل بينكما." : "تم رفض الطلب.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر تحديث الطلب");
    } finally {
      setBusyId("");
    }
  }

  return <section className="mt-5 rounded-[24px] border border-rose-100 bg-white p-4 shadow-[0_10px_28px_rgba(80,18,45,.05)] sm:p-5">
    <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><span className="text-[10px] font-black text-rose-500">تعارف جاد</span><h2 className="mt-1 text-lg font-black text-[#48112e]">طلبات الزواج الجاد</h2></div><span className="rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-black text-rose-700">{requests.filter((item) => item.status === "pending").length} بانتظارك</span></div>
    {loading ? <p className="py-5 text-center text-xs font-bold text-rose-500">جاري تحميل الطلبات...</p> : requests.length === 0 ? <p className="rounded-xl bg-rose-50/60 px-3 py-5 text-center text-[10px] font-bold text-rose-600">لا توجد طلبات حالياً.</p> : <div className="space-y-2">{requests.slice(0, 5).map((item) => {
      const name = item.sender?.display_name || item.sender?.username || "عضو";
      const place = item.sender?.city || item.sender?.governorate || "";
      return <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-50 bg-[#fffafb] p-3"><div className="min-w-0"><b className="block truncate text-xs font-black text-[#511530]">{name}</b><span className="mt-1 block truncate text-[9px] font-bold text-rose-500">{[item.sender?.age ? `${item.sender.age} سنة` : "", place].filter(Boolean).join(" · ") || "طلب زواج جاد"}</span></div>{item.status === "pending" ? <div className="flex gap-2"><button type="button" disabled={Boolean(busyId)} onClick={() => void updateRequest(item.id, "accepted")} className="rounded-lg bg-emerald-600 px-3 py-2 text-[9px] font-black text-white disabled:opacity-50">{busyId === item.id ? "جاري..." : "قبول وفتح التواصل"}</button><button type="button" disabled={Boolean(busyId)} onClick={() => void updateRequest(item.id, "rejected")} className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-[9px] font-black text-rose-700 disabled:opacity-50">رفض</button></div> : <span className="rounded-full bg-rose-50 px-3 py-1.5 text-[9px] font-black text-rose-700">{item.status === "accepted" ? "تم القبول" : "تم الرفض"}</span>}</div>;
    })}</div>}
    {message && <p className="mt-3 text-[10px] font-bold text-rose-600" role="status">{message}</p>}
    <Link href="/who-likes-me" className="mt-3 inline-flex items-center text-[10px] font-black text-rose-700">عرض الاهتمامات الأخرى</Link>
  </section>;
}

function Shortcut({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return <Link href={href} className="flex items-center gap-3 rounded-[22px] border border-rose-100 bg-[#fffafb] p-4 transition hover:-translate-y-0.5 hover:border-rose-200"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-rose-600 shadow-sm [&>svg]:h-5 [&>svg]:w-5">{icon}</span><div><div className="text-sm font-black text-[#3c0b20]">{title}</div><div className="mt-1 text-[10px] font-bold leading-5 text-rose-500">{text}</div></div></Link>;
}
