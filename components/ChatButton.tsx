"use client";

import { useEffect, useState } from "react";

type Props = {
  receiverId?: string;
  receiverName?: string;
};

export default function ChatButton({
  receiverId,
  receiverName,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const [unread, setUnread] =
    useState(0);

  useEffect(() => {
    loadUnread();
  }, []);

  async function loadUnread() {
    try {
      const res = await fetch(
        "/api/messages"
      );

      if (!res.ok) return;

      const data = await res.json();

      setUnread(
        data.unread || 0
      );
    } catch {}
  }

  if (!receiverId) {
    return null;
  }

  return (
    <>
      <button
        onClick={() =>
          setOpen(true)
        }
        className="relative rounded-xl bg-rose-600 px-5 py-3 font-bold text-white"
      >
        💬 رسالة

        {unread > 0 && (
          <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-5">

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-xl font-bold text-rose-700">
                💬 {receiverName || "محادثة"}
              </h2>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-lg bg-gray-100 px-3 py-2"
              >
                ✕
              </button>

            </div>

            <ChatBox
              receiverId={
                receiverId
              }
            />

          </div>
        </div>
      )}
    </>
  );
}

function ChatBox({
  receiverId,
}: {
  receiverId: string;
}) {
  const [messages, setMessages] =
    useState<any[]>([]);

  const [content, setContent] =
    useState("");

  const [sending, setSending] =
    useState(false);

  async function load() {
    const res = await fetch(
      `/api/messages?member_id=${encodeURIComponent(
        receiverId
      )}`
    );

    const data = await res.json();

    if (res.ok) {
      setMessages(
        data.messages || []
      );
    }
  }

  useEffect(() => {
    load();
  }, [receiverId]);

  async function send() {
    if (!content.trim()) return;

    setSending(true);

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

    if (res.ok) {
      setContent("");
      await load();
    }

    setSending(false);
  }

  return (
    <div>

      <div className="mb-4 max-h-80 space-y-2 overflow-y-auto">

        {messages.map(
          (message) => (
            <div
              key={message.id}
              className="rounded-xl bg-rose-50 p-3"
            >
              {message.content}
            </div>
          )
        )}

        {messages.length === 0 && (
          <p className="py-8 text-center text-gray-500">
            لا توجد رسائل بعد
          </p>
        )}

      </div>

      <div className="flex gap-2">

        <input
          value={content}
          onChange={(e) =>
            setContent(
              e.target.value
            )
          }
          onKeyDown={(e) => {
            if (
              e.key === "Enter"
            ) {
              send();
            }
          }}
          placeholder="اكتب رسالة..."
          className="flex-1 rounded-xl border p-3"
        />

        <button
          onClick={send}
          disabled={
            sending ||
            !content.trim()
          }
          className="qalby-button disabled:opacity-50"
        >
          إرسال
        </button>

      </div>

    </div>
  );
}