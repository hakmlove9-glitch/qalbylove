export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

export async function GET() {
  const session = await getCurrentMember();
  if (!session?.memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("payments")
    .select("id,amount,plan_name,wallet_network,sender_wallet,status,rejection_reason,created_at")
    .eq("member_id", session.memberId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "تعذر تحميل طلبات الدفع" }, { status: 500 });
  return NextResponse.json({ payments: data || [] });
}
