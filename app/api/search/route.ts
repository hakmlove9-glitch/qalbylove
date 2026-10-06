export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { normalizePhotoVisibility, type PhotoVisibility } from "@/lib/photo-privacy";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

type Mode = "all" | "online" | "new" | "premium" | "founders";

function onlineFromLastSeen(lastSeen?: string | null) {
  if (!lastSeen) return false;
  const timestamp = new Date(lastSeen).getTime();
  if (!Number.isFinite(timestamp)) return false;
  return Date.now() - timestamp <= 10 * 60 * 1000;
}

function normalizeHealth(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

async function loadApprovedPhotoMeta(memberIds: string[]) {
  const primary = new Map<string, string>();
  const counts = new Map<string, number>();
  if (!memberIds.length) return { primary, counts };

  const modern = await supabase
    .from("photos")
    .select("member_id,image_url,is_primary,moderation_status")
    .in("member_id", memberIds)
    .eq("moderation_status", "approved");

  if (!modern.error && modern.data) {
    for (const photo of modern.data as any[]) {
      if (!photo?.member_id) continue;
      counts.set(photo.member_id, (counts.get(photo.member_id) || 0) + 1);
      if (photo.image_url && (!primary.has(photo.member_id) || photo.is_primary)) {
        primary.set(photo.member_id, photo.image_url);
      }
    }
    return { primary, counts };
  }

  const legacy = await supabase
    .from("photos")
    .select("user_id,url,is_primary,status")
    .in("user_id", memberIds)
    .eq("status", "approved");

  for (const photo of (legacy.data || []) as any[]) {
    if (!photo?.user_id) continue;
    counts.set(photo.user_id, (counts.get(photo.user_id) || 0) + 1);
    if (photo.url && (!primary.has(photo.user_id) || photo.is_primary)) {
      primary.set(photo.user_id, photo.url);
    }
  }

  return { primary, counts };
}

async function loadPremiumIds(memberIds: string[]) {
  const premium = new Set<string>();
  if (!memberIds.length) return premium;

  const now = new Date().toISOString();
  const activeSubscriptions = await supabase
    .from("subscriptions")
    .select("user_id,status,ends_at")
    .in("user_id", memberIds)
    .eq("status", "active");

  for (const row of (activeSubscriptions.data || []) as any[]) {
    if (!row?.user_id) continue;
    if (!row.ends_at || String(row.ends_at) >= now) premium.add(row.user_id);
  }

  const userSubscriptions = await supabase
    .from("user_subscriptions")
    .select("user_id,is_premium,end_date")
    .in("user_id", memberIds)
    .eq("is_premium", true);

  for (const row of (userSubscriptions.data || []) as any[]) {
    if (!row?.user_id) continue;
    if (!row.end_date || String(row.end_date) >= now.slice(0, 10)) premium.add(row.user_id);
  }

  return premium;
}

async function loadPhotoVisibility(memberIds: string[]) {
  const map = new Map<string, PhotoVisibility>();
  if (!memberIds.length) return map;
  const { data } = await supabase
    .from("member_settings")
    .select("member_id,photo_visibility")
    .in("member_id", memberIds);
  for (const row of (data || []) as any[]) {
    map.set(row.member_id, normalizePhotoVisibility(row.photo_visibility));
  }
  return map;
}

async function loadViewerPhotoPermissions(viewerId: string | undefined, ownerIds: string[]) {
  const allowed = new Set<string>();
  if (!viewerId || !ownerIds.length) return allowed;

  const [{ data: viewer }, { data: matches }, { data: sent }, { data: received }, { data: requests }] =
    await Promise.all([
      supabase.from("members").select("role,is_admin").eq("id", viewerId).maybeSingle(),
      supabase
        .from("matches")
        .select("member_one,member_two")
        .or(`member_one.eq.${viewerId},member_two.eq.${viewerId}`),
      supabase.from("interests").select("receiver_id").eq("sender_id", viewerId).in("receiver_id", ownerIds),
      supabase.from("interests").select("sender_id").eq("receiver_id", viewerId).in("sender_id", ownerIds),
      supabase
        .from("photo_access_requests")
        .select("owner_id,status")
        .eq("requester_id", viewerId)
        .in("owner_id", ownerIds),
    ]);

  if (viewer?.is_admin === true || ["admin", "super_admin"].includes(String(viewer?.role || ""))) {
    ownerIds.forEach((id) => allowed.add(id));
    return allowed;
  }

  const sentSet = new Set((sent || []).map((row: any) => row.receiver_id));
  const receivedSet = new Set((received || []).map((row: any) => row.sender_id));
  const mutualInterest = new Set(ownerIds.filter((id) => sentSet.has(id) && receivedSet.has(id)));

  for (const row of (matches || []) as any[]) {
    const other = row.member_one === viewerId ? row.member_two : row.member_one;
    if (other) mutualInterest.add(other);
  }

  for (const id of mutualInterest) allowed.add(id);
  for (const row of (requests || []) as any[]) {
    if (row.status === "approved") allowed.add(row.owner_id);
  }

  return allowed;
}

export async function GET(request: Request) {
  try {
    const sessionId = cookies().get("qalbylove_session")?.value;
    const url = new URL(request.url);
    const mode = (url.searchParams.get("mode") || "all") as Mode;
    const city = (url.searchParams.get("city") || "").trim();
    const gender = (url.searchParams.get("gender") || "").trim();
    const health = (url.searchParams.get("health") || "").trim();
    const minAge = Number(url.searchParams.get("minAge") || 0);
    const maxAge = Number(url.searchParams.get("maxAge") || 0);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 60), 1), 80);

    let forcedGender = "";
    if (sessionId) {
      const [{ data: viewer }, { data: viewerDetails }] = await Promise.all([
        supabase.from("members").select("gender").eq("id", sessionId).maybeSingle(),
        supabase.from("member_details").select("gender").eq("member_id", sessionId).maybeSingle(),
      ]);
      const viewerGender = String(viewer?.gender || viewerDetails?.gender || "");
      if (viewerGender === "male") forcedGender = "female";
      if (viewerGender === "female") forcedGender = "male";
    }

    let memberQuery = supabase
      .from("members")
      .select("id,username,member_number,account_status,created_at,last_seen,is_founder,membership_tier,verification_status")
      .eq("account_status", "active")
      .order("created_at", { ascending: false })
      .limit(120);

    if (sessionId) memberQuery = memberQuery.neq("id", sessionId);

    const { data: memberRows, error: memberError } = await memberQuery;
    if (memberError) {
      return NextResponse.json({ error: "تعذر تحميل الأعضاء الآن" }, { status: 500 });
    }

    const memberIds = (memberRows || []).map((member: any) => member.id);
    if (!memberIds.length) return NextResponse.json({ members: [] });

    const [{ data: detailRows }, { data: settingsRows }, { data: verifiedRows }, photoMeta, premiumIds, visibilityMap, viewerPermissions] =
      await Promise.all([
        supabase
          .from("member_details")
          .select(
            "member_id,display_name,governorate,city,country,age,gender,marital_status,education,job,height,weight,body_type,smoking,prayer_status,religiosity,health_status,bio,partner_specs,interests,personality_traits,marriage_intent,avatar_url,hijab_style,beard_style",
          )
          .in("member_id", memberIds),
        supabase.from("member_settings").select("member_id,show_profile").in("member_id", memberIds),
        supabase.from("verification_requests").select("member_id,status").in("member_id", memberIds).eq("status", "approved"),
        loadApprovedPhotoMeta(memberIds),
        loadPremiumIds(memberIds),
        loadPhotoVisibility(memberIds),
        loadViewerPhotoPermissions(sessionId, memberIds),
      ]);

    const detailsByMember = new Map<string, any>();
    const visibleByMember = new Map((settingsRows || []).map((row: any) => [row.member_id, row.show_profile !== false]));
    const verifiedMembers = new Set((verifiedRows || []).map((row: any) => row.member_id));
    for (const detail of (detailRows || []) as any[]) {
      if (detail?.member_id) detailsByMember.set(detail.member_id, detail);
    }

    let merged = (memberRows || []).map((member: any) => {
      const details = detailsByMember.get(member.id) || {};
      const visibility = visibilityMap.get(member.id) || "all";
      const allowed =
        visibility === "all" ||
        member.id === sessionId ||
        viewerPermissions.has(member.id);

      const approvedPhotoCount = photoMeta.counts.get(member.id) || 0;
      const hasPhotos = approvedPhotoCount > 0;
      const photo = allowed ? photoMeta.primary.get(member.id) || details.avatar_url || null : null;

      return {
        ...member,
        ...details,
        id: member.id,
        username: member.username,
        image: photo,
        avatar_url: photo,
        is_online: onlineFromLastSeen(member.last_seen),
        is_premium: premiumIds.has(member.id),
        verified: String(member.verification_status || "") === "verified" || verifiedMembers.has(member.id),
        membership_tier: member.membership_tier || (member.is_founder ? "founder" : "basic"),
        photo_visibility: visibility,
        photos_locked: hasPhotos && !allowed,
        approved_photo_count: approvedPhotoCount,
        has_photos: hasPhotos,
      };
    });

    merged = merged.filter((member: any) => {
      if (visibleByMember.get(member.id) === false) return false;
      if (
        city &&
        !String(member.city || member.governorate || "")
          .toLowerCase()
          .includes(city.toLowerCase())
      )
        return false;
      if (forcedGender && String(member.gender || "") !== forcedGender) return false;
      if (!forcedGender && gender && String(member.gender || "") !== gender) return false;
      if (minAge && Number(member.age || 0) < minAge) return false;
      if (maxAge && Number(member.age || 0) > maxAge) return false;
      if (health && !normalizeHealth(member.health_status).includes(normalizeHealth(health))) return false;
      if (mode === "online" && !member.is_online) return false;
      if (mode === "premium" && !member.is_premium) return false;
      if (mode === "founders" && member.is_founder !== true) return false;
      return true;
    });

    if (mode === "online") {
      merged.sort((a: any, b: any) =>
        String(b.last_seen || "").localeCompare(String(a.last_seen || "")),
      );
    } else if (mode === "new") {
      merged.sort((a: any, b: any) =>
        String(b.created_at || "").localeCompare(String(a.created_at || "")),
      );
    } else if (mode === "founders") {
      merged.sort((a: any, b: any) => Number(a.member_number || Number.MAX_SAFE_INTEGER) - Number(b.member_number || Number.MAX_SAFE_INTEGER));
    } else if (mode === "premium") {
      merged.sort((a: any, b: any) => Number(b.is_online) - Number(a.is_online));
    }

    return NextResponse.json({ members: merged.slice(0, limit) });
  } catch (error) {
    console.error("search api", error);
    return NextResponse.json({ error: "تعذر البحث الآن" }, { status: 500 });
  }
}
