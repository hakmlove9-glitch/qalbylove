'use client';

import { useState } from "react";

export default function SubscribeButton({
  planId,
}: {
  planId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function subscribe() {
    setLoading(true);

    await fetch("/api/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planId,
      }),
    });

    setLoading(false);
  }

  return (
    <button
      onClick={subscribe}
      disabled={loading}
      className="qalby-button w-full"
    >
      {loading ? "جاري الطلب..." : "اشترك الآن ⭐"}
    </button>
  );
}
