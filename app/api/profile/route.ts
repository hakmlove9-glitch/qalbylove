export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { moderateText } from "@/lib/text-moderation";
import { getCurrentMemberId } from "@/lib/auth";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function memberId() {
  return getCurrentMemberId();
}

export async function GET() {
  try {
    const id = await memberId();
    if (!id) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
    const [{ data: member }, { data: details }, { data: settings }, { data: photos }] = await Promise.all([
      supabase.from("members").select("*").eq("id", id).maybeSingle(),
      supabase.from("member_details").select("*").eq("member_id", id).maybeSingle(),
      supabase.from("member_settings").select("*").eq("member_id", id).maybeSingle(),
      supabase.from("photos").select("image_url,is_primary").eq("member_id", id).eq("moderation_status", "approved").limit(10),
    ]);
    if (!member) return NextResponse.json({ error: "الحساب غير موجود" }, { status: 404 });
    return NextResponse.json({
      profile: {
        ...member,
        ...details,
        id: member.id,
        username: member.username,
        show_profile: settings?.show_profile ?? true,
        allow_messages: settings?.allow_messages ?? true,
        photos: photos || [],
      },
    });
  } catch (error) {
    console.error("profile-get", error);
    return NextResponse.json({ error: "تعذر تحميل ملفك" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const id = await memberId();
    if (!id) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
    const body = await request.json();
    const textFields: Array<[string, unknown, string]> = [
      ["username", body.username, "الاسم الظاهر"],
      ["bio", body.bio, "نبذة عني"],
      ["partner_specs", body.partner_specs, "مواصفات شريك الحياة"],
    ];
    for (const [key, value, label] of textFields) {
      if (value === undefined || value === null || String(value).trim() === "") continue;
      const moderation = await moderateText(value, { field: key === "username" ? "username" : key });
      if (!moderation.allowed) {
        try {
          await supabase.from("moderation_events").insert({
            member_id: id,
            event_type: "text",
            source: key,
            decision: "rejected",
            category: moderation.category || "text",
            reason: moderation.reason || null,
            content_excerpt: String(value).slice(0, 180),
            metadata: { matched: moderation.matched || null },
          });
        } catch {
          // Logging failure must not bypass the moderation decision.
        }

        return NextResponse.json(
          { error: `${label}: ${moderation.reason || "النص غير مناسب للمنصة"}` },
          { status: 400 },
        );
      }
    }

    if (body.username) {
      const username = String(body.username).trim();
      if (username.length < 3) return NextResponse.json({ error: "اسم المستخدم قصير" }, { status: 400 });
      const { error } = await supabase.from("members").update({ username }).eq("id", id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const editable = [
      "full_name", "governorate", "city", "age", "marital_status", "bio", "partner_specs", "health_status", "health_details",
      "health_privacy", "education", "job", "height", "weight", "smoking", "sports", "appearance", "nationality",
      "personality_traits", "interests", "hobbies", "gender", "marriage_intent", "prayer_status", "religiosity", "body_type", "housing_plan", "marriage_timeline", "work_status",
    ];
    const details: Record<string, unknown> = { member_id: id };
    for (const key of editable) if (key in body) details[key] = body[key] === "" ? null : body[key];

    const { data: existingDetails } = await supabase
      .from("member_details")
      .select("id")
      .eq("member_id", id)
      .limit(1);

    const detailsQuery = existingDetails?.length
      ? supabase.from("member_details").update(details).eq("id", existingDetails[0].id)
      : supabase.from("member_details").insert(details);

    const { error: detailsError } = await detailsQuery;
    if (detailsError) return NextResponse.json({ error: "تعذر حفظ بيانات الملف الآن" }, { status: 500 });

    return NextResponse.json({ success: true, message: "تم حفظ بياناتك بنجاح" });
  } catch (error) {
    console.error("profile-put", error);
    return NextResponse.json({ error: "تعذر حفظ التعديلات" }, { status: 500 });
  }
}
