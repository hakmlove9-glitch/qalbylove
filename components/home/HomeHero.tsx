import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  Heart,
  LockKeyhole,
  Mic2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const benefits = [
  { icon: ShieldCheck, title: "خصوصية أوضح", text: "أنت المتحكم في ظهورك وتواصلك" },
  { icon: Mic2, title: "صوت أقرب", text: "رسائل وتعريفات صوتية داخل التجربة" },
  { icon: Sparkles, title: "مساعدة حقيقية", text: "آدم وحواء معك وقت ما تحتاج" },
];

export default function HomeHero() {
  return (
    <section className="ql-container pt-5 md:pt-8">
      <div className="hero-premium relative isolate overflow-hidden rounded-[40px] border border-rose-100/80 shadow-[0_40px_120px_rgba(97,21,54,.16)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,.85),transparent_25rem),radial-gradient(circle_at_12%_80%,rgba(255,190,211,.40),transparent_26rem)]" />
        <div className="relative grid min-h-[650px] items-stretch lg:grid-cols-[1.02fr_.98fr]">
          <div className="relative order-2 flex items-center p-6 sm:p-8 md:p-10 lg:order-1 lg:p-12 xl:p-14">
            <div className="relative z-10 max-w-[650px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/78 px-4 py-2 text-xs font-black text-[#a9114b] shadow-sm backdrop-blur-xl">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                  <Heart className="h-3.5 w-3.5" fill="currentColor" />
                </span>
                منصة مصرية للزواج الجاد والتعارف باحترام
              </div>

              <h1 className="mt-6 text-[42px] font-black leading-[1.03] tracking-normal text-[#2c1020] sm:text-6xl lg:text-[68px] xl:text-[76px]">
                ابدأ حكاية
                <span className="ql-gradient-text block">تستحق تكملها.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-[15px] font-bold leading-8 text-rose-600 md:text-[17px]">
                قلبي لوڤي مش مجرد تسجيل وملف شخصي. دي رحلة واضحة من أول خطوة، تساعدك تتعرف بهدوء، تفهم التوافق، وتحافظ على خصوصيتك من غير تعقيد.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/signup" className="ql-btn-primary min-w-[205px] py-3.5 text-[15px]">
                  <Sparkles className="h-4 w-4" /> إنشاء حساب مجاني
                </Link>
                <Link href="/search" className="ql-btn-secondary min-w-[175px] bg-white/80 py-3.5">
                  اكتشف التجربة <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2.5 text-xs font-black text-[#664153]">
                <span className="flex items-center gap-2"><LockKeyhole className="h-4 w-4 text-rose-500" /> خصوصيتك بإيدك</span>
                <span className="flex items-center gap-2"><Crown className="h-4 w-4 text-amber-500" /> أول 1000 عضو مؤسس</span>
                <span className="flex items-center gap-2"><Mic2 className="h-4 w-4 text-violet-500" /> رسائل صوتية</span>
              </div>
            </div>
          </div>

          <div className="relative order-1 min-h-[410px] overflow-hidden lg:order-2 lg:min-h-[650px]">
            <div className="absolute inset-6 rounded-[34px] bg-[linear-gradient(145deg,#ffe6ef_0%,#fff8f3_46%,#f7e4ff_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,.8)] lg:inset-8" />
            <div className="absolute left-[8%] top-[11%] h-28 w-28 rounded-full bg-rose-300/45 blur-2xl" />
            <div className="absolute bottom-[9%] right-[10%] h-36 w-36 rounded-full bg-amber-200/45 blur-2xl" />

            <Image
              src="/images/site-v2/couples/couple-01.webp"
              alt="زوجان سعيدان يبدآن رحلة جديدة مع قلبي لوڤي"
              fill
              priority
              className="z-[2] object-contain object-bottom px-5 pt-12 lg:px-8 lg:pt-16"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <div className="absolute right-[7%] top-[12%] z-10 rounded-2xl border border-white/80 bg-white/86 px-4 py-3 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-black text-[#7c2348]"><ShieldCheck className="h-4 w-4 text-emerald-500" /> تعارف باحترام</div>
            </div>
            <div className="absolute bottom-[9%] left-[6%] z-10 rounded-[22px] border border-white/80 bg-white/88 px-4 py-3 shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-2 text-xs font-black text-[#7c2348]"><Crown className="h-4 w-4 text-amber-500" /> فرصة العضو المؤسس</div>
              <div className="mt-1 text-[10px] font-bold text-rose-500">لأول 1000 عضو فقط</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid border-t border-rose-100/80 bg-white/82 p-3 backdrop-blur-xl sm:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3 rounded-[24px] px-4 py-4 transition hover:bg-rose-50/60">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-rose-50 to-pink-100 text-rose-600 ring-1 ring-rose-100">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-black text-[#36121f]">{title}</div>
                <div className="mt-1 text-[11px] font-bold text-rose-500">{text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
