import type { SupabaseClient } from "@supabase/supabase-js";

export type PhotoVisibility = "all" | "mutual" | "request" | "private";

export function normalizePhotoVisibility(value: unknown): PhotoVisibility {
  const visibility = String(value || "");
  if (visibility === "mutual") return "mutual";
  if (visibility === "request") return "request";
  if (visibility === "private") return "private";
  return "all";
}

export async function photoAccessFor(
  supabase: SupabaseClient<any>,
  ownerId: string,
  viewerId?: string | null,
) {
  if (viewerId && viewerId === ownerId) {
    return {
      allowed: true,
      visibility: "all" as PhotoVisibility,
      requestStatus: "owner",
    };
  }

  const { data: settings } = await supabase
    .from("member_settings")
    .select("photo_visibility")
    .eq("member_id", ownerId)
    .maybeSingle();

  const visibility = normalizePhotoVisibility(settings?.photo_visibility);

  // الصور التي اختار صاحبها "للجميع" تُعرض للزائر أيضًا؛
  // التسجيل مطلوب للتفاعل فقط، لا لمشاهدة المحتوى العام.
  if (visibility === "all") {
    return { allowed: true, visibility, requestStatus: null };
  }

  if (!viewerId) {
    return { allowed: false, visibility, requestStatus: null };
  }

  const { data: viewer } = await supabase
    .from("members")
    .select("role,is_admin")
    .eq("id", viewerId)
    .maybeSingle();

  if (viewer?.is_admin === true || ["admin", "super_admin"].includes(String(viewer?.role || ""))) {
    return { allowed: true, visibility, requestStatus: "admin" };
  }

  if (visibility === "private") {
    return { allowed: false, visibility, requestStatus: null };
  }

  if (visibility === "mutual") {
    const [{ data: directMatch }, { data: sent }, { data: received }] = await Promise.all([
      supabase
        .from("matches")
        .select("id")
        .or(
          `and(member_one.eq.${ownerId},member_two.eq.${viewerId}),and(member_one.eq.${viewerId},member_two.eq.${ownerId})`,
        )
        .limit(1)
        .maybeSingle(),
      supabase
        .from("interests")
        .select("id")
        .eq("sender_id", ownerId)
        .eq("receiver_id", viewerId)
        .limit(1)
        .maybeSingle(),
      supabase
        .from("interests")
        .select("id")
        .eq("sender_id", viewerId)
        .eq("receiver_id", ownerId)
        .limit(1)
        .maybeSingle(),
    ]);

    const mutual = Boolean(directMatch || (sent && received));
    return {
      allowed: mutual,
      visibility,
      requestStatus: mutual ? "mutual" : null,
    };
  }

  const { data: request } = await supabase
    .from("photo_access_requests")
    .select("status")
    .eq("owner_id", ownerId)
    .eq("requester_id", viewerId)
    .maybeSingle();

  return {
    allowed: request?.status === "approved",
    visibility,
    requestStatus: request?.status || null,
  };
}
