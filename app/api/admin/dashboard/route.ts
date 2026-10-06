export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentMember } from "@/lib/auth";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  const session = await getCurrentMember();
  if (!session?.member?.is_admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const now = new Date().toISOString();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const onlineCutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const [members, todayMembers, onlineMembers, men, women, subscriptions, payments, reports, photos, usedCodes, unusedCodes, pendingRequests, pendingMessages, detailsResult, photosResult, founders] = await Promise.all([
    supabase.from("members").select("id", { count: "exact", head: true }),
    supabase.from("members").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString()),
    supabase.from("members").select("id", { count: "exact", head: true }).eq("account_status", "active").gte("last_seen", onlineCutoff),
    supabase.from("members").select("id", { count: "exact", head: true }).eq("gender", "male"),
    supabase.from("members").select("id", { count: "exact", head: true }).eq("gender", "female"),
    supabase.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active").gte("ends_at", now),
    supabase.from("payments").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("moderation_events").select("id", { count: "exact", head: true }).eq("event_type", "photo").eq("status", "open"),
    supabase.from("subscription_codes").select("id", { count: "exact", head: true }).eq("is_used", true),
    supabase.from("subscription_codes").select("id", { count: "exact", head: true }).eq("is_used", false),
    supabase.from("member_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("member_details").select("member_id,age,governorate,city,country,marital_status,education,job,work_status,height,weight,prayer_status,health_status,bio,partner_specs,interests,personality_traits,housing_plan,marriage_timeline").limit(5000),
    supabase.from("photos").select("member_id").neq("moderation_status", "rejected").limit(5000),
    supabase.from("members").select("id", { count: "exact", head: true }).eq("is_founder", true),
  ]);

  const detailsByMember = new Map((detailsResult.data || []).map((details: any) => [details.member_id, details]));
  const membersPage = await supabase.from("members").select("id,username,account_status").limit(5000);
  const approvedPhotos = new Set((photosResult.data || []).map((photo: any) => photo.member_id));
  const completenessFields = ["age", "city", "marital_status", "education", "job", "height", "weight", "prayer_status", "health_status", "housing_plan", "marriage_timeline", "bio", "partner_specs"] as const;
  const incompleteProfiles = (membersPage.data || []).filter((member: any) => {
    if (member.account_status !== "active") return false;
    const details: any = detailsByMember.get(member.id) || {};
    return completenessFields.some((field) => !details[field])
      || !(details.governorate || details.country)
      || !Array.isArray(details.interests) || details.interests.length < 3
      || !Array.isArray(details.personality_traits) || details.personality_traits.length < 3
      || !approvedPhotos.has(member.id);
  }).length;
  const founderCount = founders.count ?? 0;

  return NextResponse.json({
    stats: {
      members: members.count ?? 0,
      todayMembers: todayMembers.count ?? 0,
      onlineMembers: onlineMembers.count ?? 0,
      men: men.count ?? 0,
      women: women.count ?? 0,
      incompleteProfiles,
      founders: founderCount,
      founderSeats: Math.max(0, 1000 - founderCount),
      activeSubscriptions: subscriptions.count ?? 0,
      pendingPayments: payments.count ?? 0,
      pendingReports: reports.count ?? 0,
      pendingPhotos: photos.count ?? 0,
      usedCodes: usedCodes.count ?? 0,
      unusedCodes: unusedCodes.count ?? 0,
      pendingRequests: pendingRequests.count ?? 0,
      pendingMessages: pendingMessages.count ?? 0,
    },
  });
}
