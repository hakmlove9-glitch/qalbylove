"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Mail, Search, Send } from "lucide-react";
import { GOVERNORATES } from "@/lib/constants";

type MemberOption = { id: string; username: string; member_number?: number };
type Audience = "member" | "all" | "men" | "women" | "governorate" | "founders" | "subscribers" | "non_subscribers" | "incomplete";

const audiences: Array<[Audience, string]> = [
    ["member", "عضو محدد"], ["all", "كل الأعضاء النشطين"], ["men", "الرجال"], ["women", "النساء"],
    ["governorate", "محافظة محددة"], ["founders", "المؤسسون"], ["subscribers", "المشتركون"],
    ["non_subscribers", "غير المشتركين"], ["incomplete", "ملفات غير مكتملة"],
];

export default function AdminMessagesPage() {
    const [audience, setAudience] = useState<Audience>("member");
    const [governorate, setGovernorate] = useState("");
    const [memberQuery, setMemberQuery] = useState("");
    const [memberOptions, setMemberOptions] = useState<MemberOption[]>([]);
    const [memberId, setMemberId] = useState("");
    const [memberLabel, setMemberLabel] = useState("");
    const [content, setContent] = useState("");
    const [preview, setPreview] = useState<{ count?: number; available: boolean; maxRecipients: number } | null>(null);
    const [previewError, setPreviewError] = useState("");
    const [status, setStatus] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (audience !== "member" || memberQuery.trim().length < 2) {
            setMemberOptions([]);
            return;
        }
        const timer = window.setTimeout(async () => {
            const response = await fetch(`/api/admin/members?q=${encodeURIComponent(memberQuery.trim())}`, { cache: "no-store" });
            const data = response.ok ? await response.json() : null;
            setMemberOptions((data?.members || []).slice(0, 8));
        }, 250);
        return () => window.clearTimeout(timer);
    }, [audience, memberQuery]);

    useEffect(() => {
        let active = true;
        const params = new URLSearchParams({ audience });
        if (audience === "member" && memberId) params.set("member_id", memberId);
        if (audience === "governorate" && governorate) params.set("governorate", governorate);
        if ((audience === "member" && !memberId) || (audience === "governorate" && !governorate)) {
            setPreview(null);
            setPreviewError("");
            return;
        }
        setPreviewError("");
        fetch(`/api/admin/messages?${params.toString()}`, { cache: "no-store" })
            .then((response) => response.json().then((data) => ({ response, data })))
            .then(({ response, data }) => {
                if (!active) return;
                if (!response.ok) throw new Error(data.error || "تعذر تجهيز الجمهور");
                setPreview(data);
            })
            .catch((error) => { if (active) { setPreview(null); setPreviewError(error instanceof Error ? error.message : "تعذر تجهيز الجمهور"); } });
        return () => { active = false; };
    }, [audience, governorate, memberId]);

    async function send() {
        if (!preview || !preview.available || !preview.count || !content.trim()) return;
        const target = audience === "member" ? memberLabel : (audiences.find(([value]) => value === audience)?.[1] || "الجمهور المحدد");
        if (!window.confirm(`سيتم إرسال الرسالة إلى ${preview.count} مستلمًا ضمن «${target}». هل تؤكد الإرسال؟`)) return;
        setSending(true);
        setStatus("");
        try {
            const response = await fetch("/api/admin/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ audience, governorate, member_id: memberId, content: content.trim() }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "تعذر إرسال الرسالة");
            setStatus(`تم إرسال الرسالة إلى ${data.recipientCount} مستلم.`);
            setContent("");
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "تعذر إرسال الرسالة");
        } finally {
            setSending(false);
        }
    }

    return <main>
        <div className="mb-6"><span className="text-xs font-black text-rose-600">تواصل الإدارة</span><h2 className="mt-1 text-3xl font-black text-rose-950">الرسائل الإدارية</h2><p className="mt-2 text-sm font-bold text-rose-500">اختر عضواً أو جمهوراً، وراجع العدد والمعاينة قبل الإرسال.</p></div>
        <section className="grid gap-4 xl:grid-cols-[1fr_.8fr]">
            <div className="rounded-[24px] border border-rose-200 bg-white p-5 shadow-sm">
                <label className="block text-xs font-black text-rose-700">الجمهور</label>
                <select value={audience} onChange={(event) => { setAudience(event.target.value as Audience); setMemberId(""); setMemberLabel(""); setMemberQuery(""); }} className="mt-2 h-12 w-full rounded-xl border border-rose-200 bg-rose-50 px-3 text-sm font-bold">
                    {audiences.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                {audience === "member" && <div className="relative mt-3"><label className="flex items-center gap-2 rounded-xl border border-rose-200 px-3"><Search className="h-4 w-4 text-rose-500" /><input value={memberQuery} onChange={(event) => { setMemberQuery(event.target.value); setMemberId(""); setMemberLabel(""); }} className="h-11 w-full bg-transparent text-xs font-bold outline-none" placeholder="ابحث بالاسم أو البريد أو رقم العضوية" /></label>{memberOptions.length > 0 && <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-rose-100 bg-white p-1 shadow-xl">{memberOptions.map((member) => <button key={member.id} type="button" onClick={() => { setMemberId(member.id); setMemberLabel(member.username); setMemberQuery(`${member.username} · #${member.member_number || "—"}`); setMemberOptions([]); }} className="block w-full rounded-lg px-3 py-2 text-right text-xs font-bold hover:bg-rose-50">{member.username} · #{member.member_number || "—"}</button>)}</div>}</div>}
                {audience === "governorate" && <select value={governorate} onChange={(event) => setGovernorate(event.target.value)} className="mt-3 h-12 w-full rounded-xl border border-rose-200 bg-rose-50 px-3 text-sm font-bold"><option value="">اختر المحافظة</option>{GOVERNORATES.map((item) => <option key={item}>{item}</option>)}</select>}
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-black text-emerald-800">{previewError || (preview ? preview.available ? `عدد المستلمين: ${preview.count ?? "غير متاح"}` : `الجمهور يتجاوز حد الإرسال الآمن (${preview.maxRecipients}). اختر جمهوراً أضيق.` : "اختر الجمهور لتجهيز المعاينة.")}</div>
                <label className="mt-4 block text-xs font-black text-rose-700">نص الرسالة</label>
                <textarea dir="auto" value={content} onChange={(event) => setContent(event.target.value)} rows={7} maxLength={1000} className="mt-2 w-full resize-y rounded-xl border border-rose-200 p-3 text-sm font-bold outline-none focus:border-rose-300" placeholder="اكتب رسالة واضحة ومحترمة..." />
                <div className="mt-1 text-left text-[10px] font-bold text-rose-400">{content.length}/1000</div>
                {status && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-xs font-bold text-rose-700" role="status">{status}</p>}
                <button type="button" onClick={() => void send()} disabled={sending || !content.trim() || !preview?.available || !preview.count} className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-rose-700 to-rose-500 text-sm font-black text-white disabled:opacity-50"><Send className="h-4 w-4" />{sending ? "جارٍ الإرسال..." : "معاينة ثم إرسال"}</button>
            </div>
            <aside className="rounded-[24px] border border-rose-100 bg-white p-5 shadow-sm"><span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-black text-amber-800"><CheckCircle2 className="h-4 w-4" />معاينة</span><h3 className="mt-4 text-lg font-black text-rose-950">رسالة من إدارة قلبي لوڤي</h3><p dir="auto" className="mt-3 min-h-28 whitespace-pre-wrap break-words rounded-2xl bg-rose-50 p-4 text-sm font-bold leading-7 text-rose-800">{content.trim() || "سيظهر نص الرسالة هنا قبل الإرسال."}</p><p className="mt-3 text-[10px] font-bold leading-5 text-rose-500">لا يتم الإرسال قبل تأكيد واضح. الإرسال الجماعي محدود بـ{preview?.maxRecipients || 1000} مستلم لكل عملية لمنع الإرسال غير المقصود.</p></aside>
        </section>
    </main>;
}
