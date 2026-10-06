export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function safeCount(table: string, configure: (query: any) => any) {
  try {
    const query = configure(supabase.from(table).select("*", { count: "exact", head: true }));
    const { count, error } = await query;
    if (error) return 0;
    return count || 0;
  } catch {
    return 0;
  }
}

export async function GET() {
  try {
    const memberId = cookies().get("qalbylove_session")?.value;
    if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const onlineCutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();

    const [{ data: currentMember }, { data: currentDetails }] = await Promise.all([
      supabase.from("members").select("gender").eq("id", memberId).maybeSingle(),
      supabase.from("member_details").select("gender").eq("member_id", memberId).maybeSingle(),
    ]);
    const currentGender = String(currentMember?.gender || currentDetails?.gender || "");
    const targetGender = currentGender === "male" ? "female" : currentGender === "female" ? "male" : "";

    const [messages, notificationsUnread, interests, views, online, matches] = await Promise.all([
      safeCount("messages", (query) => query.eq("receiver_id", memberId).eq("is_read", false)),
      safeCount("notifications", (query) => query.eq("member_id", memberId).eq("read", false)),
      safeCount("interests", (query) => query.eq("receiver_id", memberId)),
      safeCount("profile_views", (query) => query.eq("member_id", memberId)),
      safeCount("members", (query) => query.gte("last_seen", onlineCutoff).neq("id", memberId)),
      safeCount("matches", (query) => query.or(`member_one.eq.${memberId},member_two.eq.${memberId}`)),
    ]);

    const { data: candidateMembers } = await supabase
      .from("members")
      .select("id,username,last_seen,created_at,gender")
      .neq("id", memberId)
      .neq("account_status", "blocked")
      .order("last_seen", { ascending: false, nullsFirst: false })
      .limit(40);

    const candidateIds = (candidateMembers || []).map((row: any) => row.id);
    const { data: candidateDetails } = candidateIds.length
      ? await supabase.from("member_details").select("*").in("member_id", candidateIds)
      : { data: [] as any[] };

    const candidateDetailMap = new Map<string, any>();
    for (const detail of (candidateDetails || []) as any[]) {
      if (detail?.member_id) candidateDetailMap.set(detail.member_id, detail);
    }

    const suggestedMembers = (candidateMembers || [])
      .filter((member: any) => {
        if (!targetGender) return true;
        const detailGender = String(candidateDetailMap.get(member.id)?.gender || member.gender || "");
        return detailGender === targetGender;
      })
      .slice(0, 8);

    const detailMap = candidateDetailMap;

    const suggestions = (suggestedMembers || []).map((member: any, index: number) => ({
      ...member,
      ...(detailMap.get(member.id) || {}),
      id: member.id,
      username: member.username,
      is_online: Boolean(member.last_seen && String(member.last_seen) >= onlineCutoff),
      match_score: 96 - (index % 6) * 3,
    }));

    return NextResponse.json({
      stats: {
        messages,
        notifications: notificationsUnread,
        interests,
        views,
        online,
        matches,
      },
      suggestions,
    });
  } catch (error) {
    console.error("dashboard api", error);
    return NextResponse.json({
      stats: { messages: 0, notifications: 0, interests: 0, views: 0, online: 0, matches: 0 },
      suggestions: [],
    });
  }
}
