import { getBrowserSupabaseClient } from "@/lib/supabase/client";

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read?: boolean | null;
  created_at?: string | null;
  type?: "text" | "voice" | "image" | "file" | string;
  voice_url?: string | null;
}

export interface SendMessageInput {
  senderId?: string;
  receiverId: string;
  content?: string;
  type?: "text" | "voice";
  voiceUrl?: string | null;
  voiceFile?: File | Blob | null;
  duration?: number;
}

export type ChatServiceResult<T> = {
  ok: boolean;
  data: T | null;
  error: string;
};

let lastError = "";

function setLastError(value: string) {
  lastError = value;
}

export function getLastChatError() {
  return lastError;
}

async function responseError(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return String(data?.error || data?.message || fallback);
  } catch {
    return fallback;
  }
}

export async function getMessages(
  memberId: string,
  otherMemberId: string,
): Promise<ChatMessage[]> {
  setLastError("");

  if (!memberId || !otherMemberId) {
    setLastError("بيانات المحادثة غير مكتملة");
    return [];
  }

  try {
    const response = await fetch(
      `/api/messages/${encodeURIComponent(otherMemberId)}`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      setLastError(await responseError(response, "تعذر تحميل المحادثة"));
      return [];
    }

    const result = await response.json();
    return (result.messages || result.data || []) as ChatMessage[];
  } catch {
    setLastError("تعذر الاتصال بالمحادثة الآن");
    return [];
  }
}

export async function sendTextMessage(
  receiverId: string,
  content: string,
): Promise<ChatServiceResult<ChatMessage>> {
  setLastError("");

  const receiver = String(receiverId || "").trim();
  const text = String(content || "").trim();

  if (!receiver) {
    const error = "المستلم غير صالح";
    setLastError(error);
    return { ok: false, data: null, error };
  }

  if (!text) {
    const error = "اكتب الرسالة أولًا";
    setLastError(error);
    return { ok: false, data: null, error };
  }

  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiver_id: receiver,
        content: text,
      }),
    });

    if (!response.ok) {
      const error = await responseError(response, "تعذر إرسال الرسالة");
      setLastError(error);
      return { ok: false, data: null, error };
    }

    const result = await response.json();
    const message = (result.message || result.data || null) as ChatMessage | null;
    return { ok: Boolean(message), data: message, error: "" };
  } catch {
    const error = "تعذر إرسال الرسالة الآن";
    setLastError(error);
    return { ok: false, data: null, error };
  }
}

export async function sendVoiceMessage(
  receiverId: string,
  audio: File | Blob,
  duration = 0,
): Promise<ChatServiceResult<ChatMessage>> {
  setLastError("");

  const receiver = String(receiverId || "").trim();

  if (!receiver || !audio || audio.size <= 0) {
    const error = "التسجيل الصوتي غير مكتمل";
    setLastError(error);
    return { ok: false, data: null, error };
  }

  if (duration > 60) {
    const error = "مدة الرسالة الصوتية أكبر من الحد المسموح";
    setLastError(error);
    return { ok: false, data: null, error };
  }

  try {
    const form = new FormData();
    form.append("receiver_id", receiver);
    form.append(
      "audio",
      audio instanceof File
        ? audio
        : new File([audio], "voice-message.webm", {
            type: audio.type || "audio/webm",
          }),
    );
    form.append("duration", String(duration || 0));

    const response = await fetch("/api/messages/voice", {
      method: "POST",
      credentials: "include",
      body: form,
    });

    if (!response.ok) {
      const error = await responseError(
        response,
        "تعذر إرسال التسجيل الصوتي",
      );
      setLastError(error);
      return { ok: false, data: null, error };
    }

    const result = await response.json();
    const message = (result.message || result.data || null) as ChatMessage | null;
    return { ok: Boolean(message), data: message, error: "" };
  } catch {
    const error = "تعذر إرسال التسجيل الصوتي الآن";
    setLastError(error);
    return { ok: false, data: null, error };
  }
}

/**
 * واجهة متوافقة مع الملفات القديمة.
 * النص يستخدم API الرسائل العادي.
 * الصوت الصحيح يجب إرساله كـ File/Blob في voiceFile.
 */
export async function sendMessage(
  input: SendMessageInput,
): Promise<ChatMessage | null> {
  if (input.type === "voice") {
    if (!input.voiceFile) {
      setLastError(
        "التسجيل الصوتي يجب إرساله كملف صوتي، وليس كرابط مؤقت.",
      );
      return null;
    }

    const result = await sendVoiceMessage(
      input.receiverId,
      input.voiceFile,
      input.duration,
    );
    return result.data;
  }

  const result = await sendTextMessage(
    input.receiverId,
    String(input.content || ""),
  );
  return result.data;
}

export async function markMessagesRead(
  _memberId: string,
  otherMemberId?: string,
): Promise<void> {
  if (!otherMemberId) return;

  try {
    const response = await fetch("/api/messages/read", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        other_member_id: otherMemberId,
      }),
    });

    if (!response.ok) {
      setLastError(await responseError(response, "تعذر تحديث حالة الرسائل"));
    }
  } catch {
    setLastError("تعذر تحديث حالة قراءة الرسائل");
  }
}

export async function markMessagesAsRead(
  memberId: string,
  otherMemberId?: string,
): Promise<void> {
  return markMessagesRead(memberId, otherMemberId);
}

/**
 * اشتراك لحظي مفلتر على العضو نفسه بدل الاستماع لكل رسائل المنصة.
 * قناتان: الرسائل المرسلة منه + الرسائل المستلمة له.
 */
export function subscribeToMessages(
  memberId: string,
  callback: (message: ChatMessage) => void,
) {
  if (!memberId || typeof window === "undefined") {
    return () => undefined;
  }

  const supabase = getBrowserSupabaseClient();
  const receivedIds = new Set<string>();

  function deliver(payload: { new: unknown }) {
    const message = payload.new as ChatMessage;
    if (!message?.id || receivedIds.has(message.id)) return;

    receivedIds.add(message.id);
    if (receivedIds.size > 500) {
      const first = receivedIds.values().next().value;
      if (first) receivedIds.delete(first);
    }

    callback(message);
  }

  const incoming = supabase
    .channel(`messages-in-${memberId}-${crypto.randomUUID()}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${memberId}`,
      },
      deliver,
    )
    .subscribe();

  const outgoing = supabase
    .channel(`messages-out-${memberId}-${crypto.randomUUID()}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `sender_id=eq.${memberId}`,
      },
      deliver,
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(incoming);
    void supabase.removeChannel(outgoing);
  };
}
