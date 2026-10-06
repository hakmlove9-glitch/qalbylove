import { BadgeCheck, MessageCircle, Search } from "lucide-react";

const steps = [
  { n: "1", icon: BadgeCheck, title: "أنشئ ملفًا واضحًا", text: "عرّف بنفسك واهتماماتك وما تبحث عنه، وكل خانة تعرفك لماذا نطلبها." },
  { n: "2", icon: Search, title: "اكتشف من يناسبك", text: "نتائج مرتبة، فلاتر مفيدة، وأسباب توافق تساعدك قبل أي خطوة." },
  { n: "3", icon: MessageCircle, title: "ابدأ تعارفًا محترمًا", text: "رسائل نصية وصوتية مع أدوات اهتمام وتجاهل وحظر وإبلاغ أمامك." },
];

export default function JourneySection() {
  return (
    <section className="ql-container py-14">
      <div className="text-center">
        <span className="ql-kicker">رحلة واضحة من البداية</span>
        <h2 className="mt-3 ql-section-title">ثلاث خطوات تقرّبك من بداية حقيقية</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm font-bold leading-7 text-rose-500">
          لا استمارات مربكة ولا قوائم مخفية. كل خطوة قصيرة ومفهومة، ومساعدك موجود وقت ما تحتاجه.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map(({ n, icon: Icon, title, text }) => (
          <div key={n} className="ql-card group relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1.5">
            <div className="absolute -left-7 -top-7 h-24 w-24 rounded-full bg-rose-50 transition duration-500 group-hover:scale-125" />
            <div className="relative flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-600 font-black text-white shadow-lg shadow-rose-100">{n}</span>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600"><Icon className="h-5 w-5" /></span>
            </div>
            <h3 className="relative mt-5 text-xl font-black">{title}</h3>
            <p className="relative mt-3 text-sm font-bold leading-7 text-rose-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
