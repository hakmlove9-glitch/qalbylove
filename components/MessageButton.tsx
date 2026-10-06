'use client';

import { useState } from "react";

type Props = {
  receiverId: string;
};

export default function MessageButton({
  receiverId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  async function sendMessage() {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiverId,
        content: message,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setResult("تم إرسال الرسالة 💌");
      setMessage("");
    } else {
      setResult(data.error || "حدث خطأ");
    }
  }

  return (
    <div className="mt-4">

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-black text-white shadow-[0_10px_24px_rgba(16,185,129,.22)] transition hover:-translate-y-0.5 hover:bg-emerald-600"
        >
          إرسال رسالة 💌
        </button>
      )}

      {open && (
        <div className="rounded-xl border p-4">

          <textarea
            className="mb-3 w-full rounded-xl border p-3"
            placeholder="اكتب رسالتك"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={sendMessage}
            className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-black text-white shadow-[0_10px_24px_rgba(16,185,129,.22)] transition hover:-translate-y-0.5 hover:bg-emerald-600"
          >
            إرسال
          </button>

          {result && (
            <p className="mt-3 text-center font-bold">
              {result}
            </p>
          )}

        </div>
      )}

    </div>
  );
}
