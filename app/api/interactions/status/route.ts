export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: Request) {
  try {
    const memberId = cookies().get("qalbylove_session")?.value;
    const targetId = new URL(request.url).searchParams.get("member_id")?.trim();
    if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
    if (!targetId) return NextResponse.json({ error: "العضو غير موجود" }, { status: 400 });

    const [sent, received, favorite, blocked, match] = await Promise.all([
      supabase.from("interests").select("id,status").eq("sender_id", memberId).eq("receiver_id", targetId).maybeSingle(),
      supabase.from("interests").select("id,status").eq("sender_id", targetId).eq("receiver_id", memberId).maybeSingle(),
      supabase.from("favorites").select("id").eq("user_id", memberId).eq("favorite_id", targetId).maybeSingle(),
      supabase.from("blocks").select("id").eq("blocker_id", memberId).eq("blocked_id", targetId).maybeSingle(),
      supabase.from("matches").select("id").or(`and(member_one.eq.${memberId},member_two.eq.${targetId}),and(member_one.eq.${targetId},member_two.eq.${memberId})`).maybeSingle(),
    ]);

    return NextResponse.json({
      state: {
        interested: Boolean(sent.data),
        favorite: Boolean(favorite.data),
        blocked: Boolean(blocked.data),
        mutual: Boolean(match.data || (sent.data && received.data)),
      },
    });
  } catch (error) {
    console.error("interaction status", error);
    return NextResponse.json({ error: "تعذر تحميل حالة التفاعل" }, { status: 500 });
  }
}
