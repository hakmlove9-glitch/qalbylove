export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getCurrentMemberId } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { isSafeMemberId } from "@/lib/messaging";

export async function POST(request: NextRequest) {
  const memberId = await getCurrentMemberId();
  if (!memberId) return NextResponse.json({ success: false, message: "يجب تسجيل الدخول" }, { status: 401 });

  try {
    const body = await request.json();
    const senderId = String(body.sender_id || "").trim();
    if (!isSafeMemberId(senderId)) {
      return NextResponse.json({ success: false, message: "بيانات القراءة غير مكتملة" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("receiver_id", memberId)
      .eq("sender_id", senderId)
      .eq("is_read", false);

    if (error) return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("messages-read", error);
    return NextResponse.json({ success: false, message: "تعذر تحديث حالة الرسائل" }, { status: 500 });
  }
}
