'use client';

import { useState } from "react";

export default function InterestButton({
  memberId,
}: {
  memberId: string;
}) {
  const [sent, setSent] = useState(false);

  async function sendInterest() {
    await fetch("/api/interests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberId,
      }),
    });

    setSent(true);
  }

  return (
    <button
      onClick={sendInterest}
      disabled={sent}
      className="qalby-button"
    >
      {sent ? "تم إرسال الاهتمام ❤️" : "إرسال اهتمام ❤️"}
    </button>
  );
}
