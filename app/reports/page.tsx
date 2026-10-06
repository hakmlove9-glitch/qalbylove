"use client";

import { useEffect, useState } from "react";
import { Flag, ShieldCheck } from "lucide-react";
import MemberShell from "@/components/member/MemberShell";

type Report = {
  id: string;
  reporter_id: string;
  reported_member_id: string;
  reason: string;
  details: string | null;
  status: string | null;
  created_at: string | null;
  reviewed_at: string | null;
};

function statusMeta(status: string | null) {
  if (status === "resolved") return { label: "تمت المعالجة", cls: "bg-emerald-50 text-emerald-700" };
  if (status === "rejected") return { label: "تم إغلاق البلاغ", cls: "bg-slate-100 text-slate-600" };
  return { label: "قيد المراجعة", cls: "bg-amber-50 text-amber-700" };
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { void loadReports(); }, []);

  async function loadReports() {
    try {
      const res = await fetch("/api/reports", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر تحميل البلاغات");
      setReports(data.reports || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل البلاغات");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MemberShell title="بلاغاتي" subtitle="تابع حالة البلاغات التي أرسلتها للإدارة من مكان واحد.">
      {error && <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-xs font-black text-red-700">{error}</div>}
      <section className="ql-page-card p-5">
        {loading ? (
          <div className="py-14 text-center text-sm font-black text-rose-400">جاري تحميل البلاغات...</div>
        ) : reports.length === 0 ? (
          <div className="py-14 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-rose-200" />
            <h2 className="mt-4 text-xl font-black text-[#3a0c20]">لا توجد بلاغات</h2>
            <p className="mt-2 text-sm font-bold text-rose-500">أدوات الإبلاغ موجودة داخل ملف كل عضو عند الحاجة.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((report) => {
              const status = statusMeta(report.status);
              return (
                <article key={report.id} className="rounded-[24px] border border-rose-100 bg-[#fffafb] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 text-rose-600"><Flag className="h-5 w-5"/></span>
                      <div>
                        <div className="text-sm font-black text-[#3a0c20]">{report.reason}</div>
                        <div className="mt-1 text-[10px] font-bold text-rose-400">{report.created_at ? new Date(report.created_at).toLocaleString("ar-EG") : ""}</div>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-[10px] font-black ${status.cls}`}>{status.label}</span>
                  </div>
                  {report.details && <p className="mt-3 text-xs font-bold leading-6 text-rose-500">{report.details}</p>}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </MemberShell>
  );
}
