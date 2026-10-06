'use client';

import { useState } from "react";

type Props = {
  memberId: string;
  initialStatus?: "empty" | "sent" | "mutual";
};

export default function HeartButton({
  memberId,
  initialStatus = "empty",
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  async function toggleHeart() {
    if (loading) return;

    setLoading(true);

    const res = await fetch("/api/interests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiverId: memberId,
      }),
    });

    const data = await res.json();

    if (data.status) {
      setStatus(data.status);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleHeart}
      disabled={loading}
      className="text-4xl"
      aria-label="إرسال اهتمام"
    >
      {status === "empty" && "♡"}
      {status === "sent" && "♥"}
      {status === "mutual" && "❤️"}
    </button>
  );
}
