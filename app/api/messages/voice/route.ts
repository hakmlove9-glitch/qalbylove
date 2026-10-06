export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCurrentMemberId } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/create-notification";
import { ensureMessagingAccess, isSafeMemberId } from "@/lib/messaging";

const ALLOWED = new Set(["audio/webm", "audio/ogg", "audio/mp4", "audio/mpeg", "audio/wav"]);
const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  const senderId = await getCurrentMemberId();
  if (!senderId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  try {
    const form = await request.formData();
    const receiverId = String(form.get("receiver_id") || "").trim();
    const file = form.get("audio");

    if (!isSafeMemberId(receiverId) || receiverId === senderId) {
      return NextResponse.json({ error: "المستلم غير صالح" }, { status: 400 });
    }
    if (!(file instanceof File)) return NextResponse.json({ error: "لم يتم العثور على التسجيل الصوتي" }, { status: 400 });

    const baseType = file.type.split(";")[0].toLowerCase();
    if (!ALLOWED.has(baseType)) return NextResponse.json({ error: "صيغة التسجيل غير مدعومة" }, { status: 400 });
    if (file.size <= 0 || file.size > MAX_BYTES) return NextResponse.json({ error: "حجم التسجيل الصوتي غير مناسب" }, { status: 400 });

    const restriction = await ensureMessagingAccess(senderId, receiverId);
    if (restriction) return NextResponse.json({ error: restriction }, { status: 403 });

    const supabase = createSupabaseAdminClient();
    const extension = baseType.includes("ogg")
      ? "ogg"
      : baseType.includes("mp4")
        ? "m4a"
        : baseType.includes("mpeg")
          ? "mp3"
          : baseType.includes("wav")
            ? "wav"
            : "webm";
    const path = `${senderId}/${receiverId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage.from("voice-messages").upload(path, bytes, {
      contentType: baseType,
      upsert: false,
      cacheControl: "3600",
    });
    if (uploadError) return NextResponse.json({ error: `تعذر رفع التسجيل: ${uploadError.message}` }, { status: 500 });

    const { data: message, error: insertError } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content: "رسالة صوتية",
        type: "voice",
        voice_url: path,
        is_read: false,
      })
      .select("id,sender_id,receiver_id,content,type,voice_url,is_read,created_at")
      .single();

    if (insertError) {
      await supabase.storage.from("voice-messages").remove([path]);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    await createNotification({ memberId: receiverId, content: "وصلتك رسالة صوتية جديدة في قلبي لوڤي" });
    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("voice-message", error);
    return NextResponse.json({ error: "تعذر إرسال التسجيل الصوتي" }, { status: 500 });
  }
}
