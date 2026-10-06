export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { getCurrentMemberId } from "@/lib/auth";
import { hasPremiumFeature } from "@/lib/subscription";

export async function GET() {
  try {
    const memberId = await getCurrentMemberId();
    if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("profile_views")
      .select("id,viewer_id,viewed_id,created_at")
      .eq("viewed_id", memberId)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) return NextResponse.json({ error: "تعذر تحميل زيارات الملف" }, { status: 500 });

    const viewerIds = Array.from(new Set((data || []).map((item) => item.viewer_id).filter(Boolean)));
    const { data: memberData } = viewerIds.length
      ? await supabase.from("members").select("id,username,is_founder,verification_status").in("id", viewerIds)
      : { data: [] as any[] };

    const members = memberData || [];
    const views = (data || []).map((view) => ({
      ...view,
      viewer: members.find((member) => member.id === view.viewer_id) || null,
    }));

    return NextResponse.json({ views });
  } catch (error) {
    console.error("profile-views-get", error);
    return NextResponse.json({ error: "تعذر تحميل زيارات الملف" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const viewerId = await getCurrentMemberId();
    if (!viewerId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const body = await request.json();
    const viewedId = String(body.viewed_id || "").trim();
    if (!viewedId) return NextResponse.json({ error: "الملف المطلوب غير موجود" }, { status: 400 });
    if (viewerId === viewedId) return NextResponse.json({ success: true, ownProfile: true });

    const supabase = createSupabaseAdminClient();
    const [{ data: member }, { data: viewerSettings }, canHiddenLogin] = await Promise.all([
      supabase.from("members").select("id,account_status").eq("id", viewedId).maybeSingle(),
      supabase.from("member_settings").select("hide_profile_views").eq("member_id", viewerId).maybeSingle(),
      hasPremiumFeature(viewerId, "hidden_login"),
    ]);

    if (!member || ["blocked", "suspended", "deleted"].includes(String(member.account_status || ""))) {
      return NextResponse.json({ error: "العضو غير موجود" }, { status: 404 });
    }

    // التصفح الخفي ميزة حقيقية للمؤسسين/العضويات التي تدعمها، وليس مجرد زر شكلي.
    if (canHiddenLogin && viewerSettings?.hide_profile_views === true) {
      return NextResponse.json({ success: true, hidden: true });
    }

    const { data: existing } = await supabase
      .from("profile_views")
      .select("id")
      .eq("viewer_id", viewerId)
      .eq("viewed_id", viewedId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("profile_views")
        .update({ created_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (error) return NextResponse.json({ error: "تعذر تسجيل الزيارة" }, { status: 500 });
      return NextResponse.json({ success: true, updated: true });
    }

    const { data, error } = await supabase
      .from("profile_views")
      .insert({ viewer_id: viewerId, viewed_id: viewedId })
      .select("id,viewer_id,viewed_id,created_at")
      .single();

    if (error) return NextResponse.json({ error: "تعذر تسجيل الزيارة" }, { status: 500 });
    return NextResponse.json({ success: true, view: data });
  } catch (error) {
    console.error("profile-views-post", error);
    return NextResponse.json({ error: "تعذر تسجيل الزيارة" }, { status: 500 });
  }
}
