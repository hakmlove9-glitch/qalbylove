"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Crown, Mail, Search, ShieldCheck, UserX, X } from "lucide-react";

type Member = {
  id: string; username: string; email: string; member_number: number; account_status: string;
  role?: string; is_admin?: boolean; is_founder?: boolean; verification_status?: string; membership_tier?: string; created_at?: string;
  phone?: string | null; gender?: string | null; city?: string | null; governorate?: string | null; country?: string | null;
};

type MemberDetail = {
  member: Member;
  details: Record<string, any> | null;
  photos: Array<{ id: string; image_url?: string | null; moderation_status?: string; created_at?: string }>;
  completion: { percentage: number; complete: number; total: number };
  subscriptions: Array<{ id: string; plan_name?: string; status: string; starts_at?: string; ends_at?: string }>;
  codes: Array<{ id: string; code: string; is_used: boolean; used_at?: string; created_at?: string; expires_at?: string }>;
  reports: Array<{ id: string; reason: string; status: string; created_at?: string }>;
  blocks: Array<{ blocker_id: string; blocked_id: string; created_at?: string }>;
  lastActivity?: string | null;
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");
  const [selected, setSelected] = useState<MemberDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [messageTarget, setMessageTarget] = useState<Member | null>(null);

  async function loadMembers() {
    setLoading(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("location", location.trim());
    if (gender) params.set("gender", gender);
    if (statusFilter) params.set("status", statusFilter);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    const res = await fetch(`/api/admin/members?${params.toString()}`, { cache: "no-store" });
    const data = await res.json();
    setMembers(data.members || []);
    setLoading(false);
  }
  useEffect(() => { void loadMembers(); }, []);

  async function openMember(memberId: string) {
    setDetailLoading(true);
    setSelected(null);
    try {
      const response = await fetch(`/api/admin/members?id=${encodeURIComponent(memberId)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تحميل تفاصيل العضو");
      setSelected(data);
    } finally {
      setDetailLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    if (status !== "active" && !window.confirm("تأكيد تغيير حالة الحساب؟ سيؤثر ذلك على وصول العضو للمنصة.")) return;
    setWorking(id);
    const response = await fetch("/api/admin/members", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    const data = await response.json();
    if (!response.ok) alert(data.error || "تعذر تحديث الحساب");
    await loadMembers();
    if (selected?.member.id === id) void openMember(id);
    setWorking("");
  }

  async function updateMembership(id: string, membership_tier: string) {
    const response = await fetch("/api/admin/members", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, membership_tier }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { window.alert(data.error || "تعذر تحديث العضوية"); return; }
    await loadMembers();
    await openMember(id);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#fff9fb] p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[30px] border border-rose-100 bg-white p-6 shadow-[0_18px_55px_rgba(75,14,42,.07)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700"><ShieldCheck className="h-4 w-4" />إدارة حقيقية للحسابات</span><h1 className="mt-4 text-3xl font-black text-[#4b0d2b]">الأعضاء</h1><p className="mt-2 text-sm font-bold text-rose-500">بحث مباشر في سجلات الأعضاء وبيانات ملفاتهم.</p></div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50/40 px-3"><Search className="h-4 w-4 shrink-0 text-rose-500" /><input dir="auto" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && void loadMembers()} className="h-11 w-full bg-transparent text-xs font-bold outline-none" placeholder="اسم، رقم عضوية، بريد أو هاتف" /></label>
            <input dir="auto" value={location} onChange={(e) => setLocation(e.target.value)} onKeyDown={(e) => e.key === "Enter" && void loadMembers()} className="h-11 rounded-xl border border-rose-100 bg-rose-50/40 px-3 text-xs font-bold outline-none" placeholder="المحافظة أو المدينة" />
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="h-11 rounded-xl border border-rose-100 bg-white px-3 text-xs font-bold"><option value="">كل الأنواع</option><option value="male">رجل</option><option value="female">امرأة</option></select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-11 rounded-xl border border-rose-100 bg-white px-3 text-xs font-bold"><option value="">كل الحالات</option><option value="active">نشط</option><option value="blocked">محظور</option><option value="suspended">معلّق</option><option value="deactivated">معطّل</option></select>
            <label className="flex items-center gap-2 rounded-xl border border-rose-100 px-3 text-[10px] font-bold text-rose-600">من<input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-11 min-w-0 flex-1 bg-transparent" /></label>
            <label className="flex items-center gap-2 rounded-xl border border-rose-100 px-3 text-[10px] font-bold text-rose-600">إلى<input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-11 min-w-0 flex-1 bg-transparent" /></label>
          </div>
          <button type="button" onClick={() => void loadMembers()} className="mt-3 rounded-xl bg-gradient-to-l from-rose-700 to-rose-500 px-5 py-2.5 text-xs font-black text-white">بحث الأعضاء</button>
        </section>

        {loading ? <div className="mt-6 rounded-[28px] bg-white p-10 text-center font-black text-rose-400">جاري تحميل الأعضاء...</div> : (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {members.map(member => (
              <article key={member.id} className="rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_12px_35px_rgba(70,15,40,.05)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><div className="flex items-center gap-2"><h2 className="text-lg font-black text-rose-900">{member.username}</h2>{member.is_founder && <Crown className="h-4 w-4 text-amber-500" />}{member.verification_status === 'verified' && <ShieldCheck className="h-4 w-4 text-emerald-600" />}</div><p className="mt-1 text-xs font-bold text-rose-400">#{member.member_number} · {member.email}</p></div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black ${member.account_status === 'active' ? 'bg-emerald-50 text-emerald-700' : member.account_status === 'blocked' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{member.account_status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black"><span className="rounded-full bg-rose-100 px-3 py-1.5">{member.membership_tier || 'basic'}</span>{member.role && <span className="rounded-full bg-violet-50 px-3 py-1.5 text-violet-700">{member.role}</span>}</div>
                <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => void openMember(member.id)} className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-black text-rose-700">تفاصيل العضو</button><select disabled={working === member.id || member.is_admin} value={member.account_status} onChange={(event) => void updateStatus(member.id, event.target.value)} className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-black"><option value="active">نشط</option><option value="blocked">محظور</option><option value="suspended">معلّق</option><option value="deactivated">معطّل</option></select></div>
              </article>
            ))}
          </div>
        )}
      </div>
      {(selected || detailLoading) && <MemberDetailPanel detail={selected} loading={detailLoading} onClose={() => setSelected(null)} onMessage={setMessageTarget} onMembershipChange={updateMembership} />}
      {messageTarget && <AdminMemberMessage member={messageTarget} onClose={() => setMessageTarget(null)} />}
    </main>
  );
}

function MemberDetailPanel({ detail, loading, onClose, onMessage, onMembershipChange }: { detail: MemberDetail | null; loading: boolean; onClose: () => void; onMessage: (member: Member) => void; onMembershipChange: (id: string, tier: string) => void }) {
  return <div className="fixed inset-0 z-[120] grid place-items-center bg-[#260816]/55 p-3 backdrop-blur-sm" dir="rtl" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[24px] border border-rose-100 bg-[#fff9fb] shadow-2xl">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-rose-100 bg-white/95 px-4 py-3 backdrop-blur"><div><span className="text-[10px] font-black text-rose-500">ملف إداري</span><h2 className="text-lg font-black text-rose-950">{detail?.member.username || "تفاصيل العضو"}</h2></div><button type="button" onClick={onClose} aria-label="إغلاق" className="grid h-9 w-9 place-items-center rounded-xl bg-rose-50 text-rose-700"><X className="h-4 w-4" /></button></header>
      {loading || !detail ? <div className="p-12 text-center text-sm font-black text-rose-600">جاري تحميل البيانات...</div> : <div className="space-y-4 p-4">
        <section className="grid gap-3 rounded-2xl border border-rose-100 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="رقم العضوية" value={detail.member.member_number} /><Info label="البريد" value={detail.member.email} /><Info label="الهاتف" value={detail.details?.phone} /><Info label="الجنس" value={detail.details?.gender || detail.member.gender} />
          <Info label="العمر" value={detail.details?.age} /><Info label="الموقع" value={[detail.details?.country, detail.details?.governorate, detail.details?.city].filter(Boolean).join(" · ")} /><Info label="تاريخ التسجيل" value={date(detail.member.created_at)} /><Info label="آخر نشاط" value={date(detail.lastActivity)} />
          <Info label="اكتمال الملف" value={`${detail.completion.percentage}% (${detail.completion.complete}/${detail.completion.total})`} /><Info label="حالة الحساب" value={detail.member.account_status} /><Info label="العضوية" value={detail.member.membership_tier || (detail.member.is_founder ? "founder" : "basic")} /><Info label="التوثيق" value={detail.member.verification_status || "غير موثق"} />
        </section>
        <section className="flex flex-wrap items-center gap-2 rounded-2xl border border-rose-100 bg-white p-4">
          <button onClick={() => onMessage(detail.member)} className="inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2.5 text-xs font-black text-white"><Mail className="h-4 w-4" /> رسالة إدارية</button>
          <Link href={`/member/${detail.member.id}`} className="rounded-xl border border-rose-200 px-4 py-2.5 text-xs font-black text-rose-700">معاينة الملف</Link>
          <a href="#admin-subscriptions" className="rounded-xl border border-rose-200 px-4 py-2.5 text-xs font-black text-rose-700">الاشتراكات والأكواد</a>
          {detail.member.is_founder ? <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-[10px] font-black text-amber-800">عضوية مؤسس دائمة: لا تتغير من إدارة الاشتراك</span> : <label className="flex items-center gap-2 text-[10px] font-black text-rose-700">حالة العضوية<select value={detail.member.membership_tier || "basic"} onChange={(event) => onMembershipChange(detail.member.id, event.target.value)} className="h-10 rounded-xl border border-rose-200 bg-white px-3 text-xs"><option value="basic">أساسية</option><option value="silver">فضية</option><option value="gold">ذهبية</option><option value="diamond">ألماسية</option><option value="royal">ملكية</option></select></label>}
        </section>
        <section className="grid gap-4 lg:grid-cols-2">
          <DetailList title="الصور" items={detail.photos.map((photo) => `${photo.moderation_status || "حالة غير معروفة"} · ${date(photo.created_at) || "بدون تاريخ"}`)} />
          <DetailList title="الاشتراكات" items={detail.subscriptions.map((item) => `${item.plan_name || "باقة"} · ${item.status} · ${date(item.ends_at) || "بدون نهاية"}`)} />
          <div id="admin-subscriptions"><DetailList title="أكواد التفعيل" items={detail.codes.map((item) => `${item.code} · ${item.is_used ? `مستخدم ${date(item.used_at)}` : "غير مستخدم"} · ينتهي ${date(item.expires_at) || "بدون انتهاء"}`)} /></div>
          <DetailList title="البلاغات المرتبطة" items={detail.reports.map((item) => `${item.reason} · ${item.status} · ${date(item.created_at)}`)} />
          <DetailList title="الحظر المرتبط" items={detail.blocks.map((item) => item.blocker_id === detail.member.id ? `حظر العضو ${item.blocked_id}` : `محظور بواسطة ${item.blocker_id}`)} />
          <DetailList title="بيانات الملف" items={Object.entries(detail.details || {}).filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "").slice(0, 24).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join("، ") : String(value)}`)} />
        </section>
      </div>}
    </section>
  </div>;
}

function AdminMemberMessage({ member, onClose }: { member: Member; onClose: () => void }) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  async function send() {
    if (!content.trim() || sending) return;
    setSending(true); setStatus("");
    try {
      const response = await fetch("/api/admin/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ member_id: member.id, content: content.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر إرسال الرسالة");
      setStatus("تم إرسال الرسالة الإدارية."); setContent("");
    } catch (error) { setStatus(error instanceof Error ? error.message : "تعذر إرسال الرسالة"); }
    finally { setSending(false); }
  }
  return <div className="fixed inset-0 z-[130] grid place-items-center bg-[#260816]/55 p-4" dir="rtl"><section className="w-full max-w-lg rounded-[24px] bg-white p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-black text-rose-950">رسالة إدارية إلى {member.username}</h2><button onClick={onClose} aria-label="إغلاق" className="rounded-lg bg-rose-50 p-2 text-rose-700"><X className="h-4 w-4" /></button></div><p className="mt-2 text-[10px] font-bold text-rose-500">ستظهر الرسالة في تنبيهات العضو كرسالة من إدارة قلبي لوڤي.</p><textarea dir="auto" value={content} onChange={(event) => setContent(event.target.value)} rows={5} maxLength={1000} className="mt-4 w-full rounded-xl border border-rose-200 p-3 text-sm outline-none focus:border-rose-400" placeholder="اكتب الرسالة..." /><div className="mt-3 rounded-xl border border-rose-100 bg-rose-50/60 p-3"><span className="text-[9px] font-black text-rose-500">معاينة الرسالة</span><p dir="auto" className="mt-1 min-h-8 whitespace-pre-wrap break-words text-xs font-bold leading-6 text-rose-800">{content.trim() ? `رسالة من إدارة قلبي لوڤي: ${content.trim()}` : "سيظهر نص الرسالة هنا."}</p></div>{status && <p className="mt-2 text-xs font-bold text-rose-700" role="status">{status}</p>}<div className="mt-4 flex justify-end gap-2"><button onClick={onClose} className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-black text-rose-700">إغلاق</button><button disabled={sending || !content.trim()} onClick={() => void send()} className="rounded-xl bg-rose-700 px-5 py-2 text-xs font-black text-white disabled:opacity-50">{sending ? "جارٍ الإرسال..." : "إرسال"}</button></div></section></div>;
}

function Info({ label, value }: { label: string; value: unknown }) {
  return <div className="min-w-0 rounded-xl bg-rose-50/70 p-3"><span className="block text-[9px] font-black text-rose-500">{label}</span><b className="mt-1 block break-words text-[10px] font-black text-rose-950">{value ? String(value) : "—"}</b></div>;
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return <section className="rounded-2xl border border-rose-100 bg-white p-4"><h3 className="text-xs font-black text-rose-900">{title}</h3>{items.length ? <ul className="mt-2 max-h-44 space-y-1 overflow-y-auto">{items.map((item, index) => <li key={`${index}-${item}`} className="break-words border-b border-rose-50 py-1 text-[9px] font-bold text-rose-700 last:border-0">{item}</li>)}</ul> : <p className="mt-2 text-[9px] font-bold text-rose-400">لا توجد بيانات</p>}</section>;
}

function date(value?: string | null) {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleString("ar-EG");
}
