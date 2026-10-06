export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

const FOUNDER_LIMIT = 1000;

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();
    const { count, error } = await supabase
      .from("members")
      .select("id", { count: "exact", head: true })
      .eq("is_founder", true);

    if (error) throw error;
    const founders = Math.min(FOUNDER_LIMIT, Math.max(0, count || 0));
    return NextResponse.json(
      { limit: FOUNDER_LIMIT, founders, remaining: Math.max(0, FOUNDER_LIMIT - founders) },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("founders remaining", error);
    return NextResponse.json({ error: "تعذر تحديث عدد المؤسسين" }, { status: 500 });
  }
}
