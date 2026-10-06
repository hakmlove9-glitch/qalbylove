export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const FOUNDER_LIMIT = 1000;

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json({ count: 0, remaining: FOUNDER_LIMIT, limit: FOUNDER_LIMIT, open: true });
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { count, error } = await supabase
      .from("members")
      .select("id", { count: "exact", head: true })
      .eq("is_founder", true);

    if (error) throw error;

    const founderCount = Math.min(Number(count || 0), FOUNDER_LIMIT);
    return NextResponse.json(
      {
        count: founderCount,
        remaining: Math.max(0, FOUNDER_LIMIT - founderCount),
        limit: FOUNDER_LIMIT,
        open: founderCount < FOUNDER_LIMIT,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("founder stats", error);
    return NextResponse.json({ count: 0, remaining: FOUNDER_LIMIT, limit: FOUNDER_LIMIT, open: true });
  }
}
