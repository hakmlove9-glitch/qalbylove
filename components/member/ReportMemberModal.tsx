"use client";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useState } from "react";

const reasons = [
  "طلب أموال أو تحويلات مالية",
  "ابتزاز أو تهديد",
  "حساب مزيف أو انتحال شخصية",
  "إساءة أو مضايقة",
  "محتوى غير مناسب",
  "محاولة احتيال أو سلوك مريب",
  "سبب آخر",
];

export default function ReportMemberModal({
  open,
  memberId,
  memberName,
  onClose,
}: {
  open: boolean;
  memberId: string;
  memberName: string;
  onClose: () => void;
}) {
  const [reason, setReason] = useState(reasons[0]);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportedId: memberId,
          reason,
          details: details.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "تعذر إرسال البلاغ");
      setDone(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "تعذر إرسال البلاغ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-rose-950/55 p-4 backdrop-blur-sm" dir="rtl">
      <div className="w-full max-w-lg overflow-hidden rounded-[30px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-rose-100 px-5 py-4">
          <div>
            <div className="text-base font-black text-rose-900">الإبلاغ عن {memberName}</div>
            <div className="mt-1 text-[11px] font-bold text-rose-400">البلاغ يصل إلى الإدارة للمراجعة فقط.</div>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-rose-100 text-rose-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-3 text-xl font-black">تم استلام بلاغك</h3>
            <p className="mt-2 text-sm font-bold text-rose-500">شكرًا لمساعدتنا في الحفاظ على مجتمع آمن ومحترم.</p>
            <button onClick={onClose} className="mt-5 rounded-2xl bg-rose-900 px-6 py-3 text-xs font-black text-white">إغلاق</button>
          </div>
        ) : (
          <div className="p-5">
            <div className="mb-4 flex items-start gap-3 rounded-2xl bg-amber-50 p-3 text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-xs font-bold leading-6">لو يوجد خطر مباشر أو تهديد حقيقي، أوقف التواصل فورًا ولا ترسل أي أموال أو معلومات حساسة.</p>
            </div>

            <label className="block text-xs font-black text-rose-700">سبب البلاغ</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {reasons.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setReason(item)}
                  className={`rounded-2xl border px-3 py-3 text-right text-[11px] font-black transition ${reason === item ? "border-rose-500 bg-rose-50 text-rose-700" : "border-rose-200 bg-white text-rose-600 hover:bg-rose-50"}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <label className="mt-4 block text-xs font-black text-rose-700">تفاصيل إضافية <span className="font-bold text-rose-400">(اختياري)</span></label>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              rows={4}
              maxLength={700}
              className="mt-2 w-full resize-none rounded-2xl border border-rose-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-50"
              placeholder="اكتب ما حدث باختصار دون مشاركة كلمات مرور أو بيانات بنكية."
            />
            {error && <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-700">{error}</div>}
            <button disabled={loading} onClick={submit} className="mt-4 w-full rounded-2xl bg-gradient-to-l from-rose-600 to-pink-500 py-3 text-sm font-black text-white shadow-lg shadow-rose-100 disabled:opacity-60">
              {loading ? "جاري إرسال البلاغ..." : "إرسال البلاغ للإدارة"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
