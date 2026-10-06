import { cookies } from "next/headers";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { verifySession } from "@/lib/session";

export async function getCurrentMemberId() {
  const store = cookies();
  const memberId = store.get("qalbylove_session")?.value;
  const signature = store.get("qalbylove_session_sig")?.value;
  return (await verifySession(memberId, signature)) ? memberId || null : null;
}

export async function getCurrentMember() {
  const memberId = await getCurrentMemberId();
  if (!memberId) return null;

  const supabase = createSupabaseAdminClient();
  const { data: member, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", memberId)
    .maybeSingle();

  if (error || !member || member.account_status === "blocked" || member.account_status === "suspended") {
    return null;
  }

  return { memberId: member.id as string, member };
}

export async function requireMember() {
  const session = await getCurrentMember();
  if (!session) throw new Error("يجب تسجيل الدخول");
  return session;
}

export async function requireAdmin() {
  const session = await requireMember();
  const role = String(session.member.role || "");
  const isAdmin = session.member.is_admin === true || ["admin", "super_admin"].includes(role);
  if (!isAdmin) {
    throw new Error("غير مصرح لك بالدخول إلى لوحة الإدارة");
  }
  return session;
}

export async function getViewerTargetGender() {
  const session = await getCurrentMember();
  if (!session) return null;

  const supabase = createSupabaseAdminClient();
  const { data: details } = await supabase
    .from("member_details")
    .select("gender")
    .eq("member_id", session.memberId)
    .maybeSingle();

  const gender = String(session.member.gender || details?.gender || "");
  if (gender === "male") return "female";
  if (gender === "female") return "male";
  return null;
}

export function oppositeGender(gender: unknown) {
  const value = String(gender || "");
  if (value === "male") return "female";
  if (value === "female") return "male";
  return "";
}
