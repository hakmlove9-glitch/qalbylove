export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { getCurrentMemberId } from "@/lib/auth";
import { hasPremiumFeature } from "@/lib/subscription";

const DEFAULTS = {
  show_profile: true,
  allow_messages: true,
  hide_last_seen: false,
  hide_profile_views: false,
};

export async function GET() {
  try {
    const memberId = await getCurrentMemberId();
    if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const supabase = createSupabaseAdminClient();
    const [{ data, error }, canHiddenLogin] = await Promise.all([
      supabase
        .from("member_settings")
        .select("show_profile,allow_messages,hide_last_seen,hide_profile_views")
        .eq("member_id", memberId)
        .maybeSingle(),
      hasPremiumFeature(memberId, "hidden_login"),
    ]);

    if (error) return NextResponse.json({ error: "تعذر تحميل إعدادات الخصوصية" }, { status: 500 });

    return NextResponse.json({
      settings: { ...DEFAULTS, ...(data || {}) },
      capabilities: { hidden_login: canHiddenLogin },
    });
  } catch (error) {
    console.error("settings-get", error);
    return NextResponse.json({ error: "تعذر تحميل إعدادات الخصوصية" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const memberId = await getCurrentMemberId();
    if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const body = await request.json();
    const canHiddenLogin = await hasPremiumFeature(memberId, "hidden_login");

    const payload = {
      member_id: memberId,
      show_profile: body.show_profile !== false,
      allow_messages: body.allow_messages !== false,
      hide_last_seen: body.hide_last_seen === true,
      hide_profile_views: canHiddenLogin && body.hide_profile_views === true,
      updated_at: new Date().toISOString(),
    };

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("member_settings")
      .upsert(payload, { onConflict: "member_id" });

    if (error) return NextResponse.json({ error: "تعذر حفظ إعدادات الخصوصية" }, { status: 500 });

    return NextResponse.json({
      success: true,
      settings: payload,
      capabilities: { hidden_login: canHiddenLogin },
    });
  } catch (error) {
    console.error("settings-put", error);
    return NextResponse.json({ error: "تعذر حفظ إعدادات الخصوصية" }, { status: 500 });
  }
}
