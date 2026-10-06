import Image from "next/image";
import { BookOpenCheck, HeartHandshake, Sparkles } from "lucide-react";

export default function AssistantsSection() {
  return (
    <section className="ql-container pb-12">
      <div className="grid items-center overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#4a0927,#6a0d37)] text-white shadow-[0_26px_65px_rgba(78,10,42,.14)] lg:grid-cols-[1.05fr_.95fr]">
        <div className="p-7 md:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-black">
            <Sparkles className="h-3.5 w-3.5" /> مساعدان يفهمان رحلتك
          </span>
          <h2 className="mt-4 text-3xl font-black leading-tight md:text-4xl">آدم وحواء… موجودين علشان الطريق يبقى أسهل.</h2>
          <p className="mt-4 max-w-xl text-sm font-bold leading-7 text-white/75">
            من أول التسجيل حتى اكتمال ملفك وبداية التعارف، يشرحان لك ما ينقصك، يرشحان الخطوة التالية، ويفتحان لك محتوى معرفة مناسب للمرحلة اللي أنت فيها.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            <span className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-3 py-3 text-xs font-black"><HeartHandshake className="h-4 w-4" /> إرشاد مباشر</span>
            <span className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-3 py-3 text-xs font-black"><Sparkles className="h-4 w-4" /> تشجيع ذكي</span>
            <span className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-3 py-3 text-xs font-black"><BookOpenCheck className="h-4 w-4" /> معرفة مفيدة</span>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden bg-gradient-to-l from-rose-100/10 to-transparent">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/15 to-transparent" />
          <Image src="/baby_boy.png" alt="آدم" width={260} height={320} className="ql-float absolute bottom-2 right-[10%] h-[78%] w-auto object-contain drop-shadow-2xl" />
          <Image src="/baby_girl.png" alt="حواء" width={260} height={320} className="ql-float absolute bottom-2 left-[10%] h-[78%] w-auto object-contain drop-shadow-2xl [animation-delay:.8s]" />
        </div>
      </div>
    </section>
  );
}
