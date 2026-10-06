export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentMemberId } from "@/lib/auth";
import { photoAccessFor } from "@/lib/photo-privacy";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function isOnline(lastSeen?: string | null) {
  if (!lastSeen) return false;
  const time = new Date(lastSeen).getTime();
  return Number.isFinite(time) && Date.now() - time <= 10 * 60 * 1000;
}

async function premiumFor(id: string) {
  const now = new Date().toISOString();
  const active = await supabase.from("subscriptions").select("user_id,status,ends_at").eq("user_id", id).eq("status", "active").maybeSingle();
  if (active.data && (!active.data.ends_at || String(active.data.ends_at) >= now)) return true;
  const legacy = await supabase.from("user_subscriptions").select("user_id,is_premium,end_date").eq("user_id", id).eq("is_premium", true).maybeSingle();
  return Boolean(legacy.data && (!legacy.data.end_date || String(legacy.data.end_date) >= now.slice(0, 10)));
}

export async function GET(request: Request) {
  try {
    const current = await getCurrentMemberId();
    const id = new URL(request.url).searchParams.get("id")?.trim();
    if (!id) return NextResponse.json({ error: "العضو غير موجود" }, { status: 400 });

    const [{ data: member }, { data: details }, { data: settings }, { data: verification }, premium] = await Promise.all([
      supabase.from("members").select("*").eq("id", id).maybeSingle(),
      supabase.from("member_details").select("*").eq("member_id", id).maybeSingle(),
      supabase.from("member_settings").select("*").eq("member_id", id).maybeSingle(),
      supabase.from("verification_requests").select("status").eq("member_id", id).eq("status", "approved").maybeSingle(),
      premiumFor(id),
    ]);

    if (!member) return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
    if (settings?.show_profile === false && current !== id) return NextResponse.json({ error: "هذا الملف الشخصي غير متاح" }, { status: 403 });

    let interactions = { interested: false, favorite: false, blocked: false, mutual: false };
    if (current && current !== id) {
      const [sent, favorite, blocked, match] = await Promise.all([
        supabase.from("interests").select("id").eq("sender_id", current).eq("receiver_id", id).maybeSingle(),
        supabase.from("favorites").select("id").eq("user_id", current).eq("favorite_id", id).maybeSingle(),
        supabase.from("blocks").select("id").eq("blocker_id", current).eq("blocked_id", id).maybeSingle(),
        supabase.from("matches").select("id").or(`and(member_one.eq.${current},member_two.eq.${id}),and(member_one.eq.${id},member_two.eq.${current})`).maybeSingle(),
      ]);
      interactions = { interested: Boolean(sent.data), favorite: Boolean(favorite.data), blocked: Boolean(blocked.data), mutual: Boolean(match.data) };
    }

    const photoAccess = await photoAccessFor(supabase, id, current);

    const { count: approvedPhotoCount } = await supabase
      .from("photos")
      .select("id", { count: "exact", head: true })
      .eq("member_id", id)
      .eq("moderation_status", "approved");

    const { data: approvedPhotos } = photoAccess.allowed
      ? await supabase
          .from("photos")
          .select("id,image_url,is_primary,created_at")
          .eq("member_id", id)
          .eq("moderation_status", "approved")
          .order("is_primary", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(12)
      : { data: [] as any[] };

    const healthPrivacy = details?.health_privacy || "members";
    const healthVisible = healthPrivacy === "public" || current === id || (Boolean(current) && healthPrivacy === "members") || (healthPrivacy === "matches" && interactions.mutual);
    const profile = {
      ...details,
      id: member.id,
      username: member.username,
      member_number: member.member_number,
      created_at: member.created_at,
      last_seen: member.last_seen,
      account_status: member.account_status,
      is_founder: member.is_founder === true,
      is_online: isOnline(member.last_seen),
      is_premium: premium,
      verified: String(member.verification_status || "") === "verified" || Boolean(verification),
      membership_tier: member.membership_tier || (member.is_founder ? "founder" : "basic"),
      show_profile: settings?.show_profile ?? true,
      allow_messages: settings?.allow_messages ?? true,
      photos: approvedPhotos || [],
      approved_photo_count: approvedPhotoCount || 0,
      has_photos: (approvedPhotoCount || 0) > 0,
      photos_locked: !photoAccess.allowed,
      photo_visibility: photoAccess.visibility,
      photo_access_status: photoAccess.requestStatus,
      interactions,
      viewer_authenticated: Boolean(current),
      health_status: healthVisible ? details?.health_status : null,
      health_details: healthVisible ? details?.health_details : null,
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("member-profile", error);
    return NextResponse.json({ error: "تعذر تحميل الملف" }, { status: 500 });
  }
}
