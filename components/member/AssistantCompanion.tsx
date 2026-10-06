"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  HeartHandshake,
  MessageCircle,
  Pause,
  Play,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function pageTip(pathname: string, completion: number) {
  if (completion < 100) return "ملفك لسه ناقص شوية تفاصيل. أقدر أقول لك بالضبط إيه اللي يستحق تكمله الأول.";
  if (pathname.startsWith("/messages")) return "لو محتار تبدأ الرسالة إزاي، اكتب لي نبذة عن الشخص اللي قدامك وأنا أساعدك بصياغة محترمة.";
  if (pathname.startsWith("/search")) return "استخدم البحث عشان القيم والظروف المهمة ليك، مش الصورة بس. اسألني لو محتار في أي فلتر.";
  if (pathname.startsWith("/member/")) return "اقرأ الملف كامل قبل ما تبعت اهتمام. لو في نقطة مش واضحة، أقدر أساعدك تفكر فيها.";
  if (pathname.includes("subscription")) return "التميّز اختياري. أقدر أشرح لك الفرق بين الفضي والذهبي والماسي والملكي من غير ضغط.";
  if (pathname.includes("safety")) return "لو حد طلب فلوس أو حاول يضغط عليك أو ينقلك خارج المنصة بسرعة، وقّف التواصل وبلّغ الإدارة.";
  return "أنا موجود معك في كل خطوة: الملف، البحث، الرسائل، التعارف، الخطوبة والأمان.";
}

export default function AssistantCompanion() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [completion, setCompletion] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPaused(localStorage.getItem("qalbylove_assistant_paused") === "1");
    Promise.all([
      fetch("/api/profile", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/profile/completion", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([profileData, completionData]) => {
        if (profileData?.profile) setProfile(profileData.profile);
        if (completionData?.percentage != null) setCompletion(Number(completionData.percentage));
      })
      .catch(() => undefined);
  }, [pathname]);

  if (!profile) return null;

  const female = profile.gender === "female" || profile.gender === "أنثى";
  const name = female ? "حواء" : "آدم";
  const mascot = female ? "/images/site-v2/assistants/female/01.webp" : "/images/site-v2/assistants/male/01.webp";

  function togglePause() {
    const next = !paused;
    setPaused(next);
    localStorage.setItem("qalbylove_assistant_paused", next ? "1" : "0");
  }

  async function ask(text?: string) {
    const q = (text ?? message).trim();
    if (!q) return;
    setLoading(true);
    setReply("");
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId: profile.id,
          message: q,
          context: "platform",
          pathname,
          gender: profile.gender,
          completion,
          profile,
        }),
      });
      const data = await response.json();
      setReply(data.reply || "أنا معك. وضّح لي النقطة اللي محتاج مساعدة فيها.");
      setMessage("");
    } catch {
      setReply("تعذر الرد دلوقتي. جرّب تاني بعد لحظات.");
    } finally {
      setLoading(false);
    }
  }

  if (paused) {
    return (
      <button
        onClick={togglePause}
        className="fixed bottom-4 left-4 z-[80] flex items-center gap-2 rounded-2xl border border-rose-100 bg-white px-3 py-2 text-[11px] font-black text-rose-600 shadow-xl"
        dir="rtl"
      >
        <Play className="h-3.5 w-3.5 text-rose-500" />
        إعادة {name}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-[80]" dir="rtl">
      {open ? (
        <div className="w-[370px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[30px] border border-rose-100 bg-white shadow-[0_28px_85px_rgba(65,9,34,.23)]">
          <div className="relative min-h-[120px] overflow-hidden bg-gradient-to-l from-[#4f0a2b] via-[#7e1445] to-[#bb2867] p-4 text-white">
            <Image src={mascot} alt={name} width={105} height={130} className="absolute -bottom-7 right-2 h-[120px] w-auto object-contain drop-shadow-2xl" />
            <div className="relative z-10 pr-24">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black text-rose-100"><Sparkles className="h-3 w-3" />مساعدك داخل المنصة</span>
              <h3 className="mt-2 text-lg font-black">{name} معك</h3>
              <p className="mt-1 text-[10px] font-bold leading-5 text-white/75">اسألني عن الصفحة اللي واقف فيها أو عن خطوتك التالية.</p>
            </div>
            <button onClick={() => setOpen(false)} className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-xl bg-white/10"><X className="h-4 w-4" /></button>
          </div>

          <div className="p-4">
            <div className="rounded-2xl bg-rose-50 p-3 text-[11px] font-bold leading-6 text-rose-600">
              {reply || pageTip(pathname, completion)}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Quick label="قوّي ملفي" icon={<UserRound />} onClick={() => ask("إيه أهم حاجة ناقصة في ملفي دلوقتي؟")} />
              <Quick label="ساعدني في البحث" icon={<Search />} onClick={() => ask("ساعدني أستخدم البحث بطريقة أفضل")} />
              <Quick label="أول رسالة" icon={<MessageCircle />} onClick={() => ask("اقترح لي طريقة محترمة أبدأ بها أول رسالة")} />
              <Quick label="شريك الحياة" icon={<HeartHandshake />} onClick={() => ask("ساعدني أفكر في مواصفات شريك الحياة المناسب")} />
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void ask();
                  }
                }}
                className="h-11 min-w-0 flex-1 rounded-xl border border-rose-200 px-3 text-xs outline-none focus:border-rose-300"
                placeholder={`اكتب سؤالك لـ ${name}`}
              />
              <button onClick={() => void ask()} disabled={loading} className="grid h-11 w-11 place-items-center rounded-xl bg-rose-600 text-white disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/knowledge" className="flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2.5 text-[10px] font-black text-rose-700"><BookOpen className="h-3.5 w-3.5" />مركز المعرفة</Link>
              <Link href="/safety-center" className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-[10px] font-black text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" />مركز الأمان</Link>
            </div>

            <button onClick={togglePause} className="mt-3 flex w-full items-center justify-center gap-1.5 border-t border-rose-100 pt-3 text-[10px] font-black text-rose-400 hover:text-rose-600">
              <Pause className="h-3.5 w-3.5" />إيقاف المساعد مؤقتًا
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="group flex items-center gap-3 rounded-[22px] border border-rose-100 bg-white p-2.5 pl-4 shadow-[0_16px_45px_rgba(65,9,34,.16)] transition hover:-translate-y-1">
          <span className="relative h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50">
            <Image src={mascot} alt={name} fill className="object-contain p-0.5" sizes="56px" />
          </span>
          <span className="text-right">
            <b className="block text-xs font-black text-[#4b0d2b]">{name} معك</b>
            <span className="mt-0.5 block text-[9px] font-bold text-rose-500">اسألني في أي وقت</span>
          </span>
          <MessageCircle className="mr-1 h-4 w-4 text-rose-500" />
        </button>
      )}
    </div>
  );
}

function Quick({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white px-2.5 py-1.5 text-[9px] font-black text-rose-700 hover:bg-rose-50">
      <span className="[&>svg]:h-3 [&>svg]:w-3">{icon}</span>{label}
    </button>
  );
}
