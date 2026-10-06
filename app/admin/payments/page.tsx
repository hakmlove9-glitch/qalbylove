"use client";

import { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { CheckCircle2, ExternalLink, ReceiptText, ShieldCheck, XCircle } from "lucide-react";

type Payment = {
  id: string;
  member_id: string;
  amount: number;
  wallet_network?: string | null;
  sender_wallet?: string | null;
  receipt_url?: string | null;
  plan_name?: string | null;
  duration_months?: number | null;
  transaction_ref?: string | null;
  note?: string | null;
  status: string;
  rejection_reason?: string | null;
  created_at: string;
};

function statusClass(status: string) {
  if (status === "approved") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (status === "rejected") return "bg-red-50 text-red-700 border-red-100";
  return "bg-amber-50 text-amber-800 border-amber-100";
}

function statusLabel(status: string) {
  if (status === "approved") return "مفعّل";
  if (status === "rejected") return "مرفوض";
  return "قيد المراجعة";
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  async function loadPayments() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/payments", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تحميل الطلبات");
      setPayments(data.payments || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadPayments(); }, []);

  async function approve(paymentId: string) {
    setBusyId(paymentId);
    setMessage("");
    try {
      const response = await fetch("/api/admin/payments/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: paymentId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر اعتماد الطلب");
      setMessage(data.message || "تم اعتماد الطلب");
      await loadPayments();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر اعتماد الطلب");
    } finally { setBusyId(""); }
  }

  async function reject(paymentId: string) {
    const reason = window.prompt("سبب الرفض — سيظهر للعضو")?.trim() || "";
    if (!reason) return;
    setBusyId(paymentId);
    setMessage("");
    try {
      const response = await fetch("/api/admin/payments/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: paymentId, reason }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر رفض الطلب");
      setMessage(data.message || "تم رفض الطلب");
      await loadPayments();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر رفض الطلب");
    } finally { setBusyId(""); }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[linear-gradient(180deg,#fffdf8,#fff5f8)]">
      <Header />
      <section className="container mx-auto px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700"><ShieldCheck className="h-4 w-4"/>مراجعة يدوية آمنة</span>
            <h1 className="mt-3 text-3xl font-black text-[#4a0d2b]">طلبات الاشتراك والدفع</h1>
            <p className="mt-2 text-sm font-bold text-rose-500">القيمة والمدة تؤخذان من العضوية المعتمدة على الخادم، ولا يتم الاعتماد على بيانات يرسلها المتصفح.</p>
          </div>
          <button onClick={()=>void loadPayments()} className="rounded-xl border border-rose-100 bg-white px-4 py-2 text-xs font-black text-rose-700">تحديث</button>
        </div>

        {message && <div className="mb-5 rounded-2xl border border-rose-100 bg-white p-4 text-sm font-black text-rose-700">{message}</div>}

        {loading ? <div className="rounded-3xl bg-white p-10 text-center font-bold text-rose-400">جاري تحميل الطلبات...</div> : (
          <div className="space-y-4">
            {payments.length === 0 && <div className="rounded-3xl bg-white p-10 text-center font-bold text-rose-400">لا توجد طلبات دفع.</div>}
            {payments.map((payment) => (
              <article key={payment.id} className="rounded-[28px] border border-rose-100 bg-white p-5 shadow-[0_12px_35px_rgba(80,18,45,.05)]">
                <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr_.8fr_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2"><ReceiptText className="h-5 w-5 text-amber-600"/><h2 className="font-black text-[#4a0d2b]">{payment.plan_name || "عضوية"}</h2><span className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${statusClass(payment.status)}`}>{statusLabel(payment.status)}</span></div>
                    <div className="mt-2 text-xs font-bold text-rose-500">عضو: {payment.member_id}</div>
                    <div className="mt-1 text-xs font-bold text-rose-500">{new Date(payment.created_at).toLocaleString("ar-EG")}</div>
                  </div>
                  <div className="text-sm font-black text-rose-700"><div>{payment.amount} جنيه</div><div className="mt-1 text-xs text-rose-500">{payment.duration_months || 0} شهر</div></div>
                  <div className="text-xs font-bold text-rose-600"><div>{payment.wallet_network || "—"}</div><div className="mt-1">{payment.sender_wallet || "—"}</div>{payment.transaction_ref && <div className="mt-1 text-rose-400">مرجع: {payment.transaction_ref}</div>}</div>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    {payment.receipt_url && <a href={payment.receipt_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-black text-amber-800"><ExternalLink className="h-4 w-4"/>الإيصال</a>}
                    {payment.status === "pending" && <><button disabled={busyId===payment.id} onClick={()=>void approve(payment.id)} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white disabled:opacity-50"><CheckCircle2 className="h-4 w-4"/>اعتماد</button><button disabled={busyId===payment.id} onClick={()=>void reject(payment.id)} className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700 disabled:opacity-50"><XCircle className="h-4 w-4"/>رفض</button></>}
                  </div>
                </div>
                {(payment.note || payment.rejection_reason) && <div className="mt-4 grid gap-2 text-xs font-bold text-rose-500 sm:grid-cols-2">{payment.note && <div className="rounded-xl bg-rose-50 p-3">ملاحظة العضو: {payment.note}</div>}{payment.rejection_reason && <div className="rounded-xl bg-red-50 p-3 text-red-700">سبب الرفض: {payment.rejection_reason}</div>}</div>}
              </article>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
