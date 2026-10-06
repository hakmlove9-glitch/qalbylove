"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Flag, ShieldAlert, XCircle } from "lucide-react";

type Person = { id: string; username: string; account_status?: string; verification_status?: string } | null;
type Report = {
  id: string;
  reporter_id: string;
  reported_member_id: string;
  reason: string;
  details?: string | null;
  status: string;
  created_at?: string;
  reporter?: Person;
  reported?: Person;
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");

  async function loadReports() {
    setLoading(true);
    const res = await fetch("/api/admin/reports", { cache: "no-store" });
    const data = await res.json();
    setReports(data.reports || []);
    setLoading(false);
  }

  useEffect(() => { void loadReports(); }, []);
  const shown = useMemo(() => filter === "all" ? reports : reports.filter(r => r.status === filter), [reports, filter]);

  async function updateReport(id: string, status: string) {
    setWorking(id);
    await fetch("/api/admin/reports", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    await loadReports();
    setWorking("");
  }

  async function actOnReport(report: Report, action: "warn" | "block") {
    if (action === "block" && !window.confirm("سيتم إيقاف حساب العضو المبلّغ عنه. هل تؤكد؟")) return;
    setWorking(report.id);
    const response = await fetch("/api/admin/reports", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: report.id, action }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) window.alert(data.error || "تعذر تنفيذ الإجراء");
    await loadReports();
    setWorking("");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#fff9fb] p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[30px] border border-rose-100 bg-white p-6 shadow-[0_18px_55px_rgba(75,14,42,.07)]">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700"><ShieldAlert className="h-4 w-4" />بلاغات حقيقية من الأعضاء فقط</span>
          <h1 className="mt-4 text-3xl font-black text-[#4b0d2b]">مراجعة البلاغات</h1>
          <p className="mt-2 text-sm font-bold leading-7 text-rose-500">راجع السبب والتفاصيل والحساب المرتبط قبل اتخاذ أي قرار. كل تغيير حالة يُسجل في سجل الإدارة.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[['pending', 'قيد المراجعة'], ['resolved', 'تمت المعالجة'], ['rejected', 'مغلقة'], ['all', 'الكل']].map(([value, label]) => (
              <button key={value} onClick={() => setFilter(value)} className={`rounded-full px-4 py-2 text-xs font-black ${filter === value ? 'bg-[#5b0c31] text-white' : 'bg-rose-100 text-rose-600'}`}>{label}</button>
            ))}
          </div>
        </section>

        {loading ? <div className="mt-6 rounded-[28px] bg-white p-10 text-center font-black text-rose-400">جاري تحميل البلاغات...</div> : shown.length === 0 ? (
          <div className="mt-6 rounded-[28px] border border-emerald-100 bg-emerald-50 p-10 text-center text-sm font-black text-emerald-700">لا توجد بلاغات في هذا التصنيف.</div>
        ) : (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {shown.map(report => (
              <article key={report.id} className="rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_12px_35px_rgba(70,15,40,.05)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2"><Flag className="h-4 w-4 text-red-500" /><h2 className="font-black text-rose-900">{report.reason}</h2></div>
                    <p className="mt-1 text-[11px] font-bold text-rose-400">{report.created_at ? new Date(report.created_at).toLocaleString('ar-EG') : ''}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-black ${report.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : report.status === 'rejected' ? 'bg-rose-100 text-rose-600' : 'bg-amber-50 text-amber-700'}`}>{report.status === 'resolved' ? 'تمت المعالجة' : report.status === 'rejected' ? 'مغلق' : 'قيد المراجعة'}</span>
                </div>
                {report.details && <div className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm font-semibold leading-7 text-rose-600">{report.details}</div>}
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl border border-rose-100 p-3 text-xs"><span className="text-rose-400">المبلّغ</span><div className="mt-1 font-black">{report.reporter?.username || 'عضو'}</div></div>
                  <div className="rounded-2xl border border-red-100 bg-red-50/40 p-3 text-xs"><span className="text-red-400">المبلّغ عنه</span><div className="mt-1 font-black text-rose-900">{report.reported?.username || 'عضو'}</div>{report.reported?.id && <Link href={`/member/${report.reported.id}`} className="mt-2 inline-block font-black text-rose-700">فتح الملف</Link>}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button disabled={working === report.id} onClick={() => void updateReport(report.id, 'resolved')} className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white"><CheckCircle2 className="h-4 w-4" />تمت المعالجة</button>
                  <button disabled={working === report.id} onClick={() => void updateReport(report.id, 'rejected')} className="inline-flex items-center gap-1 rounded-xl bg-rose-100 px-4 py-2.5 text-xs font-black text-rose-700"><XCircle className="h-4 w-4" />إغلاق البلاغ</button>
                  {report.status === "pending" && <button disabled={working === report.id} onClick={() => void actOnReport(report, "warn")} className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-black text-amber-800 disabled:opacity-50">إرسال تحذير</button>}
                  {report.status === "pending" && <button disabled={working === report.id} onClick={() => void actOnReport(report, "block")} className="rounded-xl bg-red-700 px-4 py-2.5 text-xs font-black text-white disabled:opacity-50">حظر العضو</button>}
                  {report.status !== 'pending' && <button disabled={working === report.id} onClick={() => void updateReport(report.id, 'pending')} className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-black text-amber-800"><Clock3 className="h-4 w-4" />إعادة للمراجعة</button>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
