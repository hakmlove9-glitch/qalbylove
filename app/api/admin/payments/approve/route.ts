export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { MEMBERSHIP_PLANS } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const { payment_id } = await request.json();
    if (!payment_id) return NextResponse.json({ error: "طلب الدفع غير محدد" }, { status: 400 });

    const supabase = createSupabaseAdminClient();
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("id", payment_id)
      .maybeSingle();

    if (paymentError || !payment) return NextResponse.json({ error: "طلب الدفع غير موجود" }, { status: 404 });
    if (payment.status === "approved" && payment.approved_subscription_id) {
      return NextResponse.json({ success: true, message: "الطلب مفعّل بالفعل" });
    }
    if (payment.status === "rejected") return NextResponse.json({ error: "لا يمكن تفعيل طلب مرفوض قبل مراجعته" }, { status: 409 });

    const plan = MEMBERSHIP_PLANS.find((item) => item.id === payment.requested_tier)
      || MEMBERSHIP_PLANS.find((item) => item.durationMonths === Number(payment.duration_months));
    if (!plan) return NextResponse.json({ error: "تعذر تحديد العضوية المرتبطة بطلب الدفع" }, { status: 400 });

    const { data: active } = await supabase
      .from("subscriptions")
      .select("ends_at")
      .eq("user_id", payment.member_id)
      .eq("status", "active")
      .gte("ends_at", new Date().toISOString())
      .order("ends_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const now = new Date();
    const startsAt = active?.ends_at && new Date(active.ends_at) > now ? new Date(active.ends_at) : now;
    const endsAt = new Date(startsAt);
    endsAt.setMonth(endsAt.getMonth() + plan.durationMonths);

    const { data: dbPlan } = await supabase
      .from("subscription_plans")
      .select("id")
      .eq("tier_id", plan.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();

    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: payment.member_id,
        plan_id: dbPlan?.id || null,
        plan_name: plan.title,
        price: plan.price,
        duration_months: plan.durationMonths,
        status: "active",
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
      })
      .select("id,plan_name,starts_at,ends_at")
      .single();

    if (subscriptionError || !subscription) return NextResponse.json({ error: "تعذر تفعيل العضوية" }, { status: 500 });

    const reviewedAt = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("payments")
      .update({ status: "approved", reviewed_by: admin.memberId, reviewed_at: reviewedAt, approved_subscription_id: subscription.id })
      .eq("id", payment.id)
      .eq("status", "pending");

    if (updateError) {
      await supabase.from("subscriptions").delete().eq("id", subscription.id);
      return NextResponse.json({ error: "تعذر تثبيت الموافقة" }, { status: 500 });
    }

    await Promise.all([
      supabase.from("notifications").insert({ member_id: payment.member_id, message: `تمت مراجعة التحويل وتفعيل ${plan.title} حتى ${endsAt.toLocaleDateString("ar-EG")}.`, read: false }),
      supabase.from("admin_logs").insert({ admin_id: admin.memberId, action: "approve_payment", target_type: "payment", target_id: payment.id, details: { subscription_id: subscription.id, tier: plan.id } }),
    ]);

    return NextResponse.json({ success: true, subscription, message: "تم تفعيل العضوية بنجاح" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "غير مصرح";
    return NextResponse.json({ error: message }, { status: message.includes("مصرح") || message.includes("الدخول") ? 401 : 500 });
  }
}
