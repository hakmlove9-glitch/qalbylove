export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const memberId = cookies().get("qalbylove_session")?.value;
  if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const [{ data: member }, { data: details }, { data: photos }] = await Promise.all([
    supabase.from("members").select("username,gender").eq("id", memberId).maybeSingle(),
    supabase
      .from("member_details")
      .select("age,governorate,city,country,marital_status,education,job,height,weight,prayer_status,health_status,bio,partner_specs,interests,personality_traits,housing_plan,marriage_timeline")
      .eq("member_id", memberId)
      .maybeSingle(),
    supabase
      .from("photos")
      .select("id,moderation_status")
      .eq("member_id", memberId)
      .neq("moderation_status", "rejected")
      .limit(1),
  ]);

  const checks = [
    ["الاسم الظاهر", member?.username],
    ["العمر", details?.age],
    ["المحافظة أو الدولة", details?.governorate || details?.country],
    ["المدينة / المركز", details?.city],
    ["الحالة الاجتماعية", details?.marital_status],
    ["المؤهل", details?.education],
    ["العمل", details?.job],
    ["الطول", details?.height],
    ["الوزن", details?.weight],
    ["الصلاة", details?.prayer_status],
    ["الحالة الصحية", details?.health_status],
    ["السكن بعد الزواج", details?.housing_plan],
    ["الاستعداد الزمني للزواج", details?.marriage_timeline],
    ["نبذة عنك", details?.bio],
    ["مواصفات الشريك", details?.partner_specs],
    ["الاهتمامات", Array.isArray(details?.interests) && details.interests.length >= 3],
    ["صفات الشخصية", Array.isArray(details?.personality_traits) && details.personality_traits.length >= 3],
    ["الصورة الشخصية", Boolean(photos?.length)],
  ] as const;

  const completed = checks.filter(([, value]) => Boolean(value)).map(([label]) => label);
  const missing = checks.filter(([, value]) => !value).map(([label]) => label);
  const percentage = Math.round((completed.length / checks.length) * 100);

  return NextResponse.json({
    percentage,
    completed,
    missing,
    ready: percentage === 100,
  });
}
