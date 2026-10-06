import { createSupabaseAdminClient } from "@/lib/supabase/client";

export type NotificationData = {
  memberId: string;
  content: string;
  type?: string;
  actionUrl?: string | null;
};

export async function createNotification({
  memberId,
  content,
  type = "general",
  actionUrl = null,
}: NotificationData) {
  const cleanMemberId = String(memberId || "").trim();
  const cleanContent = String(content || "").trim();

  if (!cleanMemberId || !cleanContent) {
    return {
      success: false,
      error: "بيانات الإشعار ناقصة",
    } as const;
  }

  const supabase = createSupabaseAdminClient();

  const payload: Record<string, unknown> = {
    member_id: cleanMemberId,
    content: cleanContent,
    is_read: false,
  };

  // بعض النسخ القديمة من الجدول لا تحتوي النوع والرابط؛
  // لذلك نجرب الحقول الموسعة أولاً ثم نعود للبنية الأساسية بأمان.
  const extendedPayload = {
    ...payload,
    type,
    action_url: actionUrl,
  };

  let result = await supabase
    .from("notifications")
    .insert(extendedPayload)
    .select()
    .single();

  if (
    result.error &&
    /column|schema cache|action_url|type/i.test(result.error.message)
  ) {
    result = await supabase
      .from("notifications")
      .insert(payload)
      .select()
      .single();
  }

  if (result.error) {
    return {
      success: false,
      error: result.error.message,
    } as const;
  }

  return {
    success: true,
    notification: result.data,
  } as const;
}
