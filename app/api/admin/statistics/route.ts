export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "غير مصرح" }, { status: 403 }); }
  const supabase = createSupabaseAdminClient();

  const [members, activeMembers, subscriptions, messages, reports, pendingPhotos] = await Promise.all([
    supabase.from("members").select("id", { count: "exact", head: true }),
    supabase.from("members").select("id", { count: "exact", head: true }).eq("account_status", "active"),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("messages").select("id", { count: "exact", head: true }),
    supabase.from("reports").select("id", { count: "exact", head: true }),
    supabase.from("photos").select("id", { count: "exact", head: true }).eq("approved", false),
  ]);

  return NextResponse.json({ stats: {
    members: members.count ?? 0,
    activeMembers: activeMembers.count ?? 0,
    subscriptions: subscriptions.count ?? 0,
    messages: messages.count ?? 0,
    reports: reports.count ?? 0,
    pendingPhotos: pendingPhotos.count ?? 0,
  }});
}
