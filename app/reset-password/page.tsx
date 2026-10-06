"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { CheckCircle2, KeyRound } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  async function submit() {
    if (password.length < 8) return setMessage("كلمة المرور يجب ألا تقل عن 8 أحرف");
    if (password !== confirm) return setMessage("كلمتا المرور غير متطابقتين");
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر تغيير كلمة المرور");
      setDone(true); setMessage(data.message || "تم تغيير كلمة المرور بنجاح");
    } catch (error) { setMessage(error instanceof Error ? error.message : "تعذر تغيير كلمة المرور"); }
    finally { setLoading(false); }
  }

  return <main dir="rtl" className="grid min-h-screen place-items-center bg-[#fff6fa] p-4"><section className="w-full max-w-lg rounded-[32px] border border-white bg-white p-7 shadow-[0_30px_90px_rgba(80,18,45,.13)] md:p-10"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600"><KeyRound className="h-7 w-7"/></div><h1 className="mt-5 text-3xl font-black text-rose-950">كلمة مرور جديدة</h1>{done?<><div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm font-bold text-emerald-800"><CheckCircle2 className="mb-2 h-6 w-6"/>{message}</div><Link href="/login" className="mt-5 flex h-14 items-center justify-center rounded-2xl bg-rose-600 text-sm font-black text-white">العودة وتسجيل الدخول</Link></>:<><p className="mt-2 text-sm font-bold leading-7 text-rose-500">اختر كلمة مرور قوية لا تستخدمها في مواقع أخرى.</p><div className="mt-6 space-y-4"><input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="h-14 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold outline-none focus:border-rose-300 focus:bg-white" placeholder="كلمة المرور الجديدة"/><input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} className="h-14 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold outline-none focus:border-rose-300 focus:bg-white" placeholder="تأكيد كلمة المرور"/></div>{message&&<div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs font-bold text-rose-700">{message}</div>}<button disabled={loading||!token} onClick={()=>void submit()} className="mt-5 h-14 w-full rounded-2xl bg-gradient-to-l from-[#c80e4c] to-[#ff4678] text-sm font-black text-white disabled:opacity-50">{loading?"جاري الحفظ…":"حفظ كلمة المرور الجديدة"}</button>{!token&&<p className="mt-4 text-xs font-bold text-red-600">الرابط غير مكتمل. اطلب رابط استعادة جديدًا.</p>}</>}</section></main>;
}


function ResetPasswordFallback() {
  return (
    <main dir="rtl" className="grid min-h-screen place-items-center bg-[#fff6fa] p-4">
      <section className="w-full max-w-lg rounded-[32px] border border-white bg-white p-8 text-center shadow-[0_30px_90px_rgba(80,18,45,.13)]">
        <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-rose-100" />
        <div className="mt-4 text-sm font-black text-[#7c1644]">جاري التحقق من رابط الاستعادة...</div>
      </section>
    </main>
  );
}
