import { createSupabaseAdminClient } from "@/lib/supabase/client";

const SAFE_MEMBER_ID = /^[A-Za-z0-9_-]{1,128}$/;

export function isSafeMemberId(value: unknown): value is string {
  return typeof value === "string" && SAFE_MEMBER_ID.test(value);
}

export async function ensureMessagingAccess(senderId: string, receiverId: string) {
  if (!isSafeMemberId(senderId) || !isSafeMemberId(receiverId) || senderId === receiverId) {
    return "لا يمكن بدء هذه المحادثة";
  }

  const supabase = createSupabaseAdminClient();
  const [{ data: receiver }, { data: settings }, { data: blocks }, { data: match }] = await Promise.all([
    supabase.from("members").select("id,account_status").eq("id", receiverId).maybeSingle(),
    supabase.from("member_settings").select("allow_messages").eq("member_id", receiverId).maybeSingle(),
    supabase
      .from("blocks")
      .select("id")
      .or(
        `and(blocker_id.eq.${senderId},blocked_id.eq.${receiverId}),and(blocker_id.eq.${receiverId},blocked_id.eq.${senderId})`,
      )
      .limit(1),
    supabase
      .from("matches")
      .select("id")
      .or(
        `and(member_one.eq.${senderId},member_two.eq.${receiverId}),and(member_one.eq.${receiverId},member_two.eq.${senderId})`,
      )
      .limit(1)
      .maybeSingle(),
  ]);

  if (!receiver || receiver.account_status === "blocked" || receiver.account_status === "suspended") {
    return "هذا الحساب غير متاح حاليًا";
  }
  if ((blocks || []).length > 0) return "لا يمكن بدء محادثة بين هذين الحسابين";
  if (!match) return "يبدأ التواصل بعد تبادل الاهتمام بين الطرفين";
  if (settings?.allow_messages === false) return "هذا العضو لا يستقبل رسائل جديدة حاليًا";

  return null;
}
