"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

type Row = {
  id: string;
  user_id: string;
  plan_name: string;
  price: number;
  status: string;
  starts_at?: string | null;
  ends_at?: string | null;
  member?: { username?: string | null; email?: string | null; member_number?: number | null } | null;
};

const statusLabel: Record<string, string> = { active: "فعّال", paused: "موقوف مؤقتًا", cancelled: "ملغي", expired: "منتهي" };

export default function AdminSubscriptionsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/subscriptions", { cache: "no-store" });
    const data = await response.json();
    setRows(data.subscriptions ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    await fetch("/api/admin/subscriptions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    await load();
  }

  return (
    <main>
      <div className="mb-7 flex items-end justify-between gap-4">
        <div><p className="text-sm font-black text-rose-600">الباقات</p><h2 className="text-3xl font-black text-rose-950">إدارة الاشتراكات</h2></div>
        <button type="button" onClick={load} className="rounded-2xl border border-rose-200 bg-white p-3 text-rose-600"><RefreshCw size={19} className={loading ? "animate-spin" : ""} /></button>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-rose-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-right text-sm">
            <thead className="bg-rose-50 text-rose-500"><tr><th className="p-4">العضو</th><th className="p-4">الباقة</th><th className="p-4">السعر</th><th className="p-4">الحالة</th><th className="p-4">تاريخ الانتهاء</th><th className="p-4">الإجراء</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-rose-100">
                  <td className="p-4"><div className="font-black text-rose-900">{row.member?.username || "عضو"}</div><div className="text-xs text-rose-400">{row.member?.email || row.user_id}</div></td>
                  <td className="p-4 font-bold">{row.plan_name}</td>
                  <td className="p-4">{row.price} جنيه</td>
                  <td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-black ${row.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>{statusLabel[row.status] || row.status}</span></td>
                  <td className="p-4">{row.ends_at ? new Date(row.ends_at).toLocaleDateString("ar-EG") : "—"}</td>
                  <td className="p-4"><select value={row.status} onChange={(event) => setStatus(row.id, event.target.value)} className="rounded-xl border border-rose-200 bg-white px-3 py-2"><option value="active">فعّال</option><option value="paused">موقوف</option><option value="cancelled">ملغي</option><option value="expired">منتهي</option></select></td>
                </tr>
              ))}
              {!rows.length && !loading && <tr><td colSpan={6} className="p-10 text-center text-rose-400">لا توجد اشتراكات حتى الآن.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
