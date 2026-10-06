export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { getCurrentMemberId } from "@/lib/auth";
import { getMembershipPresentation } from "@/lib/subscription";

export async function GET() {
  try {
    const memberId = await getCurrentMemberId();
    if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const supabase = createSupabaseAdminClient();
    const [{ data: member }, { data: subscription, error }, presentation] = await Promise.all([
      supabase.from("members").select("is_founder,member_number").eq("id", memberId).maybeSingle(),
      supabase
        .from("subscriptions")
        .select("id,user_id,plan_id,plan_name,price,duration_months,status,starts_at,ends_at,created_at")
        .eq("user_id", memberId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      getMembershipPresentation(memberId),
    ]);

    if (error) return NextResponse.json({ error: "تعذر تحميل بيانات العضوية" }, { status: 500 });

    return NextResponse.json({
      founder: member?.is_founder === true,
      memberNumber: member?.member_number ?? null,
      presentation,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error("my-subscription", error);
    return NextResponse.json({ error: "تعذر تحميل بيانات العضوية" }, { status: 500 });
  }
}
