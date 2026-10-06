export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { isSafeMemberId } from "@/lib/messaging";

const VALID_STATUSES = new Set(["active", "blocked", "suspended", "deactivated"]);

async function adminSession() {
  try { return await requireAdmin(); } catch { return null; }
}

function profileCompletion(member: any, details: any, photos: any[]) {
  const checks = [
    Boolean(member?.username), Boolean(details?.age), Boolean(details?.country || details?.governorate), Boolean(details?.city),
    Boolean(details?.marital_status), Boolean(details?.education), Boolean(details?.job || details?.work_status),
    Boolean(details?.height), Boolean(details?.weight), Boolean(details?.prayer_status), Boolean(details?.health_status),
    Boolean(details?.housing_plan), Boolean(details?.marriage_timeline), Boolean(details?.bio), Boolean(details?.partner_specs),
    Array.isArray(details?.interests) && details.interests.length >= 3,
    Array.isArray(details?.personality_traits) && details.personality_traits.length >= 3,
    photos.some((photo: any) => photo.moderation_status === "approved"),
  ];
  const complete = checks.filter(Boolean).length;
  return { percentage: Math.round((complete / checks.length) * 100), complete, total: checks.length };
}

export async function GET(request: Request) {
  const admin = await adminSession();
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const supabase = createSupabaseAdminClient();
  const params = new URL(request.url).searchParams;
  const memberId = String(params.get("id") || "").trim();

  if (memberId) {
    if (!isSafeMemberId(memberId)) return NextResponse.json({ error: "معرف العضو غير صالح" }, { status: 400 });
    const [{ data: member }, { data: details }, { data: photos }, { data: subscriptions }, { data: codes }, { data: reports }, { data: blocks }, { data: messages }] = await Promise.all([
      supabase.from("members").select("id,username,email,member_number,account_status,role,is_admin,is_founder,verification_status,membership_tier,created_at,last_seen").eq("id", memberId).maybeSingle(),
      supabase.from("member_details").select("*").eq("member_id", memberId).maybeSingle(),
      supabase.from("photos").select("id,image_url,is_primary,moderation_status,moderation_reason,created_at").eq("member_id", memberId).order("created_at", { ascending: false }).limit(40),
      supabase.from("subscriptions").select("id,plan_name,price,status,starts_at,ends_at,duration_months,created_at").eq("user_id", memberId).order("created_at", { ascending: false }).limit(20),
      supabase.from("subscription_codes").select("id,code,plan_id,is_used,used_at,created_at,expires_at").eq("used_by", memberId).order("used_at", { ascending: false }).limit(50),
      supabase.from("reports").select("id,reporter_id,reported_member_id,reason,details,status,created_at").or(`reporter_id.eq.${memberId},reported_member_id.eq.${memberId}`).order("created_at", { ascending: false }).limit(50),
      supabase.from("blocks").select("id,blocker_id,blocked_id,created_at").or(`blocker_id.eq.${memberId},blocked_id.eq.${memberId}`).limit(100),
      supabase.from("messages").select("id,sender_id,receiver_id,created_at").or(`sender_id.eq.${memberId},receiver_id.eq.${memberId}`).order("created_at", { ascending: false }).limit(1),
    ]);
    if (!member) return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
    const safePhotos = photos || [];
    return NextResponse.json({
      member,
      details: details || null,
      photos: safePhotos,
      completion: profileCompletion(member, details, safePhotos),
      subscriptions: subscriptions || [],
      codes: codes || [],
      reports: reports || [],
      blocks: blocks || [],
      lastActivity: messages?.[0]?.created_at || member.last_seen || null,
    });
  }

  const { data, error } = await supabase
    .from("members")
    .select("id,username,email,member_number,account_status,role,is_admin,is_founder,verification_status,membership_tier,created_at,last_seen,gender")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) return NextResponse.json({ error: "تعذر تحميل الأعضاء" }, { status: 500 });
  const memberIds = (data || []).map((member) => member.id);
  const { data: detailsRows } = memberIds.length
    ? await supabase.from("member_details").select("member_id,full_name,phone,phone_normalized,gender,city,governorate,country").in("member_id", memberIds)
    : { data: [] as any[] };
  const detailMap = new Map((detailsRows || []).map((details: any) => [details.member_id, details]));

  const query = String(params.get("q") || "").trim().toLowerCase();
  const gender = String(params.get("gender") || "").trim();
  const status = String(params.get("status") || "").trim();
  const location = String(params.get("location") || "").trim().toLowerCase();
  const from = String(params.get("from") || "").trim();
  const to = String(params.get("to") || "").trim();
  const members = (data || []).map((member: any) => ({ ...member, ...(detailMap.get(member.id) || {}) })).filter((member: any) => {
    if (query && ![member.username, member.email, member.full_name, member.phone, member.phone_normalized, String(member.member_number || "")].some((value) => String(value || "").toLowerCase().includes(query))) return false;
    if (gender && String(member.gender || "") !== gender) return false;
    if (status && String(member.account_status || "") !== status) return false;
    if (location && ![member.city, member.governorate, member.country].some((value) => String(value || "").toLowerCase().includes(location))) return false;
    if (from && String(member.created_at || "") < from) return false;
    if (to && String(member.created_at || "").slice(0, 10) > to) return false;
    return true;
  });
  return NextResponse.json({ members });
}

export async function PUT(request: Request) {
  const admin = await adminSession();
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const body = await request.json();
  const id = String(body.id || "").trim();
  const membershipTier = String(body.membership_tier || "").trim();
  if (id && membershipTier) {
    if (!new Set(["basic", "silver", "gold", "diamond", "royal"]).has(membershipTier)) {
      return NextResponse.json({ error: "نوع العضوية غير صالح" }, { status: 400 });
    }
    const supabase = createSupabaseAdminClient();
    const { data: target } = await supabase.from("members").select("id,membership_tier,is_admin,role").eq("id", id).maybeSingle();
    if (!target) return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
    if (target.is_admin || ["admin", "super_admin"].includes(String(target.role || ""))) return NextResponse.json({ error: "لا يمكن تغيير عضوية حساب إدارة" }, { status: 403 });
    const { error } = await supabase.from("members").update({ membership_tier: membershipTier }).eq("id", id);
    if (error) return NextResponse.json({ error: "تعذر تحديث العضوية" }, { status: 500 });
    await supabase.from("admin_logs").insert({ admin_id: admin.memberId, action: "member_membership_change", target_type: "member", target_id: id, details: { from: target.membership_tier, to: membershipTier } });
    return NextResponse.json({ success: true });
  }
  const status = String(body.status || "").trim();
  if (!id || !VALID_STATUSES.has(status)) return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  if (id === admin.memberId && status !== "active") {
    return NextResponse.json({ error: "لا يمكنك إيقاف حساب الإدارة الذي تستخدمه الآن" }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: target } = await supabase.from("members").select("id,account_status,role,is_admin").eq("id", id).maybeSingle();
  if (!target) return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
  if (target.is_admin || ["admin", "super_admin"].includes(String(target.role || ""))) return NextResponse.json({ error: "لا يمكن تغيير حالة حساب إدارة من هذه الشاشة" }, { status: 403 });

  const { error } = await supabase.from("members").update({ account_status: status }).eq("id", id);
  if (error) return NextResponse.json({ error: "تعذر تحديث حالة العضو" }, { status: 500 });

  await supabase.from("admin_logs").insert({
    admin_id: admin.memberId,
    action: "member_status_change",
    target_type: "member",
    target_id: id,
    details: { from: target.account_status, to: status },
  });

  return NextResponse.json({ success: true });
}
