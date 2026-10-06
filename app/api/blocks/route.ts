export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { getCurrentMemberId } from "@/lib/auth";

export async function GET() {
  const memberId = await getCurrentMemberId();
  if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("blocks")
    .select("id, blocker_id, blocked_id, created_at")
    .eq("blocker_id", memberId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "تعذر تحميل قائمة الحظر" }, { status: 500 });

  const blockedIds = [...new Set((data || []).map((item: any) => item.blocked_id).filter(Boolean))];
  let members: any[] = [];
  if (blockedIds.length) {
    const { data: memberData } = await supabase
      .from("members")
      .select("id,username,account_status")
      .in("id", blockedIds);
    members = memberData || [];
  }

  return NextResponse.json({
    blocks: (data || []).map((block: any) => ({
      ...block,
      member: members.find((member) => member.id === block.blocked_id) || null,
    })),
  });
}

export async function POST(request: Request) {
  const memberId = await getCurrentMemberId();
  if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const body = await request.json();
  const blockedId = String(body.blocked_id || body.blockedId || "").trim();
  if (!blockedId) return NextResponse.json({ error: "العضو غير موجود" }, { status: 400 });
  if (blockedId === memberId) return NextResponse.json({ error: "لا يمكنك حظر نفسك" }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { data: member } = await supabase.from("members").select("id").eq("id", blockedId).maybeSingle();
  if (!member) return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });

  const { data: existing } = await supabase
    .from("blocks")
    .select("id")
    .eq("blocker_id", memberId)
    .eq("blocked_id", blockedId)
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase.from("blocks").insert({ blocker_id: memberId, blocked_id: blockedId });
    if (error) return NextResponse.json({ error: "تعذر حظر العضو الآن" }, { status: 500 });
  }

  // الحظر يوقف أي محادثة نشطة بين الطرفين على مستوى الواجهة والمنطق.
  return NextResponse.json({ success: true, alreadyBlocked: Boolean(existing), message: "تم حظر العضو" });
}

export async function DELETE(request: Request) {
  const memberId = await getCurrentMemberId();
  if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const body = await request.json();
  const blockedId = String(body.blocked_id || body.blockedId || "").trim();
  if (!blockedId) return NextResponse.json({ error: "العضو غير موجود" }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("blocks")
    .delete()
    .eq("blocker_id", memberId)
    .eq("blocked_id", blockedId);

  if (error) return NextResponse.json({ error: "تعذر إلغاء الحظر الآن" }, { status: 500 });
  return NextResponse.json({ success: true, message: "تم إلغاء حظر العضو" });
}
