export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();
    const paymentId = String(body.payment_id || "").trim();
    const reason = String(body.reason || "").trim().slice(0, 500);
    if (!paymentId) return NextResponse.json({ error: "طلب الدفع غير محدد" }, { status: 400 });

    const supabase = createSupabaseAdminClient();
    const { data: payment } = await supabase.from("payments").select("id,member_id,status").eq("id", paymentId).maybeSingle();
    if (!payment) return NextResponse.json({ error: "طلب الدفع غير موجود" }, { status: 404 });
    if (payment.status === "approved") return NextResponse.json({ error: "لا يمكن رفض طلب تم تفعيله" }, { status: 409 });

    const { error } = await supabase
      .from("payments")
      .update({ status: "rejected", rejection_reason: reason || null, reviewed_by: admin.memberId, reviewed_at: new Date().toISOString() })
      .eq("id", paymentId);
    if (error) return NextResponse.json({ error: "تعذر رفض الطلب" }, { status: 500 });

    await Promise.all([
      supabase.from("notifications").insert({ member_id: payment.member_id, message: reason ? `تعذر اعتماد طلب الدفع: ${reason}` : "تعذر اعتماد طلب الدفع. راجع بيانات التحويل ثم أرسل طلبًا جديدًا.", read: false }),
      supabase.from("admin_logs").insert({ admin_id: admin.memberId, action: "reject_payment", target_type: "payment", target_id: paymentId, details: { reason: reason || null } }),
    ]);

    return NextResponse.json({ success: true, message: "تم رفض الطلب" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "غير مصرح";
    return NextResponse.json({ error: message }, { status: message.includes("مصرح") || message.includes("الدخول") ? 401 : 500 });
  }
}
