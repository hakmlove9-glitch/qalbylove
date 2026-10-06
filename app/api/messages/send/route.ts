export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCurrentMemberId } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { containsDirectContactInfo, registerContactViolation } from "@/lib/content-moderation";
import { createNotification } from "@/lib/create-notification";
import { ensureMessagingAccess, isSafeMemberId } from "@/lib/messaging";

export async function POST(request: NextRequest) {
  const senderId = await getCurrentMemberId();
  if (!senderId) return NextResponse.json({ success: false, message: "يجب تسجيل الدخول" }, { status: 401 });

  try {
    const body = await request.json();
    const receiverId = String(body.receiver_id || "").trim();
    const type = String(body.type || "text");
    const content = String(body.content || "").trim();

    if (!isSafeMemberId(receiverId) || receiverId === senderId) {
      return NextResponse.json({ success: false, message: "بيانات المحادثة غير صحيحة" }, { status: 400 });
    }
    if (type !== "text") {
      return NextResponse.json({ success: false, message: "استخدم مسار الرسائل الصوتية للتسجيلات" }, { status: 400 });
    }
    if (!content) return NextResponse.json({ success: false, message: "الرسالة فارغة" }, { status: 400 });
    if (content.length > 4000) return NextResponse.json({ success: false, message: "الرسالة طويلة جدًا" }, { status: 400 });

    if (containsDirectContactInfo(content)) {
      const violation = await registerContactViolation(senderId, "message");
      return NextResponse.json(
        {
          success: false,
          message: violation.suspended
            ? "تم تعليق حسابك مؤقتًا بسبب تكرار محاولة مشاركة بيانات تواصل مباشرة."
            : "تم منع الرسالة: ممنوع مشاركة رقم هاتف أو وسيلة تواصل خارجية. تكرار المخالفة قد يؤدي إلى تعليق الحساب.",
        },
        { status: 403 },
      );
    }

    const restriction = await ensureMessagingAccess(senderId, receiverId);
    if (restriction) return NextResponse.json({ success: false, message: restriction }, { status: 403 });

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        type: "text",
        content,
        voice_url: null,
        is_read: false,
      })
      .select("id,sender_id,receiver_id,content,type,voice_url,is_read,created_at")
      .single();

    if (error) throw error;
    await createNotification({ memberId: receiverId, content: "لديك رسالة جديدة في قلبي لوڤي" });
    return NextResponse.json({ success: true, message: data });
  } catch (error) {
    console.error("legacy-message-send", error);
    return NextResponse.json({ success: false, message: "تعذر إرسال الرسالة الآن" }, { status: 500 });
  }
}
