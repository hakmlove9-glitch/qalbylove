import { HeartHandshake, ShieldCheck } from "lucide-react";
import Footer from "@/components/shared/Footer";


const rules = [
    ["نية جادة", "قلبي لوڤي مساحة للتعارف بهدف الزواج الجاد. استخدم حسابك بصدق واحترام لوقت الآخرين."],
    ["هوية وبيانات حقيقية", "لا تنتحل شخصية غيرك، ولا تستخدم صوراً أو معلومات مضللة. وضوح الملف يساعد الجميع على اتخاذ قرار واعٍ."],
    ["احترام وحدود", "يُمنع التحرش والضغط والإساءة والتهديد أو إرسال محتوى غير مناسب. احترم رفض الطرف الآخر وخصوصيته."],
    ["لا أموال ولا بيانات حساسة", "لا تطلب المال أو التحويلات، ولا تشارك كلمات المرور أو البيانات البنكية أو وسائل التواصل خارج المنصة."],
    ["الصور والخصوصية", "استخدم صوراً مناسبة تخصك. تخضع الصور للمراجعة، وتُعرض الصور الخاصة وفق إعدادات صاحبها وموافقته."],
    ["الإبلاغ والإجراءات", "استخدم زر الإبلاغ عند الاشتباه في احتيال أو إساءة. للإدارة مراجعة البلاغ واتخاذ إجراء متناسب، بما في ذلك تقييد الحساب عند المخالفة."],
];

export default function EthicsPage() {
    return <main dir="rtl" className="min-h-screen bg-[linear-gradient(180deg,#fff8fb,#fff)]">
        <section className="px-4 py-8 sm:px-6 sm:py-12"><div className="mx-auto max-w-4xl overflow-hidden rounded-[26px] border border-rose-100 bg-white shadow-[0_18px_50px_rgba(76,12,40,.07)]">
            <header className="bg-gradient-to-l from-[#4d0b28] to-[#a7154d] p-6 text-white sm:p-9"><HeartHandshake className="h-8 w-8 text-amber-200" /><h1 className="mt-4 text-3xl font-black">ميثاق السلوك والأمان</h1><p className="mt-2 text-sm font-bold leading-7 text-rose-100">قواعد بسيطة تخلي التعارف أهدأ وأكثر احتراماً للجميع.</p></header>
            <div className="space-y-3 p-4 sm:p-8">{rules.map(([title, content], index) => <section key={title} className="flex gap-3 rounded-2xl border border-rose-100 bg-[#fffafb] p-4 sm:p-5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck className="h-4 w-4" /></span><div><h2 className="font-black text-rose-950">{index + 1}. {title}</h2><p className="mt-2 text-sm font-bold leading-7 text-rose-600">{content}</p></div></section>)}</div>
        </div></section>
        <Footer />
    </main>;
}