import Footer from "@/components/shared/Footer";
import { ShieldCheck } from "lucide-react";


export default function TermsPage() {
  const points = [
    "استخدام المنصة يكون بهدف التعارف الجاد للزواج وباحترام متبادل.",
    "يجب تقديم بيانات صحيحة وعدم انتحال شخصية أو إنشاء حسابات مضللة.",
    "يُمنع التحرش أو الإساءة أو الابتزاز أو طلب الأموال أو المعلومات البنكية من الأعضاء.",
    "يُمنع نشر صور غير مناسبة أو صور لا تملك حق استخدامها.",
    "تُستخدم الرسائل داخل المنصة، وتُفتح المحادثة بعد الاهتمام المتبادل وفق قواعد الخدمة.",
    "يحق للإدارة مراجعة البلاغات والصور واتخاذ إجراء متناسب، بما في ذلك تعليق الحساب المخالف.",
    "يجب الحفاظ على بيانات الدخول وعدم مشاركة كلمة المرور مع أي شخص.",
    "تخضع طلبات الاشتراك والتحويل لمراجعة الإدارة، ولا يشتري الاشتراك التوثيق أو يجاوز قواعد التواصل.",
  ];
  return (
    <main dir="rtl" className="min-h-screen">
      <section className="ql-container py-10 md:py-14">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[34px] border border-rose-100 bg-white shadow-[0_24px_70px_rgba(79,12,40,.07)]">
          <div className="bg-gradient-to-l from-[#4d0b28] to-[#a7154d] p-8 text-white">
            <ShieldCheck className="h-8 w-8 text-rose-200" />
            <h1 className="mt-4 text-4xl font-black">شروط الاستخدام</h1>
            <p className="mt-2 text-sm font-bold leading-7 text-rose-100">قواعد واضحة عشان تفضل قلبي لوڤي مساحة جادة ومحترمة وآمنة.</p>
          </div>
          <div className="space-y-3 p-6 md:p-8">
            {points.map((point, index) => <div key={point} className="flex gap-3 rounded-2xl border border-rose-100 bg-[#fffafb] p-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-600 text-xs font-black text-white">{index + 1}</span><p className="text-sm font-bold leading-7 text-rose-600">{point}</p></div>)}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
