export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentMember } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function isAdmin(memberId: string) {
  const { data } = await supabase
    .from("members")
    .select("is_admin")
    .eq("id", memberId)
    .single();

  return data?.is_admin;
}

export async function GET() {
  const session = await getCurrentMember();

  if (!session?.memberId || !(await isAdmin(session.memberId))) {
    return NextResponse.json(
      { error: "غير مسموح" },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("admin_logs")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    logs: data || [],
  });
}
