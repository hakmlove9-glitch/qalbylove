"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clipboard, ImageUp, Landmark, Phone, ReceiptText, ShieldCheck } from "lucide-react";
import MemberShell from "@/components/member/MemberShell";
import { CASH_NETWORKS, MEMBERSHIP_PLANS, PAYMENT_PHONE } from "@/lib/constants";

type Payment = {
  id: string;
  amount: number;
  plan_name?: string | null;
  wallet_network?: string | null;
  sender_wallet?: string | null;
  proof_url?: string | null;
  status: string;
  created_at: string;
};

const walletNumber = PAYMENT_PHONE;
const networks = [...CASH_NETWORKS];
const networkLabels: Record<string, string> = {
  "فودافون كاش": "Vodafone Cash",
  "أورنج كاش": "Orange Cash",
  "اتصالات كاش": "اتصالات / e& Cash",
  "وي كاش": "WE Pay",
};

function statusLabel(status: string) {
  if (status === "approved") return "تم القبول والتفعيل";
  if (status === "rejected") return "مرفوض — راجع بيانات التحويل";
  return "قيد مراجعة الإدارة";
}

export default function PaymentsPage() {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const selectedPlanId = params.get("plan") || "";
  const plan = MEMBERSHIP_PLANS.find((item) => item.id === selectedPlanId) || null;
  const selectedPlan = plan?.title || "";
  const selectedAmount = plan?.price || 0;
  const selectedMonths = plan?.durationMonths || 0;

  const [payments, setPayments] = useState<Payment[]>([]);
  const [network, setNetwork] = useState("");
  const [senderWallet, setSenderWallet] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadPayments() {
    const response = await fetch("/api/payments", { cache: "no-store" });
    const data = await response.json();
    if (response.ok) setPayments(data.payments || []);
  }

  useEffect(() => {
    void loadPayments();
  }, []);

  function chooseReceipt(file: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    setReceipt(file);
    setPreview(file ? URL.createObjectURL(file) : "");
  }

  async function copyNumber() {
    await navigator.clipboard.writeText(walletNumber);
    setMessage("تم نسخ رقم المحفظة.");
  }

  async function submit() {
    if (!selectedAmount || !selectedMonths) {
      setMessage("اختَر الباقة من صفحة باقات التميّز أولًا.");
      return;
    }
    if (!network || !senderWallet.trim() || !receipt) {
      setMessage("اختَر الشبكة واكتب الرقم المحول منه وارفع صورة الإيصال.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("plan_id", selectedPlanId);
      formData.append("wallet_network", network);
      formData.append("sender_wallet", senderWallet.trim());
      formData.append("transaction_ref", transactionRef.trim());
      formData.append("note", note.trim());
      formData.append("receipt", receipt);

      const response = await fetch("/api/payments/request", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || "تعذر إرسال الطلب");

      setMessage("تم إرسال طلبك للإدارة. الباقة ستتفعّل بعد مراجعة التحويل.");
      setNetwork("");
      setSenderWallet("");
      setTransactionRef("");
      setReceipt(null);
      setPreview("");
      setNote("");
      await loadPayments();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر إرسال طلب الدفع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MemberShell title="الدفع وتفعيل التميّز" subtitle="تحويل كاش على الرقم الرسمي، ثم رفع الإيصال لمراجعة الإدارة.">
      <section className="overflow-hidden rounded-[32px] border border-rose-100 bg-white shadow-[0_18px_60px_rgba(80,18,45,.07)]">
        <div className="grid lg:grid-cols-[1fr_360px]">
          <div className="p-6 md:p-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-black text-rose-700"><ShieldCheck className="h-4 w-4" />دفع يدوي ومراجعة بشرية</span>
            <h1 className="mt-4 text-3xl font-black text-[#4a0d2b]">حوّل قيمة الباقة ثم ارفع الإيصال</h1>
            <p className="mt-3 text-sm font-bold leading-7 text-rose-500">التحويل متاح عبر Vodafone Cash وOrange Cash واتصالات / e&amp; Cash وWE Pay.</p>

            <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <div className="text-[10px] font-black text-amber-700">رقم التحويل الرسمي</div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="text-3xl font-black tracking-wider text-[#4a0d2b]">{walletNumber}</div>
                <button onClick={copyNumber} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-amber-800 shadow-sm"><Clipboard className="h-4 w-4" />نسخ الرقم</button>
              </div>
            </div>
            <ol className="mt-4 grid gap-2 text-[10px] font-bold text-rose-700 sm:grid-cols-3">
              <li className="rounded-xl bg-rose-50 px-3 py-2">١. اختَر الباقة والشبكة.</li>
              <li className="rounded-xl bg-rose-50 px-3 py-2">٢. حوّل المبلغ للرقم الرسمي.</li>
              <li className="rounded-xl bg-rose-50 px-3 py-2">٣. أرسل رقم المحفظة والإيصال للمراجعة.</li>
            </ol>

            {selectedAmount > 0 ? (
              <div className="mt-5 rounded-2xl bg-[#4a0d2b] p-4 text-white">
                <div className="text-[10px] font-bold text-rose-100">الباقة المختارة</div>
                <div className="mt-1 text-lg font-black">{selectedPlan}</div>
                <div className="mt-2 text-3xl font-black text-amber-200">{selectedAmount} جنيه</div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs font-black text-rose-700">لم تختَر باقة بعد. <Link href="/subscriptions" className="underline">اختيار باقة التميّز</Link></div>
            )}
          </div>
          <div className="relative min-h-[320px]"><Image src="/images/site-v2/pages/payments/01.webp" alt="الدفع في قلبي لوڤي" fill className="object-cover" sizes="360px" /></div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_.75fr]">
        <div className="rounded-[30px] border border-rose-100 bg-white p-6">
          <h2 className="text-xl font-black">بيانات التحويل</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="الشبكة المحول منها">
              <select value={network} onChange={(e) => setNetwork(e.target.value)} className="pay-input"><option value="">اختر الشبكة</option>{networks.map((item) => <option key={item} value={item}>{networkLabels[item] || item}</option>)}</select>
            </Field>
            <Field label="رقم المحفظة المحول منها"><input value={senderWallet} onChange={(e) => setSenderWallet(e.target.value)} className="pay-input" inputMode="tel" /></Field>
            <Field label="رقم العملية أو المرجع — إن وجد"><input value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} className="pay-input" /></Field>
            <Field label="ملاحظة للإدارة — اختياري"><input value={note} onChange={(e) => setNote(e.target.value)} className="pay-input" /></Field>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-sm font-black">صورة إيصال التحويل</div>
            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-rose-200 bg-rose-50/60 p-5 text-center">
              {preview ? <img src={preview} alt="معاينة الإيصال" className="max-h-60 rounded-xl object-contain" /> : <><ImageUp className="h-8 w-8 text-rose-500" /><span className="mt-2 text-xs font-black text-rose-700">اضغط لرفع صورة الإيصال</span><span className="mt-1 text-[10px] font-bold text-rose-400">JPG أو PNG أو WEBP — بحد أقصى 5 ميجابايت</span></>}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => chooseReceipt(e.target.files?.[0] || null)} />
            </label>
          </div>

          {message && <div className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-black text-rose-700">{message}</div>}
          <button onClick={submit} disabled={loading || !selectedAmount} className="mt-5 h-13 w-full rounded-2xl bg-gradient-to-l from-[#5a0c31] to-[#d52469] text-sm font-black text-white disabled:opacity-50">{loading ? "جاري إرسال الطلب..." : "أرسلت المبلغ — إرسال للمراجعة"}</button>
        </div>

        <div>
          <div className="rounded-[30px] border border-amber-100 bg-white p-6">
            <h2 className="flex items-center gap-2 text-lg font-black"><ReceiptText className="h-5 w-5 text-amber-600" />سجل طلبات الدفع</h2>
            <div className="mt-4 space-y-3">
              {payments.length ? payments.slice(0, 8).map((payment) => (
                <div key={payment.id} className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                  <div className="flex items-center justify-between gap-3"><div className="font-black">{payment.plan_name || "باقة تميّز"}</div><span className={`rounded-full px-2.5 py-1 text-[9px] font-black ${payment.status === "approved" ? "bg-emerald-100 text-emerald-700" : payment.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{statusLabel(payment.status)}</span></div>
                  <div className="mt-2 text-xs font-bold text-rose-500">{payment.amount ? `${payment.amount} جنيه` : ""} • {new Date(payment.created_at).toLocaleDateString("ar-EG")}</div>
                </div>
              )) : <div className="rounded-2xl bg-rose-50 p-5 text-center text-xs font-bold text-rose-400">لا توجد طلبات دفع حتى الآن.</div>}
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`.pay-input{height:48px;width:100%;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc;padding:0 12px;font-size:13px;font-weight:700;outline:none}.pay-input:focus{border-color:#f9a8d4;background:#fff}`}</style>
    </MemberShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-black text-rose-600">{label}</span>{children}</label>;
}
