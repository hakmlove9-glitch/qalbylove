"use client";

import { fallbackAvatar } from "@/lib/avatar-fallback";

import { MessageCircle, MessagesSquare, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage, Conversation, ConversationMember, OpenChatDetail } from "@/types/chat";
import { subscribeToMessages } from "@/services/chat.service";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import MemberProfileModal from "@/components/member/MemberProfileModal";
import ReportMemberModal from "@/components/member/ReportMemberModal";

type OpenWindow = {
  member: ConversationMember;
  messages: ChatMessage[];
  loading: boolean;
  minimized: boolean;
};

export default function FloatingChat() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState("");
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const windowsRef = useRef<OpenWindow[]>(windows);
  const [profileMemberId, setProfileMemberId] = useState<string | null>(null);
  const [reportTarget, setReportTarget] = useState<{ memberId: string; memberName: string } | null>(null);
  windowsRef.current = windows;

  const loadConversations = useCallback(async () => {
    const response = await fetch("/api/messages", { cache: "no-store" });
    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }
    if (!response.ok) return;
    const data = await response.json();
    setAuthenticated(true);
    setConversations(data.conversations || []);
    setUnreadCount(Number(data.unreadCount || 0));
  }, []);

  const loadMessages = useCallback(async (memberId: string) => {
    setWindows((items) => items.map((item) => item.member.id === memberId ? { ...item, loading: true } : item));
    const response = await fetch(`/api/messages/${encodeURIComponent(memberId)}`, { cache: "no-store" });
    if (!response.ok) {
      setWindows((items) => items.map((item) => item.member.id === memberId ? { ...item, loading: false } : item));
      return;
    }
    const data = await response.json();
    setWindows((items) => items.map((item) => item.member.id === memberId ? {
      ...item,
      member: { ...item.member, ...(data.member || {}) },
      messages: data.messages || [],
      loading: false,
    } : item));
    void loadConversations();
  }, [loadConversations]);

  const openChat = useCallback(async (detail: OpenChatDetail | Conversation) => {
    const memberId = detail.memberId;
    if (!memberId) return;

    const fromConversation = conversations.find((item) => item.memberId === memberId)?.member;
    let member: ConversationMember = fromConversation || {
      id: memberId,
      username: "memberName" in detail && detail.memberName ? detail.memberName : "عضو قلبي لوڤي",
      avatar_url: "avatarUrl" in detail ? detail.avatarUrl || null : null,
      is_online: false,
      is_premium: false,
    };

    if (!fromConversation) {
      const response = await fetch(`/api/member-profile?id=${encodeURIComponent(memberId)}`, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        const profile = data.profile;
        const primary = profile?.photos?.find((photo: any) => photo.is_primary) || profile?.photos?.[0];
        member = {
          id: memberId,
          username: profile?.username || member.username,
          avatar_url: primary?.image_url || profile?.avatar_url || member.avatar_url || fallbackAvatar(profile?.gender, profile?.age),
          is_online: Boolean(profile?.is_online),
          is_premium: Boolean(profile?.is_premium),
        };
      }
    }

    setWindows((items) => {
      const exists = items.find((item) => item.member.id === memberId);
      if (exists) return items.map((item) => item.member.id === memberId ? { ...item, minimized: false, member } : item);
      return [...items.slice(-2), { member, messages: [], loading: true, minimized: false }];
    });
    setLauncherOpen(false);
    setTimeout(() => void loadMessages(memberId), 0);
  }, [conversations, loadMessages]);

  useEffect(() => {
    fetch("/api/profile", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json();
      })
      .then((data) => {
        if (data?.profile?.id) {
          setAuthenticated(true);
          setCurrentMemberId(String(data.profile.id));
          void loadConversations();
        }
      })
      .catch(() => undefined);
  }, [loadConversations]);

  useEffect(() => {
    if (!authenticated) return;
    const timer = window.setInterval(() => {
      void loadConversations();
      windows.filter((item) => !item.minimized).forEach((item) => void loadMessages(item.member.id));
    }, 12000);
    return () => window.clearInterval(timer);
  }, [authenticated, loadConversations, loadMessages, windows]);

  useEffect(() => {
    if (!authenticated || !currentMemberId) return;
    try {
      return subscribeToMessages(currentMemberId, (message) => {
        const otherMemberId = message.sender_id === currentMemberId ? message.receiver_id : message.sender_id;
        if (windowsRef.current.some((item) => item.member.id === otherMemberId && !item.minimized)) {
          void loadMessages(otherMemberId);
        } else {
          void loadConversations();
        }
      });
    } catch {
      return undefined;
    }
  }, [authenticated, currentMemberId, loadConversations, loadMessages]);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<OpenChatDetail>).detail;
      if (detail?.memberId) void openChat(detail);
    };
    const onReport = (event: Event) => {
      const detail = (event as CustomEvent<{ memberId: string; memberName?: string }>).detail;
      if (detail?.memberId) setReportTarget({ memberId: detail.memberId, memberName: detail.memberName || "العضو" });
    };
    window.addEventListener("qalbylove:open-chat", onOpen);
    window.addEventListener("qalbylove:report-member", onReport);
    return () => {
      window.removeEventListener("qalbylove:open-chat", onOpen);
      window.removeEventListener("qalbylove:report-member", onReport);
    };
  }, [openChat]);

  async function sendText(memberId: string, content: string) {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiver_id: memberId, content }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || "تعذر إرسال الرسالة");
    await loadMessages(memberId);
  }

  async function sendVoice(memberId: string, blob: Blob) {
    const form = new FormData();
    form.append("receiver_id", memberId);
    form.append("audio", new File([blob], `voice-${Date.now()}.webm`, { type: blob.type || "audio/webm" }));
    const response = await fetch("/api/messages/voice", { method: "POST", body: form });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error || "تعذر إرسال التسجيل");
    await loadMessages(memberId);
  }

  const visibleWindows = useMemo(() => windows.slice(-3), [windows]);
  if (!authenticated || !currentMemberId) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex items-end justify-end gap-2 px-3 sm:px-5" dir="rtl">
        <div className="pointer-events-auto order-last mb-4">
          {launcherOpen && (
            <div className="mb-2 flex h-[min(500px,calc(100dvh-112px))] w-[360px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-[0_28px_90px_rgba(54,8,30,.2)]">
              <div className="flex h-16 items-center justify-between bg-gradient-to-l from-[#5b0a2e] via-[#8d124a] to-[#c72f6e] px-4 text-white">
                <div>
                  <b className="block text-sm font-black">محادثات قلبي لوڤي</b>
                  <span className="text-[10px] font-bold text-white/75">نص وصوت بدون ما تسيب الصفحة</span>
                </div>
                <button onClick={() => setLauncherOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-white/10"><X className="h-4 w-4" /></button>
              </div>
              <div className="min-h-0 flex-1 p-3"><ConversationList conversations={conversations} onSelect={(conversation) => void openChat(conversation)} /></div>
            </div>
          )}

          <button
            onClick={() => setLauncherOpen((value) => !value)}
            className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#7f0e42] to-[#e33f80] text-white shadow-[0_18px_45px_rgba(164,24,83,.35)] transition hover:-translate-y-1"
            aria-label="فتح المحادثات"
          >
            {launcherOpen ? <X className="h-5 w-5" /> : <MessagesSquare className="h-6 w-6" />}
            {unreadCount > 0 && <span className="absolute -left-1.5 -top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-[9px] font-black text-amber-950 ring-2 ring-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}
          </button>
        </div>

        <div className="pointer-events-auto hidden items-end gap-2 lg:flex">
          {visibleWindows.map((item) => (
            <div key={item.member.id} className="w-[330px]">
              <ChatWindow
                currentMemberId={currentMemberId}
                member={item.member}
                messages={item.messages}
                loading={item.loading}
                minimized={item.minimized}
                onMinimize={() => setWindows((items) => items.map((windowItem) => windowItem.member.id === item.member.id ? { ...windowItem, minimized: !windowItem.minimized } : windowItem))}
                onClose={() => setWindows((items) => items.filter((windowItem) => windowItem.member.id !== item.member.id))}
                onOpenProfile={() => setProfileMemberId(item.member.id)}
                onSendText={(content) => sendText(item.member.id, content)}
                onSendVoice={(blob) => sendVoice(item.member.id, blob)}
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-auto fixed inset-x-3 bottom-20 lg:hidden">
          {visibleWindows.slice(-1).map((item) => (
            <ChatWindow
              key={item.member.id}
              currentMemberId={currentMemberId}
              member={item.member}
              messages={item.messages}
              loading={item.loading}
              minimized={item.minimized}
              onMinimize={() => setWindows((items) => items.map((windowItem) => windowItem.member.id === item.member.id ? { ...windowItem, minimized: !windowItem.minimized } : windowItem))}
              onClose={() => setWindows((items) => items.filter((windowItem) => windowItem.member.id !== item.member.id))}
              onOpenProfile={() => setProfileMemberId(item.member.id)}
              onSendText={(content) => sendText(item.member.id, content)}
              onSendVoice={(blob) => sendVoice(item.member.id, blob)}
            />
          ))}
        </div>
      </div>

      <MemberProfileModal memberId={profileMemberId} open={Boolean(profileMemberId)} onClose={() => setProfileMemberId(null)} />
      {reportTarget && <ReportMemberModal open memberId={reportTarget.memberId} memberName={reportTarget.memberName} onClose={() => setReportTarget(null)} />}
    </>
  );
}
