export type PaymentRequestInput = {
  planName: string;
  amount: number;
  durationMonths: number;
  walletNetwork: string;
  senderWallet: string;
  transactionRef?: string;
  note?: string;
  receipt: File;
};

export async function getMyPayments() {
  try {
    const response = await fetch("/api/payments", {
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.payments) ? data.payments : [];
  } catch {
    return [];
  }
}

export async function submitPaymentRequest(input: PaymentRequestInput) {
  const form = new FormData();
  form.append("plan_name", input.planName);
  form.append("amount", String(input.amount));
  form.append("duration_months", String(input.durationMonths));
  form.append("wallet_network", input.walletNetwork);
  form.append("sender_wallet", input.senderWallet);
  form.append("transaction_ref", input.transactionRef || "");
  form.append("note", input.note || "");
  form.append("receipt", input.receipt);

  try {
    const response = await fetch("/api/payments/request", {
      method: "POST",
      credentials: "include",
      body: form,
    });

    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      payment: data.payment || null,
      error: response.ok
        ? ""
        : String(data.error || data.message || "تعذر إرسال طلب الدفع"),
    };
  } catch {
    return {
      ok: false,
      payment: null,
      error: "تعذر الاتصال أثناء إرسال طلب الدفع",
    };
  }
}

export async function activateSubscriptionCode(code: string) {
  try {
    const response = await fetch("/api/subscriptions/activate", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: String(code || "").trim().toUpperCase() }),
    });

    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      data,
      error: response.ok ? "" : String(data.error || "تعذر تفعيل الكود"),
    };
  } catch {
    return {
      ok: false,
      data: null,
      error: "تعذر الاتصال أثناء تفعيل الكود",
    };
  }
}
