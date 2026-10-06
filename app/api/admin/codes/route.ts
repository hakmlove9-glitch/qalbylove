export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentMember } from "@/lib/auth";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCode() {
  return `QL-${Array.from({ length: 8 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("")}`;
}

async function requireAdmin() {
  const session = await getCurrentMember();
  return session?.member?.is_admin ? session : null;
}

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const { data, error } = await supabase
    .from("subscription_codes")
    .select("id,code,plan_id,plan_months,plan_price,is_used,used_by,created_at,used_at,expires_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const usedIds = [...new Set((data || []).map((item) => item.used_by).filter(Boolean))];
  const { data: members } = usedIds.length
    ? await supabase.from("members").select("id,username,email,member_number").in("id", usedIds)
    : { data: [] as any[] };
  const memberMap = new Map((members || []).map((member: any) => [member.id, member]));
  const codes = (data || []).map((item) => ({ ...item, used_by_member: item.used_by ? memberMap.get(item.used_by) || null : null }));
  const params = new URL(request.url).searchParams;
  const query = String(params.get("q") || "").trim().toLowerCase();
  const status = String(params.get("status") || "");
  const filtered = codes.filter((item: any) => {
    if (status === "used" && !item.is_used) return false;
    if (status === "unused" && item.is_used) return false;
    if (!query) return true;
    const member = item.used_by_member || {};
    return [item.code, member.username, member.email, String(member.member_number || ""), item.used_by].some((value) => String(value || "").toLowerCase().includes(query));
  });
  return NextResponse.json({ codes: filtered });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const body = await request.json();
  const planId = String(body.plan_id || "");
  const quantity = Math.min(Math.max(Number(body.quantity || 1), 1), 50);
  const expiresInDays = Math.min(Math.max(Number(body.expires_in_days || 60), 1), 365);

  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("id,name,price,duration_months")
    .eq("id", planId)
    .eq("is_active", true)
    .maybeSingle();

  if (!plan) return NextResponse.json({ error: "اختر باقة صحيحة" }, { status: 400 });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const rows = [];
  for (let index = 0; index < quantity; index += 1) {
    let code = makeCode();
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const { data: existing } = await supabase.from("subscription_codes").select("id").eq("code", code).maybeSingle();
      if (!existing) break;
      code = makeCode();
    }
    rows.push({
      code,
      plan_id: plan.id,
      plan_months: plan.duration_months,
      plan_price: plan.price,
      is_used: false,
      expires_at: expiresAt.toISOString(),
      created_by: admin.memberId,
    });
  }

  const { data: created, error } = await supabase.from("subscription_codes").insert(rows).select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("admin_logs").insert({
    admin_id: admin.memberId,
    action: "generate_subscription_codes",
    details: { plan_id: plan.id, plan_name: plan.name, quantity },
  });

  return NextResponse.json({ success: true, codes: created ?? [], plan });
}
