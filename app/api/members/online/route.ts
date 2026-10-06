export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireMember } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

export async function POST() {
  let session;
  try { session = await requireMember(); } catch { return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 }); }

  const supabase = createSupabaseAdminClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("members")
    .update({ last_seen: now, online: true })
    .eq("id", session.memberId)
    .select("id,last_seen,online")
    .single();

  if (error) return NextResponse.json({ error: "تعذر تحديث حالة الاتصال" }, { status: 500 });
  return NextResponse.json({ success: true, member: data });
}
