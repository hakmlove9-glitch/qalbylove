import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, Heart, MessageCircle, Mic2, Sparkles } from "lucide-react";

const examples = [
  { title: "ملف واضح من أول نظرة", text: "الصورة، العمر، المدينة، الهدف، والاهتمامات تظهر بشكل مرتب قبل فتح التفاصيل.", image: "/images/site-v2/couples/couple-03.webp", icon: BadgeCheck },
  { title: "توافق مفهوم مش رقم وخلاص", text: "تعرف نقاط التشابه وما يستحق السؤال عنه قبل ما تبدأ التواصل.", image: "/images/site-v2/couples/couple-04.webp", icon: Sparkles },
  { title: "تواصل حديث ومحترم", text: "اهتمام، رسالة نصية أو صوتية، وإجراءات الأمان كلها في نفس المكان.", image: "/images/site-v2/couples/couple-01.webp", icon: Mic2 },
];

export default function MemberShowcase() {
  return (
    <section className="border-y border-rose-100/70 bg-white/72 py-12 md:py-16">
      <div className="ql-container">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="ql-kicker">تجربة مصممة قبل الأرقام</span>
            <h2 className="mt-3 ql-section-title">كل شيء مهم يظهر قدامك في وقته.</h2>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-rose-500">بدل عرض أعضاء وهميين في بداية المنصة، دي أمثلة صريحة على شكل التجربة اللي هتستخدمها مع الأعضاء الحقيقيين.</p>
          </div>
          <Link href="/signup" className="ql-btn-secondary">ابدأ ملفك <ArrowLeft className="h-4 w-4" /></Link>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {examples.map(({ title, text, image, icon: Icon }, index) => (
            <article key={title} className="group overflow-hidden rounded-[30px] border border-rose-100 bg-white shadow-[0_18px_48px_rgba(84,17,47,.07)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_25px_60px_rgba(84,17,47,.12)]">
              <div className="relative h-[255px] overflow-hidden bg-[linear-gradient(145deg,#fff4f7,#fff8f1)]">
                <Image src={image} alt="نموذج توضيحي لتجربة قلبي لوڤي" fill className="object-contain object-bottom p-3 transition duration-500 group-hover:scale-[1.025]" sizes="(max-width: 1024px) 100vw, 33vw" />
                <div className="absolute right-4 top-4 rounded-full border border-white/90 bg-white/90 px-3 py-1.5 text-[10px] font-black text-rose-600 shadow-sm backdrop-blur">نموذج توضيحي</div>
                <span className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-2xl bg-[#3a1022]/90 text-white shadow-lg"><Icon className="h-5 w-5" /></span>
              </div>
              <div className="p-5">
                <div className="text-xs font-black text-rose-500">0{index + 1}</div>
                <h3 className="mt-2 text-xl font-black text-[#32101e]">{title}</h3>
                <p className="mt-2 text-sm font-bold leading-7 text-rose-500">{text}</p>
                <div className="mt-5 flex gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-[10px] font-black text-rose-600"><Heart className="h-3.5 w-3.5" /> اهتمام</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-[10px] font-black text-violet-600"><MessageCircle className="h-3.5 w-3.5" /> رسالة</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
