export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { getCurrentMemberId } from "@/lib/auth";

const ALLOWED_REASONS = new Set([
  "طلب أموال أو تحويلات مالية",
  "ابتزاز أو تهديد",
  "حساب مزيف أو انتحال شخصية",
  "إساءة أو مضايقة",
  "محتوى غير مناسب",
  "محاولة احتيال أو سلوك مريب",
  "سبب آخر",
]);

export async function GET() {
  const reporterId = await getCurrentMemberId();
  if (!reporterId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("reports")
    .select("id, reported_member_id, reason, details, status, created_at, reviewed_at")
    .eq("reporter_id", reporterId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return NextResponse.json({ error: "تعذر تحميل البلاغات" }, { status: 500 });
  return NextResponse.json({ reports: data || [] });
}

export async function POST(request: Request) {
  try {
    const reporterId = await getCurrentMemberId();
    if (!reporterId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const body = await request.json();
    const reportedId = String(body.reportedId || body.reported_member_id || "").trim();
    const reason = String(body.reason || "").trim();
    const details = String(body.details || "").trim().slice(0, 700);

    if (!reportedId || !ALLOWED_REASONS.has(reason)) {
      return NextResponse.json({ error: "اختر سبب بلاغ صحيح" }, { status: 400 });
    }
    if (reportedId === reporterId) return NextResponse.json({ error: "لا يمكنك الإبلاغ عن حسابك" }, { status: 400 });

    const supabase = createSupabaseAdminClient();
    const { data: target } = await supabase
      .from("members")
      .select("id,account_status")
      .eq("id", reportedId)
      .maybeSingle();

    if (!target) return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });

    // منع إساءة استخدام زر البلاغ وإغراق الإدارة بنفس البلاغات المتكررة.
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count: recentCount } = await supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("reporter_id", reporterId)
      .gte("created_at", tenMinutesAgo);

    if ((recentCount || 0) >= 5) {
      return NextResponse.json({ error: "تم استلام عدة بلاغات منك مؤخرًا. انتظر قليلًا قبل إرسال بلاغ جديد." }, { status: 429 });
    }

    const { data: duplicate } = await supabase
      .from("reports")
      .select("id")
      .eq("reporter_id", reporterId)
      .eq("reported_member_id", reportedId)
      .eq("status", "pending")
      .maybeSingle();

    if (duplicate) {
      return NextResponse.json({ success: true, alreadyReported: true, message: "بلاغك عن هذا العضو قيد المراجعة بالفعل" });
    }

    const { error } = await supabase.from("reports").insert({
      reporter_id: reporterId,
      reported_member_id: reportedId,
      reason,
      details: details || null,
      status: "pending",
    });

    if (error) return NextResponse.json({ error: "تعذر إرسال البلاغ الآن" }, { status: 500 });
    return NextResponse.json({ success: true, message: "تم إرسال البلاغ للإدارة للمراجعة بسرية" });
  } catch (error) {
    console.error("report", error);
    return NextResponse.json({ error: "تعذر إرسال البلاغ الآن" }, { status: 500 });
  }
}
