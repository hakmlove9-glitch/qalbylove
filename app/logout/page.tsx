'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('userToken');
    fetch('/api/logout', { method: 'POST' }).finally(() => {
      setTimeout(() => router.push('/'), 700);
    });

    const timer = setTimeout(() => router.push('/'), 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-rose-800 font-sans flex flex-col items-center justify-center p-4 selection:bg-rose-500 selection:text-white" dir="rtl">
      <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-xl text-center max-w-md w-full space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner">
          🔒
        </div>
        <h1 className="text-xl font-black text-rose-900">جاري تسجيل الخروج...</h1>
        <p className="text-xs text-rose-500 font-medium">
          شكراً لاستخدامك منصة قلبي لوڤي. ننتظر عودتك قريباً!
        </p>
        <div className="pt-2">
          <Link href="/" className="inline-block bg-[#831843] hover:bg-rose-950 text-white text-xs font-black px-6 py-3 rounded-xl transition shadow">
            العودة للرئيسية فوراً ←
          </Link>
        </div>
      </div>
    </div>
  );
}
