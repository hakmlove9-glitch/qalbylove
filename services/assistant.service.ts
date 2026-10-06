export type AssistantContext = "signup" | "platform";

export async function askAdamHawa(input: {
  message: string;
  context?: AssistantContext;
  pathname?: string;
  gender?: string;
  memberId?: string;
  completion?: number;
  step?: number;
  profile?: Record<string, unknown>;
}) {
  try {
    const response = await fetch("/api/assistant", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      reply: String(
        data.reply ||
          (response.ok
            ? "أنا معك. اكتب لي النقطة اللي محتاج مساعدة فيها."
            : "تعذر الرد الآن."),
      ),
    };
  } catch {
    return {
      ok: false,
      reply: "تعذر الاتصال بالمساعد الآن. حاول مرة أخرى بعد قليل.",
    };
  }
}

export async function requestWritingSuggestions(
  profile: Record<string, unknown>,
  target: "bio" | "partner",
) {
  try {
    const response = await fetch("/api/assistant/bio-suggestions", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, target }),
    });

    const data = await response.json().catch(() => ({}));

    return {
      ok: response.ok,
      suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
      error: response.ok ? "" : String(data.error || "تعذر تجهيز الاقتراحات"),
    };
  } catch {
    return {
      ok: false,
      suggestions: [],
      error: "تعذر الاتصال أثناء تجهيز الاقتراحات",
    };
  }
}
