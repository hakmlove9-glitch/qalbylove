export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  const memberId = (await cookies()).get("qalbylove_session")?.value;
  if (!memberId) return NextResponse.json({ authenticated: false }, { status: 401 });
  const { data: member } = await supabase.from("members").select("id,username,account_status").eq("id", memberId).maybeSingle();
  if (!member || (member.account_status && member.account_status !== "active")) return NextResponse.json({ authenticated: false }, { status: 401 });
  return NextResponse.json({ authenticated: true, member: { id: member.id, username: member.username } });
}
