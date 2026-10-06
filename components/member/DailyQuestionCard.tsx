"use client";

import { Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type DailyQuestion = {
  id: string;
  prompt: string;
  answer?: string | null;
};

export default function DailyQuestionCard() {
  const [question, setQuestion] = useState<DailyQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/daily-question", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.question) {
          setQuestion(data.question);
          setAnswer(data.question.answer || "");
        }
      })
      .catch(() => undefined);
  }, []);

  async function save() {
    if (!question || answer.trim().length < 2) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/daily-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_id: question.id, answer: answer.trim() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "تعذر حفظ إجابتك");
      setMessage("اتحفظت إجابتك. كل إجابة تساعد قلبي لوڤي يفهمك أكتر.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر حفظ إجابتك");
    } finally {
      setSaving(false);
    }
  }

  if (!question) return null;

  return (
    <section className="overflow-hidden rounded-[30px] border border-rose-100 bg-white shadow-[0_16px_45px_rgba(80,18,45,.06)]" dir="rtl">
      <div className="bg-gradient-to-l from-[#6f103d] to-[#b51e62] px-5 py-4 text-white">
        <div className="flex items-center gap-2 text-xs font-black text-rose-100">
          <Sparkles className="h-4 w-4" /> سؤال اليوم
        </div>
        <h3 className="mt-2 text-lg font-black leading-8">{question.prompt}</h3>
      </div>
      <div className="p-5">
        <textarea
          value={answer}
          onChange={(event) => setAnswer(event.target.value.slice(0, 280))}
          placeholder="اكتب إجابة صادقة وبسيطة..."
          className="min-h-24 w-full resize-none rounded-2xl border border-rose-100 bg-rose-50/40 p-4 text-sm font-bold leading-7 text-rose-700 outline-none transition focus:border-rose-300 focus:bg-white"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold text-rose-400">{answer.length}/280</span>
          <button onClick={save} disabled={saving || answer.trim().length < 2} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-black text-white disabled:opacity-50">
            <Send className="h-3.5 w-3.5" /> {saving ? "جاري الحفظ..." : "حفظ الإجابة"}
          </button>
        </div>
        {message && <p className="mt-3 text-xs font-black text-rose-600">{message}</p>}
      </div>
    </section>
  );
}
