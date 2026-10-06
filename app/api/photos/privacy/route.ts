export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { normalizePhotoVisibility } from "@/lib/photo-privacy";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function currentMemberId() {
  return cookies().get("qalbylove_session")?.value || null;
}

async function notify(memberId: string, content: string, actionUrl = "/photos") {
  try {
    await supabase.from("notifications").insert({
      member_id: memberId,
      type: "photo_privacy",
      content,
      message: content,
      action_url: actionUrl,
    });
  } catch {
    // Notification failure must not block the main photo-privacy action.
  }
}

async function namesFor(ids: string[]) {
  if (!ids.length) return new Map<string, string>();
  const { data } = await supabase.from("members").select("id,username").in("id", ids);
  return new Map((data || []).map((row: any) => [row.id, row.username || "عضو قلبي لوڤي"]));
}

export async function GET() {
  const memberId = await currentMemberId();
  if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const [{ data: settings }, { data: incoming }, { data: outgoing }] = await Promise.all([
    supabase.from("member_settings").select("photo_visibility").eq("member_id", memberId).maybeSingle(),
    supabase
      .from("photo_access_requests")
      .select("id,requester_id,status,created_at")
      .eq("owner_id", memberId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("photo_access_requests")
      .select("id,owner_id,status,created_at")
      .eq("requester_id", memberId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const ids = [
    ...(incoming || []).map((row: any) => row.requester_id),
    ...(outgoing || []).map((row: any) => row.owner_id),
  ];
  const names = await namesFor([...new Set(ids)]);

  return NextResponse.json({
    visibility: normalizePhotoVisibility(settings?.photo_visibility),
    incoming: (incoming || []).map((row: any) => ({
      ...row,
      memberName: names.get(row.requester_id) || "عضو قلبي لوڤي",
    })),
    outgoing: (outgoing || []).map((row: any) => ({
      ...row,
      memberName: names.get(row.owner_id) || "عضو قلبي لوڤي",
    })),
  });
}

export async function PUT(request: Request) {
  const memberId = await currentMemberId();
  if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const body = await request.json();
  const visibility = normalizePhotoVisibility(body.visibility);

  const { data: existing } = await supabase
    .from("member_settings")
    .select("member_id")
    .eq("member_id", memberId)
    .maybeSingle();

  const query = existing
    ? supabase.from("member_settings").update({ photo_visibility: visibility }).eq("member_id", memberId)
    : supabase.from("member_settings").insert({
        member_id: memberId,
        show_profile: true,
        allow_messages: true,
        photo_visibility: visibility,
      });

  const { error } = await query;
  if (error) return NextResponse.json({ error: "تعذر حفظ خصوصية الصور" }, { status: 500 });

  return NextResponse.json({ success: true, visibility });
}

export async function POST(request: Request) {
  const memberId = await currentMemberId();
  if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const body = await request.json();
  const action = String(body.action || "");

  if (action === "request") {
    const ownerId = String(body.ownerId || "");
    if (!ownerId || ownerId === memberId) return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });

    const { data: settings } = await supabase
      .from("member_settings")
      .select("photo_visibility")
      .eq("member_id", ownerId)
      .maybeSingle();

    if (normalizePhotoVisibility(settings?.photo_visibility) !== "request") {
      return NextResponse.json({ error: "هذا العضو لا يستخدم نظام طلب مشاهدة الصور" }, { status: 400 });
    }

    const { data: requester } = await supabase
      .from("members")
      .select("username")
      .eq("id", memberId)
      .maybeSingle();

    const { error } = await supabase.from("photo_access_requests").upsert(
      {
        owner_id: ownerId,
        requester_id: memberId,
        status: "pending",
        responded_at: null,
      },
      { onConflict: "owner_id,requester_id" },
    );

    if (error) return NextResponse.json({ error: "تعذر إرسال الطلب" }, { status: 500 });

    await notify(
      ownerId,
      `${requester?.username || "أحد الأعضاء"} طلب مشاهدة صورك.`,
      "/photos",
    );

    return NextResponse.json({ success: true, status: "pending" });
  }

  const requestId = String(body.requestId || "");
  if (!requestId) return NextResponse.json({ error: "الطلب غير محدد" }, { status: 400 });

  const { data: accessRequest } = await supabase
    .from("photo_access_requests")
    .select("id,owner_id,requester_id,status")
    .eq("id", requestId)
    .maybeSingle();

  if (!accessRequest) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });

  if (["approve", "reject", "revoke"].includes(action)) {
    if (accessRequest.owner_id !== memberId) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    const status =
      action === "approve" ? "approved" :
      action === "reject" ? "rejected" :
      "revoked";

    const { error } = await supabase
      .from("photo_access_requests")
      .update({ status, responded_at: new Date().toISOString() })
      .eq("id", requestId);

    if (error) return NextResponse.json({ error: "تعذر تحديث الطلب" }, { status: 500 });

    if (action === "approve") {
      await notify(accessRequest.requester_id, "تمت الموافقة على مشاهدة الصور.", `/member/${memberId}`);
    } else if (action === "reject") {
      await notify(accessRequest.requester_id, "لم تتم الموافقة على طلب مشاهدة الصور.");
    }

    return NextResponse.json({ success: true, status });
  }

  return NextResponse.json({ error: "إجراء غير معروف" }, { status: 400 });
}
