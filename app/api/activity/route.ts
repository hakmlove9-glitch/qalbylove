export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  const cookieStore = await cookies();

  const memberId =
    cookieStore.get("qalbylove_session")?.value;

  if (!memberId) {
    return NextResponse.json(
      { error: "غير مسجل" },
      { status: 401 }
    );
  }

  const { error } = await supabase
    .from("members")
    .update({
      last_seen: new Date().toISOString(),
    })
    .eq("id", memberId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}
