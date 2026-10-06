import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { fallbackAvatar } from "@/lib/avatar-fallback";

export type PublicHomeMember = {
  id: string;
  name: string;
  age: number | null;
  city: string;
  country: string;
  image: string;
  fallbackImage: string;
  hasRealPhoto: boolean;
  online: boolean;
  founder: boolean;
  verified: boolean;
  gender: string | null;
};

function isOnline(lastSeen?: string | null) {
  if (!lastSeen) return false;
  const timestamp = Date.parse(lastSeen);
  return Number.isFinite(timestamp) && Date.now() - timestamp <= 10 * 60 * 1000;
}

export async function loadPublicHomeMembers(limit = 8): Promise<PublicHomeMember[]> {
  const supabase = createSupabaseAdminClient();
  try {
    const { data: members, error } = await supabase
      .from("members")
      .select("id,username,gender,account_status,created_at,last_seen,is_founder")
      .eq("account_status", "active")
      .order("created_at", { ascending: false })
      .limit(40);
    if (error || !members?.length) return [];

    const ids = members.map((m: any) => m.id);
    const [{ data: details }, { data: settings }, { data: photos }, { data: verification }] = await Promise.all([
      supabase.from("member_details").select("member_id,display_name,age,city,governorate,country,gender,hijab_style,beard_style").in("member_id", ids),
      supabase.from("member_settings").select("member_id,show_profile").in("member_id", ids),
      supabase.from("photos").select("member_id,image_url,is_primary,moderation_status").in("member_id", ids).eq("moderation_status", "approved"),
      supabase.from("verification_requests").select("member_id,status").in("member_id", ids).eq("status", "approved"),
    ]);

    const detailsMap = new Map((details || []).map((d: any) => [d.member_id, d]));
    const visibleMap = new Map((settings || []).map((s: any) => [s.member_id, s.show_profile !== false]));
    const verified = new Set((verification || []).map((v: any) => v.member_id));
    const photoMap = new Map<string, string>();
    for (const photo of (photos || []) as any[]) {
      if (!photo?.member_id || !photo?.image_url) continue;
      if (!photoMap.has(photo.member_id) || photo.is_primary) photoMap.set(photo.member_id, photo.image_url);
    }

    return members
      .filter((m: any) => visibleMap.get(m.id) !== false)
      .map((m: any) => {
        const d: any = detailsMap.get(m.id) || {};
        const real = photoMap.get(m.id) || "";
        const gender = d.gender || m.gender || null;
        return {
          id: m.id,
          name: String(d.display_name || m.username || "عضو"),
          age: Number(d.age) || null,
          city: String(d.city || d.governorate || ""),
          country: String(d.country || ""),
          image: real || fallbackAvatar(gender, d.age, { hijabStyle: d.hijab_style, beardStyle: d.beard_style, seed: m.id }),
          fallbackImage: fallbackAvatar(gender, d.age, { hijabStyle: d.hijab_style, beardStyle: d.beard_style, seed: m.id }),
          hasRealPhoto: Boolean(real),
          online: isOnline(m.last_seen),
          founder: m.is_founder === true,
          verified: verified.has(m.id),
          gender,
        } satisfies PublicHomeMember;
      })
      .slice(0, limit);
  } catch (error) {
    console.error("loadPublicHomeMembers", error);
    return [];
  }
}
