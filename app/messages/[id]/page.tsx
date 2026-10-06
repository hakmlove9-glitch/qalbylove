"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Send, ShieldCheck, Sparkles } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MemberShell from "@/components/member/MemberShell";
import VoiceRecorder from "@/components/common/VoiceRecorder";
import SpeechToTextButton from "@/components/chat/SpeechToTextButton";
import { fallbackAvatar } from "@/lib/avatar-fallback";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string | null;
  type?: string;
  voice_url?: string | null;
  created_at: string;
};

type Member = { id: string; username: string; avatar_url?: string | null; is_online?: boolean };

export default function ChatPage() {
  const params = useParams();
  const id = String(params.id || "");
  const [messages, setMessages] = useState<Message[]>([]);
  const [member, setMember] = useState<Member | null>(null);
  const [currentId, setCurrentId] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function loadMessages() {
    try {
      const [threadResponse, profileResponse] = await Promise.all([
        fetch(`/api/messages/${encodeURIComponent(id)}`, { cache: "no-store" }),
        fetch("/api/profile", { cache: "no-store" }),
      ]);
      const threadData = await threadResponse.json();
      if (!threadResponse.ok) throw new Error(threadData.error || "تعذر تحميل المحادثة");
      setMessages(threadData.messages || []);
      setMember(threadData.member || null);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setCurrentId(profileData?.profile?.id || "");
      }
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل المحادثة");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    void loadMessages();
    const timer = window.setInterval(() => void loadMessages(), 8000);
    return () => window.clearInterval(timer);
  }, [id]);

  async function sendMessage() {
    const content = text.trim();
    if (!content || sending) return;
    setSending(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_id: id, content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "تعذر إرسال الرسالة");
      setText("");
      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إرسال الرسالة");
    } finally {
      setSending(false);
    }
  }

  return (
    <MemberShell title="المحادثة" subtitle="مساحة خاصة داخل قلبي لوڤي بعد توافق الاهتمام بينكما.">
      <section className="relative overflow-hidden rounded-[34px] border border-rose-100 bg-white shadow-[0_24px_70px_rgba(75,14,40,.08)]">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-24 h-40 w-40 rounded-full border-[18px] border-amber-100/40" />
        <header className="relative flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 bg-gradient-to-l from-rose-50/80 via-white to-emerald-50/40 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/messages" className="grid h-10 w-10 place-items-center rounded-2xl border border-rose-100 bg-white text-rose-700" aria-label="العودة للمحادثات"><ArrowRight className="h-4 w-4" /></Link>
            {member && (
              <>
                <span className="relative h-12 w-12 overflow-hidden rounded-[18px] bg-rose-50 shadow-sm">
                  <Image src={member.avatar_url || fallbackAvatar(undefined, undefined, { seed: member.id })} alt={member.username} fill className="object-cover" sizes="48px" />
                  {member.is_online && <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />}
                </span>
                <div><div className="text-sm font-black text-[#3b0b20]">{member.username}</div><div className="mt-1 text-[10px] font-bold text-emerald-700">التواصل متاح بعد اهتمام متبادل</div></div>
              </>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-2 text-[10px] font-black text-emerald-700"><ShieldCheck className="h-3.5 w-3.5" /> لا تشارك بيانات اتصال أو أموال</span>
        </header>

        {error && <div className="m-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-center text-xs font-black text-red-700">{error}</div>}

        <div className="relative min-h-[470px] space-y-3 overflow-y-auto bg-[linear-gradient(180deg,#fffdfd,#fff8fb)] p-4 sm:p-6">
          {loading ? <div className="py-20 text-center text-xs font-black text-rose-400">جاري تحميل المحادثة...</div> : messages.length === 0 ? (
            <div className="py-20 text-center"><Sparkles className="mx-auto h-8 w-8 text-amber-400" /><div className="mt-3 text-sm font-black text-rose-700">ابدأ برسالة بسيطة ومحترمة</div><p className="mt-2 text-xs font-bold text-rose-400">التعارف الهادئ والواضح أفضل بداية.</p></div>
          ) : messages.map((message) => {
            const mine = Boolean(currentId && message.sender_id === currentId);
            return (
              <div key={message.id} className={`flex ${mine ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[82%] rounded-[22px] px-4 py-3 text-sm font-bold leading-6 shadow-sm ${mine ? "rounded-tr-md bg-gradient-to-l from-[#b20f4e] to-[#ef2d69] text-white" : "rounded-tl-md border border-rose-100 bg-white text-rose-700"}`}>
                  {message.type === "voice" && message.voice_url ? <audio controls preload="none" className="max-w-full" src={message.voice_url} /> : <p>{message.content}</p>}
                  <small className={`mt-1 block text-[9px] ${mine ? "text-white/70" : "text-rose-400"}`}>{new Date(message.created_at).toLocaleString("ar-EG")}</small>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative border-t border-rose-100 bg-white p-3 sm:p-4">
          <div className="mb-2 text-[10px] font-bold text-rose-400">لا تكتب رقم هاتفك أو رابط حساب خارجي داخل الرسائل.</div>
          <div className="flex items-end gap-2 rounded-[22px] border border-rose-200 bg-[#fffafb] p-2 focus-within:border-rose-400">
            <VoiceRecorder receiverId={id} onSent={() => void loadMessages()} />
            <SpeechToTextButton onTranscript={(transcript) => setText((current) => `${current}${current ? " " : ""}${transcript}`)} />
            <textarea dir="auto" value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} rows={1} className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm font-bold outline-none" aria-label="نص الرسالة" />
            <button type="button" onClick={() => void sendMessage()} disabled={sending || !text.trim()} className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-l from-[#b20f4e] to-[#ef2d69] text-white shadow-lg shadow-rose-100 disabled:opacity-50" aria-label="إرسال"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      </section>
    </MemberShell>
  );
}
