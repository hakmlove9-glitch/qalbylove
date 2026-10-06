import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <main dir="rtl" className="min-h-screen">
      <Header />
      <section className="ql-container py-10 md:py-14">
        <div className="overflow-hidden rounded-[36px] border border-rose-100 bg-white shadow-[0_28px_85px_rgba(79,12,40,.08)]">
          <div className="bg-gradient-to-l from-[#4d0b28] via-[#831342] to-[#c41a59] p-8 text-white md:p-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black">
              <Sparkles className="h-4 w-4" /> لماذا قلبي لوڤي؟
            </span>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-5xl">مساحة مصرية للزواج الجاد… بشكل أهدأ وأوضح وأجمل.</h1>
            <p className="mt-4 max-w-3xl text-sm font-bold leading-8 text-rose-100">نبني تجربة تحترم وقتك وخصوصيتك، وتخلي الخطوات المهمة واضحة من أول ملف شخصي حتى التواصل الجاد.</p>
          </div>
          <div className="grid gap-4 p-6 md:grid-cols-3 md:p-8">
            <Value icon={<HeartHandshake />} title="الجدية أولًا" text="المنصة مصممة للتعارف الجاد بهدف الزواج، وليست دردشة بلا هدف." />
            <Value icon={<ShieldCheck />} title="خصوصية مفهومة" text="أنت تتحكم في ظهور ملفك وصورك ومن يمكنه التواصل معك." />
            <Value icon={<Sparkles />} title="تجربة حديثة" text="واجهة بسيطة ومريحة تساعدك توصل لما يهمك بدون قوائم مربكة." />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Value({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="rounded-[26px] border border-rose-100 bg-[#fffafb] p-5"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 [&>svg]:h-5 [&>svg]:w-5">{icon}</span><h2 className="mt-4 text-lg font-black text-[#3a0c20]">{title}</h2><p className="mt-2 text-sm font-bold leading-7 text-rose-500">{text}</p></article>
}
