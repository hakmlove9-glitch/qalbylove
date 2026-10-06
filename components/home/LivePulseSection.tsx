import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Eye,
  Heart,
  MessageCircle,
  Sparkles,
} from "lucide-react";

const updates = [
  { icon: Heart, title: "سارة أبدت اهتمامًا بملفك", meta: "منذ دقائق", tone: "rose" },
  { icon: Eye, title: "زيارة جديدة لملفك", meta: "منذ 20 دقيقة", tone: "sky" },
  { icon: MessageCircle, title: "رسالة صوتية جديدة", meta: "منذ ساعة", tone: "emerald" },
  { icon: Sparkles, title: "توافق جديد بنسبة 94%", meta: "اليوم", tone: "amber" },
];

const toneClass: Record<string, string> = {
  rose: "bg-rose-50 text-rose-600",
  sky: "bg-sky-50 text-sky-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

export default function LivePulseSection() {
  return (
    <section className="ql-container py-12 md:py-16">
      <div className="grid overflow-hidden rounded-[34px] border border-rose-100 bg-white shadow-[0_24px_70px_rgba(78,18,43,.08)] lg:grid-cols-2">
        <div className="p-6 md:p-8 lg:p-9">
          <span className="ql-kicker">
            <Bell className="h-3.5 w-3.5" /> المنصة تتحرك معك
          </span>
          <h2 className="mt-4 ql-section-title">كل يوم فيه حاجة جديدة تخصك.</h2>
          <p className="mt-3 max-w-xl text-sm font-bold leading-7 text-rose-500">
            اهتمام، زيارة، رسالة، أو توافق أقوى. بدل ما تدوّر، قلبي لوڤي يجمع لك كل ما يستحق الانتباه في مكان واحد.
          </p>

          <div className="mt-6 space-y-3">
            {updates.map(({ icon: Icon, title, meta, tone }) => (
              <div
                key={title}
                className="group flex items-center gap-3 rounded-2xl border border-rose-100 bg-[#fffdfd] p-3.5 transition hover:-translate-y-0.5 hover:border-rose-100 hover:shadow-md"
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneClass[tone]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-black text-rose-800">{title}</div>
                  <div className="mt-1 text-[11px] font-bold text-rose-400">{meta}</div>
                </div>
                <span className="ql-live-dot h-2.5 w-2.5 rounded-full bg-rose-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_85%_15%,rgba(255,137,178,.20),transparent_16rem),linear-gradient(135deg,#5b0c30,#350817)] p-7 text-white md:p-9 lg:p-10">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border-[40px] border-white/5" />
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-black">
            ملفك يتحول لحياة
          </span>
          <h3 className="mt-5 text-3xl font-black leading-tight md:text-4xl">بدل صفحة جامدة… عندك لوحة حياة.</h3>
          <p className="mt-4 max-w-xl text-sm font-bold leading-7 text-white/78">
            اكتمال ملفك، زياراتك، اهتماماتك، رسائلك، توافقاتك، والاقتراحات اليومية — كلها قدامك بوضوح، وآدم أو حواء يقول لك الخطوة التالية.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-3">
            {[
              ["82%", "اكتمال الملف"],
              ["14", "اهتمام جديد"],
              ["6", "محادثات نشطة"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/8 px-3 py-4 text-center backdrop-blur">
                <div className="text-2xl font-black">{value}</div>
                <div className="mt-1 text-[10px] font-black text-white/60">{label}</div>
              </div>
            ))}
          </div>

          <Link href="/dashboard" className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-rose-700 transition hover:-translate-y-0.5">
            شاهد تجربة العضو
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
