export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

async function adminSession() {
  try { return await requireAdmin(); } catch { return null; }
}

export async function GET() {
  const admin = await adminSession();
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) return NextResponse.json({ error: "تعذر تحميل الإعدادات" }, { status: 500 });
  return NextResponse.json({ settings: data || null });
}

export async function PUT(request: Request) {
  const admin = await adminSession();
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const siteName = String(body.siteName || "").trim().slice(0, 80);
  if (!siteName) return NextResponse.json({ error: "اسم الموقع مطلوب" }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    site_name: siteName,
    assistants_enabled: body.assistants === true,
  });
  if (error) return NextResponse.json({ error: "تعذر حفظ الإعدادات" }, { status: 500 });

  await supabase.from("admin_logs").insert({
    admin_id: admin.memberId,
    action: "site_settings_update",
    target_type: "site_settings",
    target_id: "1",
    details: { site_name: siteName, assistants_enabled: body.assistants === true },
  });

  return NextResponse.json({ success: true });
}
