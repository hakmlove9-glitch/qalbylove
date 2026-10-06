"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, ShieldCheck, XCircle } from "lucide-react";

type Event = {
  id: string;
  member_id: string;
  memberName: string;
  decision: "pending" | "rejected" | "approved" | string;
  reason?: string | null;
  evidenceUrl?: string;
  created_at: string;
  is_primary?: boolean;
  photo_id?: string;
  metadata?: Record<string, any>;
};

export default function AdminPhotosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "rejected" | "approved">("all");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");

  async function load() {
    setLoading(true);
    const query = filter === "all" ? "" : `?decision=${filter}`;
    const response = await fetch(`/api/admin/photos${query}`, { cache: "no-store" });
    const data = await response.json();
    setEvents(data.events || []);
    setLoading(false);
  }

  useEffect(() => { void load(); }, [filter]);

  async function act(id: string, action: "approve" | "reject" | "dismiss" | "primary", reason = "") {
    setWorking(id);
    const response = await fetch("/api/admin/photos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, photo_id: id, action, reason }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) window.alert(data.error || "تعذر تنفيذ الإجراء");
    await load();
    setWorking("");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#fff8fb] p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[30px] border border-rose-100 bg-white p-6 shadow-[0_18px_55px_rgba(75,14,42,.07)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700">
            <ShieldCheck className="h-4 w-4" />لوحة الاستثناءات فقط
          </span>
          <h1 className="mt-4 text-3xl font-black text-[#4b0d2b]">مخالفات وحالات الصور غير الواضحة</h1>
          <p className="mt-2 text-sm font-bold leading-7 text-rose-500">
            الصور السليمة لا تظهر هنا أصلًا. الصفحة تعرض الرفض الآلي والحالات التي لم يحسمها الفحص فقط.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ["all", "تحتاج مراجعة"],
              ["pending", "غير محسومة"],
              ["rejected", "مرفوضة آلياً"],
              ["approved", "معتمدة"],
            ].map(([value, label]) => (
              <button key={value} onClick={() => setFilter(value as any)} className={`rounded-full px-4 py-2 text-xs font-black ${filter === value ? "bg-[#5b0c31] text-white" : "bg-rose-100 text-rose-600"}`}>{label}</button>
            ))}
          </div>
        </section>

        {loading ? (
          <div className="mt-6 rounded-[28px] bg-white p-10 text-center font-black text-rose-400">جاري تحميل الحالات...</div>
        ) : events.length === 0 ? (
          <div className="mt-6 rounded-[28px] border border-emerald-100 bg-emerald-50 p-10 text-center text-sm font-black text-emerald-700">
            مفيش حالات محتاجة وقتك دلوقتي.
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <article key={event.id} className="overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-[0_14px_40px_rgba(70,14,37,.06)]">
                <div className="relative aspect-[4/5] bg-rose-100">
                  {event.evidenceUrl ? <img src={event.evidenceUrl} alt="دليل المخالفة" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-xs font-black text-rose-400">لا توجد معاينة</div>}
                  <span className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-black shadow ${event.decision === "rejected" ? "bg-red-600 text-white" : event.decision === "approved" ? "bg-emerald-600 text-white" : "bg-amber-400 text-amber-950"}`}>
                    {event.decision === "rejected" ? <XCircle className="h-3.5 w-3.5" /> : event.decision === "approved" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                    {event.decision === "rejected" ? "مرفوضة" : event.decision === "approved" ? event.is_primary ? "معتمدة · رئيسية" : "معتمدة" : "قيد المراجعة"}
                  </span>
                </div>
                <div className="p-4">
                  <div className="text-sm font-black text-rose-800">{event.memberName}</div>
                  <div className="mt-1 text-[10px] font-bold text-rose-400">{new Date(event.created_at).toLocaleString("ar-EG")}</div>
                  {event.reason && <div className="mt-3 rounded-xl bg-rose-50 p-3 text-[11px] font-bold leading-6 text-rose-600">{event.reason}</div>}
                  <div className="mt-4 flex gap-2">
                    {event.decision === "approved" ? <button disabled={working === event.id || event.is_primary} onClick={() => void act(event.id, "primary")} className="flex-1 rounded-xl bg-rose-700 px-3 py-2.5 text-[10px] font-black text-white disabled:opacity-50">{event.is_primary ? "الصورة الرئيسية" : "تحديد كرئيسية"}</button> : <>
                      <button disabled={working === event.id} onClick={() => void act(event.id, "approve")} className="flex-1 rounded-xl bg-emerald-600 px-3 py-2.5 text-[10px] font-black text-white">اعتماد كاستثناء</button>
                      <button disabled={working === event.id} onClick={() => { const reason = window.prompt("اكتب سبب رفض الصورة", event.reason || ""); if (reason !== null) void act(event.id, "reject", reason.trim()); }} className="flex-1 rounded-xl bg-red-50 px-3 py-2.5 text-[10px] font-black text-red-600">تأكيد الرفض</button>
                      <button disabled={working === event.id} onClick={() => void act(event.id, "dismiss")} className="grid h-10 w-10 place-items-center rounded-xl bg-rose-100 text-rose-500" title="إغلاق التنبيه"><CheckCircle2 className="h-4 w-4" /></button>
                    </>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
