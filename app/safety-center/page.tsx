"use client";

import Link from "next/link";
import { Banknote, Flag, LockKeyhole, MapPinned, ShieldAlert, ShieldCheck, HeartHandshake, PhoneOff, UserRoundCheck } from "lucide-react";
import MemberShell from "@/components/member/MemberShell";

const items = [
  { icon: Banknote, title: "لا ترسل أموالًا", text: "أي طلب تحويل أو مساعدة مالية من عضو آخر علامة خطر. أوقف التواصل وأبلغ الإدارة فورًا.", accent: "border-amber-200 bg-amber-50/70 text-amber-700" },
  { icon: ShieldAlert, title: "ابتزاز أو تهديد", text: "لا تستجب للضغط ولا ترسل صورًا أو بيانات إضافية. احتفظ بما يثبت الواقعة واستخدم الإبلاغ.", accent: "border-red-200 bg-red-50/70 text-red-700" },
  { icon: LockKeyhole, title: "بياناتك الخاصة", text: "لا تشارك كلمات المرور أو بيانات البطاقات أو المستندات أو عنوانك التفصيلي في بداية التعارف.", accent: "border-emerald-200 bg-emerald-50/70 text-emerald-700" },
  { icon: MapPinned, title: "أول مقابلة", text: "اختر مكانًا عامًا ووقتًا مناسبًا، وأخبر شخصًا تثق به بمكانك وموعد عودتك.", accent: "border-sky-200 bg-sky-50/70 text-sky-700" },
  { icon: PhoneOff, title: "لا تتعجل مشاركة رقمك", text: "استخدم أدوات التواصل داخل قلبي لوڤي أولًا، وخذ وقتك قبل نقل الحوار خارج المنصة.", accent: "border-violet-200 bg-violet-50/70 text-violet-700" },
  { icon: UserRoundCheck, title: "راجع الملف بهدوء", text: "التوثيق يساعد على الثقة لكنه لا يغني عن الحكم الهادئ والتأكد التدريجي من التوافق والجدية.", accent: "border-yellow-200 bg-yellow-50/70 text-yellow-800" },
];

export default function SafetyCenterPage() {
  return (
    <MemberShell title="مركز الأمان" subtitle="قواعد بسيطة وواضحة تساعدك تحافظ على خصوصيتك وراحتك في كل خطوة.">
      <div className="relative overflow-hidden rounded-[34px] border border-rose-100 bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,.12),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(244,63,94,.16),transparent_34%),linear-gradient(135deg,#fffafd,#fff)] p-6 shadow-[0_24px_70px_rgba(91,12,49,.08)] md:p-8">
        <div className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full border-[18px] border-amber-200/35" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-emerald-100/50 blur-2xl" />
        <section className="relative rounded-[28px] bg-[#35101e] p-6 text-white md:p-8">
          <div className="flex max-w-4xl items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/20"><ShieldCheck className="h-7 w-7" /></span>
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-black text-amber-100">الأمان قبل أي تعارف</span>
              <h2 className="mt-3 text-2xl font-black">قلبي لوڤي لا يطلب منك تحويل أموال لأي عضو.</h2>
              <p className="mt-2 text-sm font-semibold leading-8 text-rose-100/85">إذا طلب منك أحد مالًا، أو حاول ابتزازك، أو ضغط عليك لإرسال صور أو بيانات خاصة، أوقف التواصل واستخدم الإبلاغ فورًا. البلاغات تُراجع بسرية.</p>
            </div>
          </div>
        </section>

        <section className="relative mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map(({ icon: Icon, title, text, accent }) => (
            <article key={title} className={`rounded-[26px] border p-5 shadow-[0_12px_35px_rgba(70,15,40,.045)] ${accent}`}>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-sm"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-4 text-lg font-black text-rose-900">{title}</h3>
              <p className="mt-2 text-sm font-semibold leading-7 text-rose-600">{text}</p>
            </article>
          ))}
        </section>

        <section className="relative mt-5 grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
          <div className="rounded-[28px] border border-rose-100 bg-white p-6">
            <div className="flex items-center gap-2 text-rose-700"><HeartHandshake className="h-5 w-5" /><h3 className="font-black">التعارف الهادئ أحسن من الاستعجال</h3></div>
            <p className="mt-2 text-sm font-semibold leading-7 text-rose-600">خلي التواصل داخل المنصة في البداية، واحترم خصوصية الطرف الآخر، ولا تضغط للحصول على رقم هاتف أو صور أو معلومات شخصية.</p>
          </div>
          <div className="rounded-[28px] border border-red-100 bg-red-50 p-6">
            <div className="flex items-center gap-2 text-red-700"><Flag className="h-5 w-5" /><h3 className="font-black">تحتاج تبلغ عن عضو؟</h3></div>
            <p className="mt-2 text-sm font-semibold leading-7 text-red-700/80">افتح ملف العضو واضغط «إبلاغ». البلاغ يرتبط بالحساب مباشرة ويصل للإدارة.</p>
            <Link href="/search" className="mt-4 inline-flex rounded-xl bg-red-600 px-4 py-2.5 text-xs font-black text-white">العودة للأعضاء</Link>
          </div>
        </section>
      </div>
    </MemberShell>
  );
}
