export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { getCurrentMemberId } from "@/lib/auth";

export async function GET() {
  try {
    const memberId = await getCurrentMemberId();
    if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("id,content,message,type,action_url,is_read,read,created_at")
      .eq("member_id", memberId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) return NextResponse.json({ error: "تعذر تحميل الإشعارات" }, { status: 500 });

    const notifications = (data || []).map((item) => ({
      id: item.id,
      content: item.content || item.message || "لديك تحديث جديد",
      type: item.type || "general",
      action_url: item.action_url || null,
      is_read: Boolean(item.is_read || item.read),
      created_at: item.created_at,
    }));

    return NextResponse.json({
      notifications,
      unreadCount: notifications.filter((item) => !item.is_read).length,
    });
  } catch (error) {
    console.error("notifications-get", error);
    return NextResponse.json({ error: "تعذر تحميل الإشعارات" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const memberId = await getCurrentMemberId();
    if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const body = await request.json();
    const supabase = createSupabaseAdminClient();
    let query = supabase
      .from("notifications")
      .update({ is_read: true, read: true })
      .eq("member_id", memberId);

    if (body.all !== true) {
      const id = String(body.id || "").trim();
      if (!id) return NextResponse.json({ error: "الإشعار غير موجود" }, { status: 400 });
      query = query.eq("id", id);
    }

    const { error } = await query;
    if (error) return NextResponse.json({ error: "تعذر تحديث الإشعار" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("notifications-put", error);
    return NextResponse.json({ error: "تعذر تحديث الإشعار" }, { status: 500 });
  }
}
