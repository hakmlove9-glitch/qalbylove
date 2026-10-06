export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function adminId() {
  try {
    const session = await requireAdmin();
    return session.memberId;
  } catch {
    return null;
  }
}

async function signed(path?: string | null) {
  if (!path) return "";
  const { data } = await supabase.storage.from("moderation-evidence").createSignedUrl(path, 60 * 20);
  return data?.signedUrl || "";
}

async function memberNames(ids: string[]) {
  if (!ids.length) return new Map<string, string>();
  const { data } = await supabase.from("members").select("id,username").in("id", ids);
  return new Map((data || []).map((row: any) => [row.id, row.username || "عضو"]));
}

export async function GET(request: Request) {
  if (!(await adminId())) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const decision = new URL(request.url).searchParams.get("decision");
  if (decision === "approved") {
    const { data: photos, error } = await supabase.from("photos")
      .select("id,member_id,image_url,is_primary,moderation_status,moderation_reason,created_at")
      .eq("moderation_status", "approved")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return NextResponse.json({ error: "تعذر تحميل الصور المعتمدة" }, { status: 500 });
    const names = await memberNames([...new Set((photos || []).map((photo) => photo.member_id).filter(Boolean))]);
    return NextResponse.json({ events: (photos || []).map((photo) => ({ ...photo, photo_id: photo.id, memberName: names.get(photo.member_id) || "عضو", evidenceUrl: photo.image_url, decision: "approved", status: "reviewed" })) });
  }

  let query = supabase
    .from("moderation_events")
    .select("*")
    .eq("event_type", "photo")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(100);

  if (decision && ["pending", "rejected"].includes(decision)) {
    query = query.eq("decision", decision);
  }

  const { data: events, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const names = await memberNames(
    [...new Set((events || []).map((event: any) => event.member_id).filter(Boolean))],
  );

  const enriched = await Promise.all(
    (events || []).map(async (event: any) => ({
      ...event,
      memberName: names.get(event.member_id) || "عضو",
      evidenceUrl: await signed(event.evidence_path),
    })),
  );

  return NextResponse.json({ events: enriched });
}

async function approvePhoto(event: any, admin: string) {
  if (!event.photo_id || !event.evidence_path) throw new Error("لا توجد صورة قابلة للاعتماد");

  const { data: downloaded, error: downloadError } = await supabase.storage
    .from("moderation-evidence")
    .download(event.evidence_path);

  if (downloadError || !downloaded) throw new Error("تعذر قراءة الصورة المؤقتة");

  const extension = String(event.evidence_path).split(".").pop() || "jpg";
  const publicPath = `${event.member_id}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const bytes = Buffer.from(await downloaded.arrayBuffer());

  const contentType = String(event.metadata?.mimeType || "image/jpeg");
  const { error: uploadError } = await supabase.storage
    .from("member-photos")
    .upload(publicPath, bytes, { contentType, upsert: false });

  if (uploadError) throw new Error("تعذر نقل الصورة إلى الملف");

  const { data: publicUrl } = supabase.storage.from("member-photos").getPublicUrl(publicPath);

  const { count } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true })
    .eq("member_id", event.member_id)
    .eq("moderation_status", "approved");

  const { error: updateError } = await supabase
    .from("photos")
    .update({
      image_url: publicUrl.publicUrl,
      storage_path: publicPath,
      evidence_path: null,
      moderation_status: "approved",
      moderation_reason: "اعتمدت بعد مراجعة استثنائية",
      approved_at: new Date().toISOString(),
      is_primary: (count || 0) === 0,
    })
    .eq("id", event.photo_id);

  if (updateError) {
    await supabase.storage.from("member-photos").remove([publicPath]).catch(() => undefined);
    throw new Error("تعذر اعتماد الصورة");
  }

  await supabase.storage.from("moderation-evidence").remove([event.evidence_path]).catch(() => undefined);

  await supabase.from("moderation_events").update({
    status: "actioned",
    reviewed_at: new Date().toISOString(),
    reviewed_by: admin,
    decision: "approved",
  }).eq("id", event.id);
}

export async function PUT(request: Request) {
  const admin = await adminId();
  if (!admin) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });

  const body = await request.json();
  const id = String(body.id || "");
  const action = String(body.action || "");

  if (action === "primary") {
    const photoId = String(body.photo_id || id);
    const { data: photo } = await supabase.from("photos").select("id,member_id,moderation_status").eq("id", photoId).maybeSingle();
    if (!photo) return NextResponse.json({ error: "الصورة غير موجودة" }, { status: 404 });
    if (photo.moderation_status !== "approved") return NextResponse.json({ error: "لا يمكن جعل صورة غير معتمدة رئيسية" }, { status: 400 });
    const { error: clearError } = await supabase.from("photos").update({ is_primary: false }).eq("member_id", photo.member_id);
    if (clearError) return NextResponse.json({ error: "تعذر تحديث الصورة الرئيسية" }, { status: 500 });
    const { error } = await supabase.from("photos").update({ is_primary: true }).eq("id", photoId).eq("member_id", photo.member_id);
    if (error) return NextResponse.json({ error: "تعذر تحديث الصورة الرئيسية" }, { status: 500 });
    await supabase.from("admin_logs").insert({ admin_id: admin, action: "admin_photo_primary", target_type: "photo", target_id: photoId, details: { member_id: photo.member_id } });
    return NextResponse.json({ success: true });
  }

  const { data: event } = await supabase
    .from("moderation_events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!event) return NextResponse.json({ error: "الحالة غير موجودة" }, { status: 404 });

  try {
    if (action === "approve") {
      await approvePhoto(event, admin);
      return NextResponse.json({ success: true });
    }

    if (action === "reject") {
      if (event.photo_id) {
        await supabase.from("photos").update({
          moderation_status: "rejected",
          moderation_reason: body.reason || event.reason || "تم الرفض بعد مراجعة الإدارة",
        }).eq("id", event.photo_id);
      }

      await supabase.from("moderation_events").update({
        status: "actioned",
        reviewed_at: new Date().toISOString(),
        reviewed_by: admin,
        decision: "rejected",
      }).eq("id", id);

      return NextResponse.json({ success: true });
    }

    if (action === "dismiss") {
      await supabase.from("moderation_events").update({
        status: "dismissed",
        reviewed_at: new Date().toISOString(),
        reviewed_by: admin,
      }).eq("id", id);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "إجراء غير صالح" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "تعذر تنفيذ الإجراء" },
      { status: 500 },
    );
  }
}
