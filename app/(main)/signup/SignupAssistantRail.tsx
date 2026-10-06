"use client";

import Image from "next/image";
import { Lightbulb, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SignupSnapshot = {
  gender?: "" | "male" | "female"; displayName?: string; age?: string; residence?: string;
  city?: string; cityOther?: string; country?: string; maritalStatus?: string; previousMarriage?: string;
  hasChildren?: string; childrenCount?: string; housing?: string; marriageTimeline?: string;
  education?: string; job?: string; jobOther?: string; workStatus?: string; height?: string;
  weight?: string; bodyType?: string; smoking?: string; prayer?: string; religiosity?: string;
  healthStatus?: string; personalityTraits?: string[]; interests?: string[]; partnerSpecs?: string;
  bio?: string; hasProfilePhoto?: boolean;
};

const STEP_TIPS = [
  "أهلاً بيك! يلا نكمل ملفك خطوة بخطوة.",
  "اختار النوع المناسب ليك، وأنا هكمل معاك.",
  "يلا نجهز بيانات حسابك، وخد وقتك براحتك.",
  "حدد مكانك وعمرك، وأنا أساعدك خطوة بخطوة.",
  "برافو عليك، فاضل شوية ونكمل ملفك.",
  "اختار اللي يناسبك في الأسرة والسكن، وإحنا قربنا نخلص.",
  "اختار مواصفاتك براحتك، كل خطوة بتقربنا من ملفك الكامل.",
  "احكي عن نفسك وعن شريك الحياة اللي بتتمناه.",
  "راجع بياناتك، وبعدها تبقى جاهز تبدأ رحلتك."
];

export default function SignupAssistantRail({ step, form, onUseBio }: { step: number; form: SignupSnapshot; onUseBio?: (bio: string) => void }) {
  const memberIsFemale = form.gender === "female";
  const hasGender = Boolean(form.gender);
  // المساعد من الجنس المقابل: حواء للرجل وآدم للمرأة.
  const name = hasGender ? (memberIsFemale ? "آدم" : "حواء") : "مساعدك الشخصي";
  const assistantTitle = hasGender ? `${name} معك` : name;
  const femaleAssistants = Array.from({ length: 16 }, (_, i) => `/images/site-v2/assistants/female/${String(i + 1).padStart(2, "0")}.webp`);
  const maleAssistants = Array.from({ length: 16 }, (_, i) => `/images/site-v2/assistants/male/${String(i + 1).padStart(2, "0")}.webp`);
  const image = hasGender
    ? (memberIsFemale ? maleAssistants[step % maleAssistants.length] : femaleAssistants[step % femaleAssistants.length])
    : "/images/site-v2/couples/couple-02.webp";
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState(STEP_TIPS[0]);
  const [loading, setLoading] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => { setReply(STEP_TIPS[step] || STEP_TIPS[0]); }, [step, form.gender]);

  const profileSummary = useMemo(() => {
    const place = form.residence === "abroad" ? form.country : (form.city === "__other__" ? form.cityOther : form.city);
    const job = form.job === "أخرى" ? form.jobOther : (form.job || form.workStatus);
    return [form.age && `${form.age} سنة`, place, form.education, job, form.personalityTraits?.slice(0, 2).join("، ")].filter(Boolean).join(" • ");
  }, [form]);

  async function ask() {
    const q = message.trim(); if (!q) return; setLoading(true);
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: q, context: "signup", gender: form.gender, step, profile: form }) });
      const data = await response.json(); setReply(data.reply || "أنا معاك، اسألني عن أي حاجة في الخطوة دي."); setMessage("");
    } catch { setReply("مش قادر أرد دلوقتي، كمل وأنا هفضل معاك خطوة بخطوة."); }
    finally { setLoading(false); }
  }

  async function generateBios() {
    setBioLoading(true); setSuggestions([]);
    try {
      const response = await fetch("/api/assistant/bio-suggestions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profile: form }) });
      const data = await response.json();
      if (response.ok && Array.isArray(data.suggestions)) { setSuggestions(data.suggestions); setReply("جهزتلك 3 نبذات، اختار الأقرب ليك وعدّلها براحتك."); }
      else setReply(data.error || "مقدرتش أجهز الاقتراحات دلوقتي، جرّب كمان شوية.");
    } catch { setReply("مقدرتش أجهز الاقتراحات دلوقتي، جرّب كمان شوية."); }
    finally { setBioLoading(false); }
  }

  return <aside className="lg:sticky lg:top-[74px]">
    <div className="overflow-hidden rounded-[20px] border border-rose-100 bg-white shadow-[0_16px_45px_rgba(90,17,53,.08)]">
      <div className="relative min-h-[142px] overflow-hidden bg-gradient-to-br from-[#4A1942] via-[#6f275d] to-[#ba3d73] p-3 text-white">
        <div className="absolute inset-y-0 left-0 w-[48%] overflow-hidden">
          <Image src={image} alt={name} fill className="object-cover object-top" sizes="160px" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#6f275d]/80" />
        </div>
        <div className="relative z-10 mr-auto max-w-[55%]"><span className="text-[9px] font-black text-rose-100">مساعدك الشخصي</span><h3 className="mt-1 text-[17px] font-black">{assistantTitle}</h3><p className="mt-1 text-[10px] font-bold leading-5 text-white/80">{hasGender ? "يلا نكمل ملفك خطوة بخطوة." : "اختار نوعك عشان يظهرلك مساعدك المناسب."}</p></div>
      </div>
      <div className="p-3">
        <div className="rounded-[14px] border border-rose-100 bg-rose-50/60 p-2.5"><div className="flex items-center gap-1.5 text-[10px] font-black text-rose-700"><Lightbulb className="h-3.5 w-3.5" />إرشاد الخطوة {step + 1}</div><p className="mt-1 text-[10px] font-bold leading-5 text-rose-600">{reply}</p></div>
        {profileSummary && <div className="mt-2 rounded-xl bg-rose-50 px-2.5 py-2 text-[9px] font-bold leading-4 text-rose-500">{profileSummary}</div>}
        {step === 7 && <button type="button" onClick={generateBios} disabled={bioLoading} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-2 py-2 text-[10px] font-black text-white disabled:opacity-50"><Sparkles className="h-3.5 w-3.5" />{bioLoading ? "جارٍ إعداد الاقتراحات..." : "اقتراح نبذات شخصية"}</button>}
        {suggestions.length > 0 && <div className="mt-2 max-h-[180px] space-y-1.5 overflow-y-auto">{suggestions.map((bio, index) => <button key={`${index}-${bio.slice(0, 20)}`} type="button" onClick={() => onUseBio?.(bio)} className="block w-full rounded-xl border border-amber-100 bg-white p-2 text-right text-[9px] font-bold leading-5 text-rose-600 hover:bg-rose-50">{bio}</button>)}</div>}
        <button type="button" onClick={() => setHelpOpen(v => !v)} className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white text-[10px] font-black text-rose-700 transition hover:bg-rose-50"><Send className="h-3.5 w-3.5" />{helpOpen ? "إخفاء المساعدة" : `اسأل ${name}`}</button>{helpOpen && <div className="mt-2 flex gap-1.5"><input dir="auto" value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); ask(); } }} placeholder="اكتب سؤالك بأي لغة" className="h-9 min-w-0 flex-1 rounded-xl border border-rose-200 px-2.5 text-[10px] outline-none focus:border-rose-300" /><button type="button" onClick={ask} disabled={loading} className="grid h-9 w-9 place-items-center rounded-xl bg-rose-600 text-white disabled:opacity-50" aria-label="إرسال"><Send className="h-3.5 w-3.5" /></button></div>}
      </div>
    </div>
  </aside>
}
