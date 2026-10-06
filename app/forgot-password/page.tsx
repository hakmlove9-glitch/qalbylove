"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Mail, Phone, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);

  async function submit() {
    setLoading(true); setMessage(""); setOk(false);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "email" ? { email: value } : { phone: value }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر إرسال الطلب");
      setOk(true);
      setMessage(data.message || "إذا كانت البيانات مرتبطة بحسابات، ستصلك تعليمات الاستعادة.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر إرسال الطلب");
    } finally { setLoading(false); }
  }

  return <main dir="rtl" className="grid min-h-screen place-items-center bg-[#fff6fa] p-4">
    <section className="w-full max-w-xl rounded-[32px] border border-white bg-white p-7 shadow-[0_30px_90px_rgba(80,18,45,.13)] md:p-10">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-600">{mode === "email" ? <Mail className="h-7 w-7"/> : <Phone className="h-7 w-7"/>}</div>
      <h1 className="mt-5 text-3xl font-black text-rose-950">استعادة حساباتي</h1>
      <p className="mt-2 text-sm font-bold leading-7 text-rose-500">يمكنك البحث بالبريد أو رقم الهاتف. إذا كان لديك أكثر من حساب بنفس وسيلة الاستعادة سنرسل لك أسماء الحسابات وروابط آمنة لتعيين كلمة مرور جديدة لكل حساب.</p>
      <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-rose-50 p-1.5">
        <button onClick={()=>{setMode("email");setValue("");setMessage("")}} className={`h-11 rounded-xl text-sm font-black ${mode==="email"?"bg-white text-rose-600 shadow":"text-rose-500"}`}>عبر البريد</button>
        <button onClick={()=>{setMode("phone");setValue("");setMessage("")}} className={`h-11 rounded-xl text-sm font-black ${mode==="phone"?"bg-white text-rose-600 shadow":"text-rose-500"}`}>عبر الهاتف</button>
      </div>
      <div className="mt-6">
        <label className="mb-2 block text-sm font-black text-rose-700">{mode==="email"?"البريد الإلكتروني":"رقم الهاتف"} <b className="text-red-500">*</b></label>
        <input type={mode==="email"?"email":"tel"} inputMode={mode==="email"?"email":"tel"} value={value} onChange={(e)=>setValue(e.target.value)} className="h-14 w-full rounded-2xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold outline-none focus:border-rose-300 focus:bg-white" placeholder=""/>
      </div>
      {message&&<div className={`mt-4 rounded-2xl border p-4 text-xs font-bold leading-6 ${ok?"border-emerald-100 bg-emerald-50 text-emerald-800":"border-rose-100 bg-rose-50 text-rose-700"}`}>{ok&&<CheckCircle2 className="mb-2 h-5 w-5"/>}{message}</div>}
      <button disabled={loading||!value.trim()} onClick={()=>void submit()} className="mt-5 h-14 w-full rounded-2xl bg-gradient-to-l from-[#c80e4c] to-[#ff4678] text-sm font-black text-white disabled:opacity-50">{loading?"جاري البحث والإرسال…":"إرسال بيانات الاستعادة"}</button>
      <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-xs font-bold leading-6 text-rose-600"><ShieldCheck className="mb-2 h-5 w-5 text-emerald-600"/>لن نرسل كلمة المرور القديمة مطلقًا؛ كلمات المرور محفوظة بصورة غير قابلة للاسترجاع. سنرسل أسماء الحسابات وروابط آمنة لإنشاء كلمة مرور جديدة.</div>
      <Link href="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-black text-rose-600"><ArrowRight className="h-4 w-4"/>العودة لتسجيل الدخول</Link>
    </section>
  </main>;
}
