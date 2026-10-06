export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/create-notification";

const VALID_STATUSES = new Set(["pending", "resolved", "rejected"]);

async function adminSession() {
  try { return await requireAdmin(); } catch { return null; }
}

export async function GET() {
  const admin = await adminSession();
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const supabase = createSupabaseAdminClient();
  const { data: reports, error } = await supabase
    .from("reports")
    .select("id,reporter_id,reported_member_id,reason,details,status,created_at,reviewed_at")
    .order("created_at", { ascending: false })
    .limit(250);

  if (error) return NextResponse.json({ error: "تعذر تحميل البلاغات" }, { status: 500 });

  const ids = [...new Set((reports || []).flatMap((r: any) => [r.reporter_id, r.reported_member_id]).filter(Boolean))];
  const { data: members } = ids.length
    ? await supabase.from("members").select("id,username,account_status,verification_status").in("id", ids)
    : { data: [] as any[] };
  const memberMap = new Map((members || []).map((m: any) => [m.id, m]));

  return NextResponse.json({
    reports: (reports || []).map((report: any) => ({
      ...report,
      reporter: memberMap.get(report.reporter_id) || null,
      reported: memberMap.get(report.reported_member_id) || null,
    })),
  });
}

export async function PUT(request: Request) {
  const admin = await adminSession();
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const body = await request.json();
  const id = String(body.id || "").trim();
  const status = String(body.status || "").trim();
  const action = String(body.action || "").trim();
  if (!id || (!VALID_STATUSES.has(status) && !["warn", "block"].includes(action))) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { data: report } = await supabase.from("reports").select("id,reported_member_id,status,reason").eq("id", id).maybeSingle();
  if (!report) return NextResponse.json({ error: "البلاغ غير موجود" }, { status: 404 });

  if (action === "warn" || action === "block") {
    const { data: target } = await supabase.from("members").select("id,username,is_admin,role,account_status").eq("id", report.reported_member_id).maybeSingle();
    if (!target) return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
    if (target.is_admin || ["admin", "super_admin"].includes(String(target.role || ""))) return NextResponse.json({ error: "لا يمكن تنفيذ الإجراء على حساب إدارة" }, { status: 403 });

    if (action === "warn") {
      const result = await createNotification({ memberId: target.id, content: `تنبيه من إدارة قلبي لوڤي: وصلنا بلاغ بخصوص «${report.reason}». يرجى الالتزام بشروط المنصة واحترام الأعضاء.` });
      if (!result.success) return NextResponse.json({ error: "تعذر إرسال التنبيه" }, { status: 500 });
    } else {
      const { error } = await supabase.from("members").update({ account_status: "blocked" }).eq("id", target.id);
      if (error) return NextResponse.json({ error: "تعذر إيقاف الحساب" }, { status: 500 });
    }

    const { error: reportError } = await supabase.from("reports").update({ status: "resolved", reviewed_at: new Date().toISOString(), reviewed_by: admin.memberId }).eq("id", id);
    if (reportError) return NextResponse.json({ error: "تم الإجراء لكن تعذر تحديث حالة البلاغ" }, { status: 500 });
    await supabase.from("admin_logs").insert({ admin_id: admin.memberId, action: action === "warn" ? "report_member_warned" : "report_member_blocked", target_type: "report", target_id: id, details: { member_id: target.id, reason: report.reason } });
    return NextResponse.json({ success: true });
  }

  const { error } = await supabase
    .from("reports")
    .update({
      status,
      reviewed_at: status === "pending" ? null : new Date().toISOString(),
      reviewed_by: status === "pending" ? null : admin.memberId,
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: "تعذر تحديث البلاغ" }, { status: 500 });

  await supabase.from("admin_logs").insert({
    admin_id: admin.memberId,
    action: "report_status_change",
    target_type: "report",
    target_id: id,
    details: { from: report.status, to: status, reported_member_id: report.reported_member_id },
  });

  return NextResponse.json({ success: true });
}
