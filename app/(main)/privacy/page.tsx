import { LockKeyhole, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

const sections = [
  ["البيانات التي نستخدمها", "نستخدم بيانات التسجيل والملف التي تقدمها، مثل الاسم الظاهر والعمر والموقع والاهتمامات والصور، إضافة إلى بيانات الحساب اللازمة لتسجيل الدخول وحمايته."],
  ["ظهور الملف والصور", "تتحكم إعدادات الخصوصية في ظهور ملفك وصورك. قد تكون بعض الصور خاصة أو متاحة بعد اهتمام متبادل أو بعد موافقتك على طلب المشاهدة."],
  ["الرسائل والتفاعلات", "نستخدم الرسائل والاهتمامات والمفضلة والزيارات لتشغيل ميزات المنصة وتطبيق قواعد التواصل والأمان. لا نعرض بياناتك الخاصة لأعضاء آخرين إلا وفق إعداداتك وما تسمح به الخدمة."],
  ["حماية الحساب", "لا يستطيع فريق الدعم معرفة كلمة مرورك القديمة. لا تشارك كلمة المرور أو رموز التفعيل مع أي شخص."],
  ["البلاغات والمراجعة", "قد يراجع فريق الإدارة البلاغات والصور والمحتوى الذي أُبلغ عنه للتحقق من الالتزام بالشروط واتخاذ الإجراء المناسب."],
  ["الاحتفاظ والتحكم", "يمكنك تعديل بيانات ملفك وإعدادات الظهور من حسابك. قد نحتفظ بسجلات لازمة للأمان أو لمعالجة البلاغات والالتزامات النظامية."],
  ["التواصل بشأن الخصوصية", "للاستفسار أو طلب المساعدة، تواصل مع فريق قلبي لوڤي عبر مركز المساعدة داخل المنصة."],
];

export default function PrivacyPage() {
  return <main dir="rtl" className="min-h-screen bg-[linear-gradient(180deg,#fff8fb,#fff)] px-4 py-8 sm:px-6 sm:py-12">
    <div className="mx-auto max-w-4xl overflow-hidden rounded-[26px] border border-rose-100 bg-white shadow-[0_18px_50px_rgba(76,12,40,.07)]">
      <header className="bg-gradient-to-l from-[#4d0b28] to-[#a7154d] p-6 text-white sm:p-9"><LockKeyhole className="h-8 w-8 text-rose-200" /><h1 className="mt-4 text-3xl font-black">سياسة الخصوصية</h1><p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-rose-100">خصوصيتك جزء أساسي من تجربة التعارف الجاد في قلبي لوڤي.</p></header>
      <div className="space-y-3 p-4 sm:p-8">{sections.map(([title, content], index) => <section key={title} className="rounded-2xl border border-rose-100 bg-[#fffafb] p-4 sm:p-5"><div className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600"><ShieldCheck className="h-4 w-4" /></span><div><h2 className="text-base font-black text-rose-950">{index + 1}. {title}</h2><p className="mt-2 text-sm font-bold leading-7 text-rose-600">{content}</p></div></div></section>)}</div>
    </div>
  </main>;
}

