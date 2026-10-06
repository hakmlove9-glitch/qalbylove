"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Heart, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";


export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const search = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [hiddenLogin, setHiddenLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(search.get("reason") === "idle" ? "تم تسجيل خروجك بعد 15 دقيقة من عدم النشاط لحماية حسابك." : "");

  async function submit() {
    setLoading(true); setMessage("");
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier, password, hiddenLogin }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "تعذر تسجيل الدخول");
      const next = search.get("next");
      const requestedPath = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
      if (data.member?.is_admin) {
        router.replace("/admin");
      } else {
        const completionResponse = await fetch("/api/profile/completion", { cache: "no-store" }).catch(() => null);
        const completion = completionResponse?.ok ? await completionResponse.json().catch(() => null) : null;
        router.replace(typeof completion?.percentage === "number" && completion.percentage < 80
          ? `/profile/edit?next=${encodeURIComponent(requestedPath)}`
          : requestedPath);
      }
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر تسجيل الدخول");
    } finally { setLoading(false); }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-[#fff6fa] p-3 md:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-6xl overflow-hidden rounded-[36px] border border-white bg-white shadow-[0_35px_100px_rgba(80,18,45,.16)] lg:grid-cols-[1.04fr_.96fr]">
        <section className="relative hidden min-h-[720px] overflow-hidden lg:block">
          <Image src="/images/site-v2/couples/couple-12.webp" alt="قلبي لوڤي" fill priority className="object-cover" sizes="54vw" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#4b0b24]/25 via-[#471226]/62 to-[#240810]/94" />
          <div className="relative flex h-full flex-col justify-between p-10 text-white">
            <Link href="/" className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/20"><Heart className="h-7 w-7" fill="currentColor" /></span><div><div className="text-2xl font-black">قلبي لوڤي</div><div className="text-xs font-bold text-rose-100">رجوعك يعني أن الحكاية مستمرة</div></div></Link>
            <div className="max-w-xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black"><Sparkles className="h-4 w-4 text-amber-300" />كل حسابك بعد ضغطة واحدة</span><h1 className="mt-5 text-5xl font-black leading-[1.18]">ادخل… وكل ما يهمك<br /><span className="text-rose-200">أمامك بوضوح وطمأنينة.</span></h1><p className="mt-5 max-w-lg text-base font-bold leading-8 text-white/85">رسائلك، زياراتك، الاهتمامات، التوافقات، ملفك وباقتك في مكان واحد واضح وسريع.</p></div>
            <div className="grid grid-cols-3 gap-3 text-xs font-black"><div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center">خصوصية واضحة</div><div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center">تواصل حي</div><div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center">اقتراحات أقرب لك</div></div>
          </div>
        </section>
        <section className="flex items-center justify-center p-5 sm:p-8 md:p-12"><div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden"><Link href="/" className="text-2xl font-black text-rose-700">قلبي لوڤي</Link><Heart className="h-7 w-7 text-rose-500" /></div>
          <span className="inline-flex rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-600">أهلًا برجوعك</span>
          <h2 className="mt-4 text-4xl font-black tracking-normal text-rose-950">تسجيل الدخول</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-rose-500">اكتب الاسم الذي يظهر للأعضاء. ويمكن استخدام البريد لو كان مرتبطًا بحساب واحد فقط.</p>
          <div className="mt-7 space-y-4">
            <div className="flex items-center rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-400 focus-within:border-rose-300 focus-within:bg-white"><Mail className="h-5 w-5" /><input autoComplete="username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="h-14 w-full bg-transparent px-3 text-sm font-bold text-rose-900 outline-none" placeholder="الاسم الظاهر أو البريد الإلكتروني" /></div>
            <div className="flex items-center rounded-2xl border border-rose-200 bg-rose-50 px-4 text-rose-400 focus-within:border-rose-300 focus-within:bg-white"><LockKeyhole className="h-5 w-5" /><input autoComplete="current-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void submit(); }} className="h-14 w-full bg-transparent px-3 text-sm font-bold text-rose-900 outline-none" placeholder="كلمة المرور" /><button type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-black"><label className="flex items-center gap-2 text-rose-600"><input type="checkbox" checked={hiddenLogin} onChange={(e) => setHiddenLogin(e.target.checked)} className="h-4 w-4 accent-rose-600" />الدخول الخفي <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] text-amber-700">حسب الباقة</span></label><Link href="/forgot-password" className="text-rose-600 hover:underline">نسيت كلمة المرور؟</Link></div>
            {message && <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3 text-xs font-bold leading-6 text-rose-700">{message}</div>}
            <button disabled={loading || !identifier || !password} onClick={() => void submit()} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-[#c80e4c] to-[#ff4678] text-sm font-black text-white shadow-xl shadow-rose-200/70 transition hover:-translate-y-0.5 disabled:opacity-50">{loading ? "لحظة ونفتح حسابك…" : "الدخول إلى حسابي"}<ArrowLeft className="h-4 w-4" /></button>
          </div>
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-xs font-bold leading-6 text-emerald-800"><ShieldCheck className="mb-2 h-5 w-5" />بعد 15 دقيقة من عدم النشاط سيتم تسجيل الخروج تلقائيًا لحماية خصوصيتك.</div>
          <p className="mt-6 text-center text-sm font-bold text-rose-500">أول مرة هنا؟ <Link href="/signup" className="text-rose-600">أنشئ حسابك الآن</Link></p>
        </div></section>
      </div>
    </main>
  );
}


function LoginFallback() {
  return (
    <main dir="rtl" className="grid min-h-screen place-items-center bg-[#fff6fa] p-4">
      <div className="rounded-[28px] border border-rose-100 bg-white px-8 py-7 text-center shadow-[0_20px_70px_rgba(80,18,45,.10)]">
        <div className="mx-auto h-10 w-10 animate-pulse rounded-full bg-rose-100" />
        <div className="mt-4 text-sm font-black text-[#7c1644]">جاري تجهيز تسجيل الدخول...</div>
      </div>
    </main>
  );
}
