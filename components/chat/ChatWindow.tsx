"use client";

import Image from "next/image";
import { fallbackAvatar } from "@/lib/avatar-fallback";
import { Ban, ChevronDown, Heart, Loader2, Maximize2, Minus, ShieldAlert, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage, ConversationMember } from "@/types/chat";
import MessageInput from "./MessageInput";

export default function ChatWindow({
  currentMemberId,
  member,
  messages,
  loading,
  minimized,
  onMinimize,
  onClose,
  onOpenProfile,
  onSendText,
  onSendVoice,
}: {
  currentMemberId: string;
  member: ConversationMember;
  messages: ChatMessage[];
  loading: boolean;
  minimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
  onOpenProfile: () => void;
  onSendText: (content: string) => Promise<void>;
  onSendVoice: (blob: Blob) => Promise<void>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!minimized) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, minimized]);

  const grouped = useMemo(() => messages, [messages]);

  async function interest() {
    const response = await fetch("/api/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiver_id: member.id }),
    });
    const data = await response.json().catch(() => ({}));
    setNotice(response.ok ? data?.message || "تم إرسال الاهتمام." : data?.error || "تعذر إرسال الاهتمام");
    setMenuOpen(false);
  }

  async function block() {
    if (!window.confirm("هل تريد حظر هذا العضو؟ لن يتمكن من التواصل معك.")) return;
    const response = await fetch("/api/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blocked_id: member.id }),
    });
    const data = await response.json().catch(() => ({}));
    setNotice(response.ok ? data?.message || "تمت إضافة العضو لقائمة التجاهل." : data?.error || "تعذر تحديث القائمة");
    setMenuOpen(false);
  }

  function report() {
    window.dispatchEvent(new CustomEvent("qalbylove:report-member", { detail: { memberId: member.id, memberName: member.username } }));
    setMenuOpen(false);
  }

  return (
    <section className={`flex flex-col overflow-hidden rounded-t-[24px] border border-rose-100 bg-white shadow-[0_26px_80px_rgba(54,8,30,.18)] ${minimized ? "h-[58px]" : "h-[520px] max-h-[calc(100dvh-112px)]"}`} dir="rtl">
      <header className="relative flex h-[58px] items-center gap-2 border-b border-rose-100 bg-white px-3">
        <button onClick={onOpenProfile} className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-rose-50">
          <Image src={member.avatar_url || fallbackAvatar(undefined, undefined, { seed: member.id })} alt={member.username} fill className="object-cover" sizes="40px" />
          <span className={`absolute bottom-0 left-0 h-2.5 w-2.5 rounded-full ring-2 ring-white ${member.is_online ? "bg-emerald-500" : "bg-rose-300"}`} />
        </button>

        <button onClick={onOpenProfile} className="min-w-0 flex-1 text-right">
          <b className="block truncate text-xs font-black text-rose-900">{member.username}</b>
          <span className={`text-[10px] font-bold ${member.is_online ? "text-emerald-600" : "text-rose-400"}`}>{member.is_online ? "متصل الآن" : "غير متصل"}</span>
        </button>

        <div className="relative flex items-center gap-1">
          <button onClick={() => setMenuOpen((value) => !value)} className="grid h-8 w-8 place-items-center rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600" aria-label="خيارات المحادثة">
            <ChevronDown className="h-4 w-4" />
          </button>
          <button onClick={onMinimize} className="grid h-8 w-8 place-items-center rounded-xl text-rose-500 hover:bg-rose-50" aria-label={minimized ? "فتح المحادثة" : "تصغير المحادثة"}>
            {minimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minus className="h-4 w-4" />}
          </button>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-xl text-rose-500 hover:bg-red-50 hover:text-red-600" aria-label="إغلاق المحادثة">
            <X className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute left-0 top-10 z-20 w-52 overflow-hidden rounded-2xl border border-rose-100 bg-white p-1.5 shadow-2xl">
              <button onClick={onOpenProfile} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black text-rose-600 hover:bg-rose-50"><UserRound className="h-4 w-4 text-rose-500" />عرض الملف</button>
              <button onClick={() => void interest()} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black text-rose-600 hover:bg-rose-50"><Heart className="h-4 w-4 text-rose-500" />إضافة اهتمام</button>
              <button onClick={() => void block()} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black text-rose-600 hover:bg-rose-50"><Ban className="h-4 w-4" />حظر العضو</button>
              <button onClick={report} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-black text-amber-700 hover:bg-amber-50"><ShieldAlert className="h-4 w-4" />إبلاغ الإدارة</button>
            </div>
          )}
        </div>
      </header>

      {!minimized && (
        <>
          {notice && <div className="border-b border-rose-100 bg-rose-50 px-3 py-2 text-center text-[10px] font-black text-rose-700">{notice}</div>}

          <div ref={scrollRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-[linear-gradient(180deg,#fffafb_0%,#fff7fa_100%)] p-3">
            {loading ? (
              <div className="flex h-full items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-rose-500" /></div>
            ) : grouped.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-rose-600 shadow-sm"><Heart className="h-6 w-6" /></span>
                <h4 className="mt-4 text-sm font-black text-rose-800">ابدأ الكلام بهدوء</h4>
                <p className="mt-2 text-[11px] font-bold leading-6 text-rose-500">رسالة قصيرة ومحترمة كفاية لبداية جيدة. لا تشارك بيانات مالية أو معلومات حساسة.</p>
              </div>
            ) : (
              grouped.map((message) => {
                const mine = message.sender_id === currentMemberId;
                return (
                  <div key={message.id} className={`flex ${mine ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[82%] rounded-[18px] px-3 py-2.5 shadow-sm ${mine ? "rounded-br-md bg-gradient-to-br from-rose-600 to-pink-500 text-white" : "rounded-bl-md border border-rose-100 bg-white text-rose-800"}`}>
                      {message.type === "voice" && message.voice_url ? (
                        <div className="min-w-[220px]">
                          <div className={`mb-2 text-[10px] font-black ${mine ? "text-white/80" : "text-rose-600"}`}>رسالة صوتية</div>
                          <audio controls preload="metadata" src={message.voice_url} className="h-9 w-full" />
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap break-words text-xs font-bold leading-6">{message.content}</p>
                      )}
                      <div className={`mt-1 flex items-center gap-1 text-[9px] font-bold ${mine ? "text-white/70" : "text-rose-400"}`}>
                        <span>{new Date(message.created_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}</span>
                        {mine && <span>{message.is_read ? "تمت القراءة" : "تم الإرسال"}</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <MessageInput disabled={loading} onSendText={onSendText} onSendVoice={onSendVoice} />
        </>
      )}
    </section>
  );
}
