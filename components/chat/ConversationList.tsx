"use client";

import Image from "next/image";
import Link from "next/link";
import { fallbackAvatar } from "@/lib/avatar-fallback";
import { Crown, MessageCircle, Mic2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Conversation } from "@/types/chat";

export default function ConversationList({
  conversations,
  onSelect,
}: {
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
}) {
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const value = query.trim();
    if (!value) return conversations;
    return conversations.filter((item) => item.member.username.includes(value));
  }, [conversations, query]);

  return (
    <div className="flex h-full flex-col" dir="rtl">
      <div className="relative mb-3">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ابحث في محادثاتك"
          aria-label="ابحث في محادثاتك"
          className="h-11 w-full rounded-2xl border border-rose-100 bg-rose-50/40 pr-9 pl-3 text-xs font-bold outline-none transition focus:border-rose-300 focus:bg-white"
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pl-1">
        {visible.length === 0 ? (
          <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-[24px] border border-dashed border-rose-200 bg-rose-50/45 px-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-rose-600 shadow-sm">
              <MessageCircle className="h-6 w-6" />
            </span>
            <h4 className="mt-4 text-sm font-black text-rose-800">{query.trim() ? "ملوش نتيجة البحث دي" : "لسه مفيش رسائل ❤️"}</h4>
            <p className="mt-2 text-xs font-bold leading-6 text-rose-500">{query.trim() ? "جرّب اسمًا تانيًا أو امسح كلمة البحث." : "ابدأ بالتعرف على أعضاء مناسبين ليك، وهتظهر محادثاتك هنا."}</p>
            {!query.trim() && <Link href="/search" className="mt-4 inline-flex min-h-10 items-center rounded-xl bg-rose-600 px-4 py-2 text-xs font-black text-white">اكتشف الأعضاء</Link>}
          </div>
        ) : (
          visible.map((conversation) => (
            <button
              key={conversation.memberId}
              onClick={() => onSelect(conversation)}
              className="flex w-full items-center gap-3 rounded-[20px] border border-transparent bg-white p-3 text-right transition hover:border-rose-100 hover:bg-rose-50/55"
            >
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-rose-50">
                <Image src={conversation.member.avatar_url || fallbackAvatar(undefined, undefined, { seed: conversation.member.id })} alt={conversation.member.username} fill className="object-cover" sizes="48px" />
                <span className={`absolute bottom-0.5 left-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${conversation.member.is_online ? "bg-emerald-500" : "bg-rose-300"}`} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <b className="truncate text-xs font-black text-rose-900">{conversation.member.username}</b>
                  {conversation.member.is_premium && <Crown className="h-3.5 w-3.5 shrink-0 text-amber-500" />}
                </span>
                <span className="mt-1 flex items-center gap-1.5 truncate text-[11px] font-bold text-rose-500">
                  {conversation.lastMessageType === "voice" && <Mic2 className="h-3 w-3 shrink-0 text-rose-500" />}
                  <span className="truncate">{conversation.lastMessage || "ابدأ محادثة جديدة"}</span>
                </span>
              </span>

              <span className="shrink-0 text-left">
                <span className="block text-[9px] font-bold text-rose-400">
                  {conversation.created_at ? new Date(conversation.created_at).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" }) : ""}
                </span>
                {conversation.unread > 0 && (
                  <span className="mt-1 inline-grid min-h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[9px] font-black text-white">
                    {conversation.unread > 99 ? "99+" : conversation.unread}
                  </span>
                )}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
