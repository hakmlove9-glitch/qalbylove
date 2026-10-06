'use client';

import { useState } from "react";

export default function ReportButton({
  memberId,
}: {
  memberId: string;
}) {
  const [reported, setReported] = useState(false);

  async function sendReport() {
    const reason = prompt("اكتب سبب البلاغ");

    if (!reason) return;

    await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reportedId: memberId,
        reason,
      }),
    });

    setReported(true);
  }

  return (
    <button
      onClick={sendReport}
      disabled={reported}
      className="qalby-button"
    >
      {reported ? "تم إرسال البلاغ 🚨" : "إبلاغ 🚨"}
    </button>
  );
}
