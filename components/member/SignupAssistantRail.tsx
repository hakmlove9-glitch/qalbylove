"use client";

import Image from "next/image";
import { Lightbulb, Send, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type SignupSnapshot = {
  gender?: "" | "male" | "female";
  displayName?: string;
  age?: string;
  residence?: string;
  city?: string;
  country?: string;
  maritalStatus?: string;
  previousMarriage?: string;
  hasChildren?: string;
  childrenCount?: string;
  housing?: string;
  marriageTimeline?: string;
  education?: string;
  job?: string;
  jobOther?: string;
  workStatus?: string;
  height?: string;
  weight?: string;
  bodyType?: string;
  smoking?: string;
  prayer?: string;
  religiosity?: string;
  healthStatus?: string;
  personalityTraits?: string[];
  interests?: string[];
  partnerSpecs?: string;
  bio?: string;
  hasProfilePhoto?: boolean;
};

const STEP_TIPS = [
  "أهلًا بك في قلبي لوڤي. ابدأ بالميثاق واختَر صفتك، وبعدها سأرافقك في كل خطوة.",
  "اختَر اسمًا محترمًا يظهر للأعضاء ويعبّر عنك. الاسم لازم يكون فريدًا، وماينفعش يكون رقم هاتف.",
  "العمر ومكان الإقامة بيساعدونا نقرّب لك نتائج مناسبة من مصر أو أبناء مصر بالخارج.",
  "بيانات الأسرة والسكن والجاهزية للزواج مهمة جدًا؛ جاوب بوضوح عشان الطرف الآخر يفهم ظروفك من البداية.",
  "المؤهل والعمل جزء أساسي من صورتك. اختَر أدق اختيار، ولو وظيفتك مش موجودة استخدم «أخرى».",
  "الصحة والالتزام بيانات شخصية مهمة، والوضوح هنا يساعد على تعارف أكثر احترامًا.",
  "هنا هنبني شخصيتك داخل المنصة. بعد مراجعة بياناتك أقدر أقترح لك نبذات شخصية مناسبة ليك وحدك.",
  "دي البيانات السرية للإدارة والاسترجاع فقط: اسمك الحقيقي ورقم هاتفك. مش هيظهروا للأعضاء.",
];

export default function SignupAssistantRail({
  step,
  form,
  onUseBio,
}: {
  step: number;
  form: SignupSnapshot;
  onUseBio?: (bio: string) => void;
}) {
  const female = form.gender === "female";
  const hasGender = Boolean(form.gender);
  const name = hasGender ? (female ? "حواء" : "آدم") : "آدم وحواء";
  const image = female ? "/images/site-v2/assistants/female/01.webp" : "/images/site-v2/assistants/male/01.webp";

  const [message, setMessage] = useState("");
  const [reply, setReply] = useState(STEP_TIPS[0]);
  const [loading, setLoading] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setReply(STEP_TIPS[step] || STEP_TIPS[0]);
  }, [step, form.gender]);

  const profileSummary = useMemo(() => {
    const place = form.residence === "abroad" ? form.country : form.city;
    const job = form.job === "أخرى" ? form.jobOther : form.job;
    return [
      form.age && `${form.age} سنة`,
      place,
      form.education,
      job,
      form.personalityTraits?.slice(0, 2).join("، "),
    ].filter(Boolean).join(" • ");
  }, [form]);

  async function ask() {
    const q = message.trim();
    if (!q) return;
    setLoading(true);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          context: "signup",
          gender: form.gender,
          step,
          profile: form,
        }),
      });
      const data = await response.json();
      setReply(data.reply || "أنا معك. اسألني عن أي خانة في الخطوة الحالية.");
      setMessage("");
    } catch {
      setReply("تعذر الرد الآن، لكن تقدر تكمل وأنا هفضل معك في كل خطوة.");
    } finally {
      setLoading(false);
    }
  }

  async function generateBios() {
    setBioLoading(true);
    setSuggestions([]);
    try {
      const response = await fetch("/api/assistant/bio-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: form }),
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        setReply("راجعت بياناتك واقترحت لك 3 نبذات مختلفة. اختَر الأقرب لشخصيتك وعدّل عليها براحتك.");
      } else {
        setReply(data.error || "تعذر إنشاء اقتراحات الآن.");
      }
    } catch {
      setReply("تعذر إنشاء الاقتراحات الآن. جرّب مرة أخرى بعد قليل.");
    } finally {
      setBioLoading(false);
    }
  }

  return (
    <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
      <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-rose-100 bg-white shadow-[0_25px_70px_rgba(90,17,53,.12)]">
        <div className="relative min-h-[190px] overflow-hidden bg-gradient-to-br from-[#4d0b2a] via-[#76113f] to-[#bc2868] p-5 text-white">
          <div className="relative z-10 max-w-[65%]">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black text-rose-100">
              <Sparkles className="h-3 w-3" />
              مساعد التسجيل
            </span>
            <h3 className="mt-3 text-xl font-black">{name} معك</h3>
            <p className="mt-2 text-[11px] font-bold leading-6 text-white/75">
              {hasGender
                ? `مرحبًا${form.displayName ? ` يا ${form.displayName}` : ""}. أنا معك خطوة بخطوة.`
                : "أهلًا بك. اختَر رجل أو امرأة عشان يظهر لك المساعد المناسب."}
            </p>
          </div>
          <Image
            src={image}
            alt={name}
            width={180}
            height={220}
            className="absolute -bottom-5 left-2 h-[180px] w-auto object-contain drop-shadow-2xl"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-4">
          {profileSummary && (
            <div className="mb-3 rounded-2xl bg-rose-50 p-3 text-[10px] font-black leading-5 text-rose-500">
              {profileSummary}
            </div>
          )}

          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3">
            <div className="flex items-center gap-2 text-xs font-black text-rose-700">
              <Lightbulb className="h-4 w-4" />
              إرشاد الخطوة {step + 1}
            </div>
            <p className="mt-2 text-[11px] font-bold leading-6 text-rose-600">{reply}</p>
          </div>

          {step === 6 && (
            <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 p-3">
              <button
                type="button"
                onClick={generateBios}
                disabled={bioLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-3 py-2.5 text-[11px] font-black text-white disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                {bioLoading ? "براجع بياناتك..." : "اقترح لي 3 نبذات شخصية"}
              </button>

              {suggestions.length > 0 && (
                <div className="mt-3 max-h-[260px] space-y-2 overflow-y-auto pr-1">
                  {suggestions.map((bio, index) => (
                    <button
                      key={`${index}-${bio.slice(0, 20)}`}
                      type="button"
                      onClick={() => onUseBio?.(bio)}
                      className="block w-full rounded-xl border border-amber-100 bg-white p-3 text-right text-[10px] font-bold leading-6 text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"
                    >
                      <span className="mb-1 block text-[10px] font-black text-rose-600">
                        اقتراح {index + 1}
                      </span>
                      {bio}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-auto pt-4">
            <div className="mb-2 text-[10px] font-black text-rose-500">
              اسأل {name} عن أي خانة أو معنى أي اختيار
            </div>
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    ask();
                  }
                }}
                className="h-11 min-w-0 flex-1 rounded-xl border border-rose-200 px-3 text-xs outline-none focus:border-rose-300"
                placeholder="اكتب سؤالك هنا"
              />
              <button
                type="button"
                onClick={ask}
                disabled={loading}
                className="grid h-11 w-11 place-items-center rounded-xl bg-rose-600 text-white disabled:opacity-50"
                aria-label="إرسال"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
