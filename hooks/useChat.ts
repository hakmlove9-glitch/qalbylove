"use client";

import { useCallback, useEffect, useState } from "react";

import {
  type ChatMessage,
  getMessages,
  getLastChatError,
  markMessagesAsRead,
  sendMessage as sendChatMessage,
  subscribeToMessages,
} from "@/services/chat.service";

interface UseChatOptions {
  memberId?: string;
  currentMemberId?: string;
}

interface SendMessageOptions {
  content?: string;
  type?: "text" | "voice";
  voiceFile?: File | Blob | null;
  duration?: number;
}

export default function useChat({
  memberId,
  currentMemberId,
}: UseChatOptions = {}) {
  const otherMemberId = memberId || "";
  const currentId = currentMemberId || "";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    if (!currentId || !otherMemberId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getMessages(currentId, otherMemberId);
      setMessages(result);

      const serviceError = getLastChatError();
      if (serviceError) setError(serviceError);

      await markMessagesAsRead(currentId, otherMemberId);
    } catch (err) {
      console.error("useChat load error:", err);
      setError("تعذر تحميل الرسائل");
    } finally {
      setLoading(false);
    }
  }, [currentId, otherMemberId]);

  const sendMessage = useCallback(
    async ({
      content = "",
      type = "text",
      voiceFile = null,
      duration = 0,
    }: SendMessageOptions) => {
      if (!currentId || !otherMemberId) return null;

      const cleanContent = content.trim();

      if (type === "text" && !cleanContent) {
        setError("اكتب الرسالة أولًا");
        return null;
      }

      if (type === "voice" && !voiceFile) {
        setError("التسجيل الصوتي غير موجود");
        return null;
      }

      setError(null);

      const message = await sendChatMessage({
        senderId: currentId,
        receiverId: otherMemberId,
        content: cleanContent,
        type,
        voiceFile,
        duration,
      });

      if (!message) {
        setError(getLastChatError() || "تعذر إرسال الرسالة");
        return null;
      }

      setMessages((previous) => {
        if (previous.some((item) => item.id === message.id)) return previous;
        return [...previous, message];
      });

      return message;
    },
    [currentId, otherMemberId],
  );

  const markRead = useCallback(async () => {
    if (!currentId || !otherMemberId) return;

    await markMessagesAsRead(currentId, otherMemberId);

    setMessages((previous) =>
      previous.map((message) =>
        message.receiver_id === currentId
          ? { ...message, is_read: true }
          : message,
      ),
    );
  }, [currentId, otherMemberId]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (!currentId) return;

    const unsubscribe = subscribeToMessages(
      currentId,
      (message: ChatMessage) => {
        if (
          message.sender_id === otherMemberId ||
          message.receiver_id === otherMemberId
        ) {
          setMessages((previous) => {
            if (previous.some((item) => item.id === message.id)) {
              return previous;
            }
            return [...previous, message];
          });
        }
      },
    );

    return unsubscribe;
  }, [currentId, otherMemberId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    loadMessages,
    markMessagesAsRead: markRead,
    markRead,
  };
}
