import Link from "next/link";
import { ArrowLeft, HeartHandshake, MessageCircleHeart, ShieldCheck, Sparkles } from "lucide-react";

const cards = [
  { icon: MessageCircleHeart, title: "أول تعارف من غير توتر", text: "ابدأ الكلام باحترام، اسأل الأسئلة الصح، وسيب مساحة للطرف الآخر يعبر عن نفسه." },
  { icon: HeartHandshake, title: "إزاي تختار شريك حياتك؟", text: "فرق بين الإعجاب والتوافق الحقيقي، وافهم القيم ونمط الحياة قبل القرارات الكبيرة." },
  { icon: ShieldCheck, title: "أمانك قبل أي شيء", text: "لا تحول أموالًا لأي عضو. لو حد طلب فلوس أو ضغط عليك أو ابتزك، أوقف التواصل وبلّغ الإدارة فورًا." },
];

export default function KnowledgeSection() {
  return (
    <section className="border-y border-rose-100 bg-gradient-to-b from-white to-[#fff7fa] py-14">
      <div className="ql-container">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="ql-kicker"><Sparkles className="h-3.5 w-3.5" /> قلبك وعقلك مع بعض</span>
            <h2 className="mt-3 ql-section-title">مركز معرفة يساعدك قبل وأثناء التعارف</h2>
            <p className="mt-2 max-w-2xl text-sm font-bold leading-7 text-rose-500">محتوى قصير وعملي عن أول تعارف، الاختيار، الخطوبة، الأمان، وحدود التواصل.</p>
          </div>
          <Link href="/guidelines" className="ql-btn-secondary">استكشف النصائح <ArrowLeft className="h-4 w-4" /></Link>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, text }) => (
            <article key={title} className="ql-card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-5 text-lg font-black">{title}</h3>
              <p className="mt-3 text-sm font-bold leading-7 text-rose-500">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
