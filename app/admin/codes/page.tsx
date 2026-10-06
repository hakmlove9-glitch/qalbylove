"use client";

import { useEffect, useState } from "react";
import { Check, Clipboard, KeyRound, RefreshCw, Search } from "lucide-react";

type Plan = { id: string; name: string; price: number; duration_months: number };
type CodeRow = { id: string; code: string; plan_months: number; plan_price: number; is_used: boolean; used_by?: string | null; used_at?: string | null; created_at?: string | null; expires_at?: string | null; used_by_member?: { username?: string; email?: string; member_number?: number } | null };

export default function AdminCodesPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planId, setPlanId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expiresInDays, setExpiresInDays] = useState(60);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (statusFilter) params.set("status", statusFilter);
    const [plansResponse, codesResponse] = await Promise.all([fetch("/api/plans", { cache: "no-store" }), fetch(`/api/admin/codes?${params.toString()}`, { cache: "no-store" })]);
    const plansData = await plansResponse.json();
    const codesData = await codesResponse.json();
    setPlans(plansData.plans ?? []);
    setPlanId((current) => current || plansData.plans?.[0]?.id || "");
    setCodes(codesData.codes ?? []);
  }

  useEffect(() => { load(); }, []);

  async function generate() {
    if (!planId) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: planId, quantity, expires_in_days: expiresInDays }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر إنشاء الأكواد");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إنشاء الأكواد");
    } finally {
      setLoading(false);
    }
  }

  async function copy(code: string) {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(""), 1500);
  }

  return (
    <main>
      <div className="mb-7">
        <p className="text-sm font-black text-rose-600">الباقات</p>
        <h2 className="text-3xl font-black text-rose-950">أكواد التفعيل</h2>
        <p className="mt-2 text-rose-500">أنشئ كودًا واحدًا أو مجموعة أكواد، ثم أرسل الكود للعضو بعد تأكيد الدفع.</p>
      </div>

      <section className="grid gap-4 rounded-[24px] border border-rose-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_130px_150px_180px] md:items-end">
        <label className="block text-sm font-black text-rose-700">الباقة
          <select value={planId} onChange={(event) => setPlanId(event.target.value)} className="mt-2 h-12 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 outline-none focus:border-rose-300">
            {plans.map((plan) => <option key={plan.id} value={plan.id}>{plan.name} — {plan.price} جنيه</option>)}
          </select>
        </label>
        <label className="block text-sm font-black text-rose-700">العدد
          <input type="number" min={1} max={50} value={quantity} onChange={(event) => setQuantity(Number(event.target.value) || 1)} className="mt-2 h-12 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4" />
        </label>
        <label className="block text-sm font-black text-rose-700">تنتهي خلال (يوم)
          <input type="number" min={1} max={365} value={expiresInDays} onChange={(event) => setExpiresInDays(Math.min(365, Math.max(1, Number(event.target.value) || 1)))} className="mt-2 h-12 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4" />
        </label>
        <button type="button" onClick={generate} disabled={loading || !planId} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-rose-600 to-fuchsia-600 px-5 font-black text-white disabled:opacity-50">
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <KeyRound size={18} />} إنشاء الأكواد
        </button>
      </section>

      {error && <div className="mt-4 rounded-2xl bg-red-50 p-4 font-bold text-red-700">{error}</div>}

      <section className="mt-6 overflow-hidden rounded-[28px] border border-rose-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 p-5"><div className="font-black text-rose-900">أكواد التفعيل</div><div className="flex gap-2"><label className="flex items-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3"><Search className="h-4 w-4 text-rose-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void load()} className="h-10 w-48 max-w-[50vw] bg-transparent text-xs font-bold outline-none" placeholder="بحث بالكود أو العضو" /></label><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-rose-100 px-3 text-xs font-bold"><option value="">كل الأكواد</option><option value="unused">غير مستخدم</option><option value="used">مستخدم</option></select><button onClick={() => void load()} className="rounded-xl bg-rose-700 px-4 text-xs font-black text-white">بحث</button></div></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-right text-sm">
            <thead className="bg-rose-50 text-rose-500"><tr><th className="p-4">الكود</th><th className="p-4">القيمة</th><th className="p-4">المدة</th><th className="p-4">الحالة</th><th className="p-4">استخدمه</th><th className="p-4">تاريخ الاستخدام</th><th className="p-4">تاريخ الإنشاء</th><th className="p-4">ينتهي</th><th className="p-4">نسخ</th></tr></thead>
            <tbody>
              {codes.map((row) => (
                <tr key={row.id} className="border-t border-rose-100">
                  <td className="p-4 font-black tracking-wider text-rose-900">{row.code}</td>
                  <td className="p-4">{row.plan_price} جنيه</td>
                  <td className="p-4">{row.plan_months} شهر</td>
                  <td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-black ${row.is_used ? "bg-rose-100 text-rose-500" : "bg-emerald-50 text-emerald-700"}`}>{row.is_used ? "مستخدم" : "متاح"}</span></td>
                  <td className="p-4">{row.used_by_member?.username || (row.used_by ? "عضو" : "—")}{row.used_by_member?.member_number ? ` · #${row.used_by_member.member_number}` : ""}</td>
                  <td className="p-4">{row.used_at ? new Date(row.used_at).toLocaleString("ar-EG") : "—"}</td>
                  <td className="p-4">{row.created_at ? new Date(row.created_at).toLocaleDateString("ar-EG") : "—"}</td>
                  <td className="p-4">{row.expires_at ? new Date(row.expires_at).toLocaleDateString("ar-EG") : "—"}</td>
                  <td className="p-4"><button type="button" onClick={() => copy(row.code)} className="rounded-xl border border-rose-200 p-2 text-rose-600 hover:text-rose-600">{copied === row.code ? <Check size={17} /> : <Clipboard size={17} />}</button></td>
                </tr>
              ))}
              {!codes.length && <tr><td colSpan={9} className="p-8 text-center text-rose-400">لا توجد أكواد مطابقة.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
