import Link from "next/link";
import { HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
import DirectoryShell from "@/components/member/DirectoryShell";

const cases = [
  { name: "بصحة جيدة", description: "أعضاء لم يذكروا حالة صحية مزمنة ضمن بياناتهم المتاحة." },
  { name: "السكري", description: "أعضاء اختاروا مشاركة أنهم يتعايشون مع السكري بوضوح واحترام." },
  { name: "ضغط الدم", description: "أعضاء اختاروا إظهار حالة مرتبطة بضغط الدم." },
  { name: "أمراض القلب", description: "أعضاء اختاروا مشاركة حالة صحية مرتبطة بالقلب." },
  { name: "حالة صحية أخرى", description: "حالات أخرى يقرر العضو بنفسه ما إذا كان يريد إظهارها." },
];

export default function HealthCasesPage() {
  return (
    <DirectoryShell
      title="الحالات الصحية"
      subtitle="الوضوح جزء من الاحترام. هذه الصفحة تساعد من يفضل معرفة الظروف الصحية مبكرًا بدون حكم أو تمييز."
    >
      <div className="mb-5 flex gap-3 rounded-[26px] border border-emerald-100 bg-emerald-50 p-5 text-sm font-semibold leading-7 text-emerald-950">
        <ShieldCheck className="mt-1 h-6 w-6 shrink-0" />
        <div><strong className="block font-black">خصوصيتك أولًا</strong>الحالة الصحية معلومة حساسة، وهدفها التوافق والوضوح فقط. العضو يظل صاحب القرار في مقدار المعلومات التي يشاركها.</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cases.map((item, index) => (
          <Link
            key={item.name}
            href={`/search?health=${encodeURIComponent(item.name)}`}
            className="group rounded-[26px] border border-rose-100 bg-white p-5 shadow-[0_12px_30px_rgba(70,20,40,.05)] transition hover:-translate-y-1 hover:border-rose-200"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
              {index === 0 ? <HeartPulse className="h-6 w-6" /> : <Stethoscope className="h-6 w-6" />}
            </span>
            <h2 className="mt-4 text-lg font-black">{item.name}</h2>
            <p className="mt-2 text-xs font-semibold leading-6 text-rose-500">{item.description}</p>
            <div className="mt-4 text-xs font-black text-rose-600">عرض الأعضاء ←</div>
          </Link>
        ))}
      </div>
    </DirectoryShell>
  );
}
