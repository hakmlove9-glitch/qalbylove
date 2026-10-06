"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Crown, EyeOff, HeartHandshake, Search, ShieldCheck, Sparkles } from "lucide-react";
import MemberShell from "@/components/member/MemberShell";

export default function PrivilegesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-subscription", { cache: "no-store" })
      .then((response) => response.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const founder = data?.founder === true;
  const presentation = data?.presentation;

  return (
    <MemberShell title="امتيازات حسابك" subtitle="ما تراه هنا مرتبط بحالة حسابك الحقيقية، وليس شارات تجريبية.">
      {loading ? <div className="ql-page-card p-12 text-center font-black text-rose-400">جاري تحميل امتيازاتك...</div> : (
        <div className="space-y-5">
          {founder && (
            <section className="overflow-hidden rounded-[32px] border border-amber-200 bg-gradient-to-l from-[#fff8df] via-white to-[#fff4e6] p-6 shadow-[0_20px_55px_rgba(116,78,20,.10)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg"><Crown className="h-7 w-7" /></span><div><div className="text-xs font-black text-amber-700">عضوية دائمة</div><h2 className="mt-1 text-2xl font-black text-[#4b2a0b]">أنت من مؤسسي قلبي لوڤي</h2><p className="mt-1 text-xs font-bold text-rose-600">رقم العضوية: {data?.memberNumber || "—"}</p></div></div>
                <Link href="/founders" className="rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-xs font-black text-amber-800">قسم المؤسسين</Link>
              </div>
            </section>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Privilege icon={<Search />} title="البحث والتصفح" text="البحث وقراءة الملفات الأساسية متاحان ضمن الاستخدام الأساسي للمنصة." tone="emerald" />
            <Privilege icon={<HeartHandshake />} title="التواصل باحترام" text="المحادثة تبدأ فقط بعد اهتمام متبادل بين الطرفين؛ لا توجد باقة تتجاوز هذا الشرط." tone="rose" />
            <Privilege icon={<ShieldCheck />} title="الخصوصية والتوثيق" text="التوثيق ليس للبيع، وإعدادات الصور والظهور مستقلة عن مستوى الباقة." tone="emerald" />
            <Privilege icon={<EyeOff />} title="التصفح الخفي" text={founder || presentation?.active ? "متاح إذا كانت حالة عضويتك تشمل ميزة الدخول المتخفي." : "ميزة إضافية لبعض العضويات، ولا تغيّر قواعد التواصل أو الاهتمام المتبادل."} tone="gold" />
          </div>

          {!founder && (
            <section className="rounded-[28px] border border-rose-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-[#4a0d2b]"><Sparkles className="h-5 w-5 text-rose-600" /><h3 className="font-black">عضويتك الحالية: {presentation?.title || "عضو أساسي"}</h3></div>
              <p className="mt-2 text-xs font-bold leading-6 text-rose-500">الباقات الإضافية تظهر لك بعد الدخول كاختيار للتميّز، وليست شرطًا للتسجيل.</p>
              <Link href="/subscriptions" className="ql-btn-secondary mt-4 inline-flex text-xs">عرض خيارات التميّز</Link>
            </section>
          )}
        </div>
      )}
    </MemberShell>
  );
}

function Privilege({ icon, title, text, tone }: { icon: React.ReactNode; title: string; text: string; tone: "rose" | "emerald" | "gold" }) {
  const styles = tone === "emerald" ? "border-emerald-100 bg-emerald-50/60 text-emerald-800" : tone === "gold" ? "border-amber-200 bg-amber-50/70 text-amber-800" : "border-rose-100 bg-rose-50/60 text-rose-800";
  return <div className={`rounded-[26px] border p-5 ${styles}`}><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/80 shadow-sm [&>svg]:h-5 [&>svg]:w-5">{icon}</span><h3 className="mt-4 text-lg font-black">{title}</h3><p className="mt-2 text-xs font-bold leading-6 opacity-80">{text}</p></div>;
}
