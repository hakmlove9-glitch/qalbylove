"use client";

import { useEffect, useState } from "react";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean | null;
  created_at: string | null;
};

type Props = {
  receiverId: string;
  receiverName?: string;
  currentMemberId?: string;
  onClose?: () => void;
};

export default function ChatWindow({
  receiverId,
  receiverName,
  currentMemberId,
  onClose,
}: Props) {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [content, setContent] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadMessages() {
    try {
      const res = await fetch(
        `/api/messages?member_id=${encodeURIComponent(
          receiverId
        )}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "تعذر تحميل الرسائل"
        );
      }

      setMessages(
        data.messages || []
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "تعذر تحميل الرسائل"
      );
    }
  }

  useEffect(() => {
    loadMessages();

    const timer =
      setInterval(
        loadMessages,
        5000
      );

    return () =>
      clearInterval(timer);
  }, [receiverId]);

  async function sendMessage() {
    if (!content.trim()) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const res = await fetch(
        "/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            receiver_id:
              receiverId,
            content:
              content.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "تعذر إرسال الرسالة"
        );
      }

      setContent("");

      await loadMessages();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "تعذر إرسال الرسالة"
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="flex h-[500px] flex-col rounded-2xl bg-white"
    >

      <div className="flex items-center justify-between border-b p-4">

        <h2 className="font-bold text-rose-700">
          💬 {receiverName || "المحادثة"}
        </h2>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-3 py-2"
          >
            ✕
          </button>
        )}

      </div>

      {error && (
        <div className="p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto p-4">

        {messages.length === 0 ? (
          <p className="text-center text-gray-500">
            لا توجد رسائل بعد
          </p>
        ) : (
          messages.map(
            (message) => {
              const mine =
                currentMemberId
                  ? message.sender_id ===
                    currentMemberId
                  : false;

              return (
                <div
                  key={message.id}
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    mine
                      ? "mr-auto bg-rose-600 text-white"
                      : "ml-auto bg-gray-100 text-gray-900"
                  }`}
                >
                  <p>
                    {message.content}
                  </p>

                  {message.created_at && (
                    <small className="mt-1 block opacity-60">
                      {new Date(
                        message.created_at
                      ).toLocaleTimeString(
                        "ar-EG",
                        {
                          hour: "2-digit",
                          minute:
                            "2-digit",
                        }
                      )}
                    </small>
                  )}
                </div>
              );
            }
          )
        )}

      </div>

      <div className="flex gap-2 border-t p-3">

        <input
          value={content}
          onChange={(e) =>
            setContent(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              !e.shiftKey
            ) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="اكتب رسالتك..."
          className="flex-1 rounded-xl border p-3"
        />

        <button
          onClick={sendMessage}
          disabled={
            sending ||
            !content.trim()
          }
          className="qalby-button disabled:opacity-50"
        >
          {sending
            ? "..."
            : "إرسال"}
        </button>

      </div>

    </div>
  );
}