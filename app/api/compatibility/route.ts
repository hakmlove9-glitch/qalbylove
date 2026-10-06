export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentMember } from "@/lib/auth";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function arr(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return [];
}

function overlap(a: string[], b: string[]) {
  const right = new Set(b.map((item) => item.trim().toLowerCase()));
  return a.filter((item) => right.has(item.trim().toLowerCase()));
}

export async function GET(request: Request) {
  const session = await getCurrentMember();
  if (!session) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const memberId = new URL(request.url).searchParams.get("member_id")?.trim();
  if (!memberId || memberId === session.memberId) return NextResponse.json({ error: "العضو غير صالح" }, { status: 400 });

  const [{ data: me }, { data: other }] = await Promise.all([
    supabase.from("member_details").select("*").eq("member_id", session.memberId).maybeSingle(),
    supabase.from("member_details").select("*").eq("member_id", memberId).maybeSingle(),
  ]);
  if (!other) return NextResponse.json({ error: "تعذر تحميل بيانات التوافق" }, { status: 404 });

  let score = 48;
  const strengths: string[] = [];
  const differences: string[] = [];
  const commonInterests = overlap(arr(me?.interests), arr(other?.interests));
  const commonTraits = overlap(arr(me?.personality_traits), arr(other?.personality_traits));

  if (commonInterests.length) { score += Math.min(16, commonInterests.length * 4); strengths.push(`اهتمامات مشتركة: ${commonInterests.slice(0, 3).join("، ")}`); }
  if (commonTraits.length) { score += Math.min(12, commonTraits.length * 3); strengths.push(`صفات قريبة: ${commonTraits.slice(0, 3).join("، ")}`); }
  if (me?.city && other?.city && me.city === other.city) { score += 7; strengths.push("نفس المدينة أو المحافظة"); }
  if (me?.marriage_intent && other?.marriage_intent && me.marriage_intent === other.marriage_intent) { score += 10; strengths.push("توقيت ونية الزواج متقاربان"); }
  if (me?.smoking && other?.smoking && me.smoking === other.smoking) { score += 5; strengths.push("نمط التدخين متوافق"); }
  else if (me?.smoking && other?.smoking) differences.push("نمط التدخين مختلف");
  if (me?.marriage_intent && other?.marriage_intent && me.marriage_intent !== other.marriage_intent) differences.push("توقيت الزواج المتوقع مختلف");
  if (me?.city && other?.city && me.city !== other.city) differences.push("الإقامة في مدينتين مختلفتين");

  score = Math.max(35, Math.min(96, score));
  if (!strengths.length) strengths.push("لسه محتاجين بيانات أكتر علشان نفسّر التوافق بدقة");
  return NextResponse.json({ compatibility: { score, strengths, differences } });
}
