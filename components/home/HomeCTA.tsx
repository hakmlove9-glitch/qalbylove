import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";

export default function HomeCTA() {
  return (
    <section className="ql-container py-12">
      <div className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(120deg,#f13b77,#c80d4f)] px-6 py-12 text-center text-white shadow-[0_25px_65px_rgba(210,28,92,.20)] md:py-14">
        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[24px] border-white/7" />
        <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/8" />
        <Heart className="relative mx-auto h-8 w-8" fill="currentColor" />
        <h2 className="relative mt-3 text-3xl font-black md:text-5xl">يمكن أجمل حكاية تبدأ بخطوة واحدة.</h2>
        <p className="relative mx-auto mt-3 max-w-2xl text-sm font-bold leading-7 text-white/85">أنشئ ملفك كما أنت، خلّي آدم أو حواء يساعدك، وابدأ رحلة تعارف أكثر هدوءًا ووضوحًا.</p>
        <Link href="/signup" className="relative mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-3.5 font-black text-rose-600 transition hover:-translate-y-0.5">
          إنشاء حساب مجاني <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
