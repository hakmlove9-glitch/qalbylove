export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { photoAccessFor } from "@/lib/photo-privacy";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const viewerId = cookies().get("qalbylove_session")?.value;

  const [{ data: member }, { data: details }] = await Promise.all([
    supabase.from("members").select("id,username,gender,is_founder").eq("id", params.id).maybeSingle(),
    supabase.from("member_details").select("*").eq("member_id", params.id).maybeSingle(),
  ]);

  if (!member) return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });

  if (viewerId && viewerId !== params.id) {
    const [{ data: viewer }, { data: viewerDetails }] = await Promise.all([
      supabase.from("members").select("gender").eq("id", viewerId).maybeSingle(),
      supabase.from("member_details").select("gender").eq("member_id", viewerId).maybeSingle(),
    ]);
    const viewerGender = String(viewer?.gender || viewerDetails?.gender || "");
    const targetGender = String(member.gender || details?.gender || "");
    if (viewerGender && targetGender && viewerGender === targetGender) {
      return NextResponse.json(
        { error: "هذه الصفحة غير متاحة ضمن نتائج الزواج لهذا الحساب" },
        { status: 403 },
      );
    }
  }

  const photoAccess = await photoAccessFor(supabase, params.id, viewerId);

  const { count: approvedPhotoCount } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true })
    .eq("member_id", params.id)
    .eq("moderation_status", "approved");

  const { data: photos } = photoAccess.allowed
    ? await supabase
        .from("photos")
        .select("image_url,is_primary")
        .eq("member_id", params.id)
        .eq("moderation_status", "approved")
    : { data: [] as any[] };

  return NextResponse.json({
    member: {
      ...details,
      id: member.id,
      username: member.username,
      gender: member.gender || details?.gender,
      is_founder: member.is_founder,
      photos: (photos || []).map((photo: any) => ({
        image_url: photo.image_url,
        is_primary: photo.is_primary,
      })),
      approved_photo_count: approvedPhotoCount || 0,
      has_photos: (approvedPhotoCount || 0) > 0,
      photos_locked: !photoAccess.allowed,
      photo_visibility: photoAccess.visibility,
      photo_access_status: photoAccess.requestStatus,
    },
  });
}
