export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentMember } from "@/lib/auth";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function adminSession() {
  const session = await getCurrentMember();
  return session?.member?.is_admin ? session : null;
}

export async function GET() {
  if (!(await adminSession())) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { data, error } = await supabase
    .from("subscriptions")
    .select("id,user_id,plan_id,plan_name,price,duration_months,status,starts_at,ends_at,created_at")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const memberIds = Array.from(new Set((data ?? []).map((item) => item.user_id)));
  const { data: members } = memberIds.length
    ? await supabase.from("members").select("id,username,email,member_number").in("id", memberIds)
    : { data: [] as any[] };
  const memberMap = new Map((members ?? []).map((member: any) => [member.id, member]));

  return NextResponse.json({ subscriptions: (data ?? []).map((item) => ({ ...item, member: memberMap.get(item.user_id) ?? null })) });
}

export async function PATCH(request: Request) {
  const admin = await adminSession();
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const body = await request.json();
  const id = String(body.id || "");
  const status = String(body.status || "");
  if (!id || !["active", "paused", "cancelled", "expired"].includes(status)) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

  const { error } = await supabase.from("subscriptions").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("admin_logs").insert({ admin_id: admin.memberId, action: "subscription_status_change", details: { subscription_id: id, status } });
  return NextResponse.json({ success: true });
}
