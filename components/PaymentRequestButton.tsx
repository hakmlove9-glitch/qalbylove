'use client';

import { useState } from "react";

export default function PaymentRequestButton({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function sendPaymentRequest() {
    setLoading(true);

    await fetch("/api/payments/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    setLoading(false);
  }

  return (
    <button
      onClick={sendPaymentRequest}
      disabled={loading}
      className="qalby-button w-full"
    >
      {loading ? "جاري الإرسال..." : "تأكيد طلب الدفع 💳"}
    </button>
  );
}
