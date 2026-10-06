export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const session = await getCurrentMember();
    if (!session?.memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const body = await request.json();
    const code = String(body.code || "").trim().toUpperCase();
    if (!code || code.length > 80) return NextResponse.json({ error: "اكتب كود تفعيل صحيح" }, { status: 400 });

    const supabase = createSupabaseAdminClient();
    const { data: activation, error: codeError } = await supabase
      .from("subscription_codes")
      .select("id,code,plan_id,plan_months,plan_price,is_used,used_by,expires_at")
      .eq("code", code)
      .maybeSingle();

    if (codeError || !activation) return NextResponse.json({ error: "كود التفعيل غير صحيح" }, { status: 404 });
    if (activation.is_used) return NextResponse.json({ error: "تم استخدام هذا الكود من قبل" }, { status: 409 });
    if (activation.expires_at && new Date(activation.expires_at) < new Date()) return NextResponse.json({ error: "انتهت صلاحية هذا الكود" }, { status: 410 });

    const { data: plan } = await supabase
      .from("subscription_plans")
      .select("id,name,display_name,tier_id,price,duration_months,is_active")
      .eq("id", activation.plan_id)
      .eq("is_active", true)
      .maybeSingle();
    if (!plan) return NextResponse.json({ error: "العضوية المرتبطة بالكود غير متاحة" }, { status: 404 });

    // حجز الكود أولاً بشرط أنه ما زال غير مستخدم، لمنع استخدامه مرتين بالتوازي.
    const usedAt = new Date().toISOString();
    const { data: claimed, error: claimError } = await supabase
      .from("subscription_codes")
      .update({ is_used: true, used_by: session.memberId, used_at: usedAt })
      .eq("id", activation.id)
      .eq("is_used", false)
      .select("id")
      .maybeSingle();
    if (claimError || !claimed) return NextResponse.json({ error: "تم استخدام هذا الكود بالفعل" }, { status: 409 });

    const now = new Date();
    const { data: active } = await supabase
      .from("subscriptions")
      .select("ends_at")
      .eq("user_id", session.memberId)
      .eq("status", "active")
      .gte("ends_at", now.toISOString())
      .order("ends_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const startsAt = active?.ends_at && new Date(active.ends_at) > now ? new Date(active.ends_at) : now;
    const months = Math.max(1, Number(activation.plan_months || plan.duration_months || 1));
    const endsAt = new Date(startsAt);
    endsAt.setMonth(endsAt.getMonth() + months);

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: session.memberId,
        plan_id: plan.id,
        plan_name: plan.display_name || plan.name,
        price: Number(activation.plan_price ?? plan.price ?? 0),
        duration_months: months,
        status: "active",
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
      })
      .select("id,plan_name,status,starts_at,ends_at")
      .single();

    if (subscriptionError || !subscription) {
      await supabase.from("subscription_codes").update({ is_used: false, used_by: null, used_at: null }).eq("id", activation.id).eq("used_by", session.memberId);
      return NextResponse.json({ error: "تعذر تفعيل العضوية" }, { status: 500 });
    }

    await supabase.from("notifications").insert({
      member_id: session.memberId,
      message: `تم تفعيل ${plan.display_name || plan.name} بنجاح حتى ${endsAt.toLocaleDateString("ar-EG")}.`,
      read: false,
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("subscription-activate", error);
    return NextResponse.json({ error: "تعذر تفعيل العضوية الآن" }, { status: 500 });
  }
}
