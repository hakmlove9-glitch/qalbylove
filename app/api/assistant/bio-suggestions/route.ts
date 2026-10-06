export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

function clean(value: unknown) {
  return String(value || "").trim();
}

function normalize(value: string) {
  return value.normalize("NFKC").replace(/\s+/g, " ").trim().toLowerCase();
}

export async function POST(request: Request) {
  try {
    const { profile = {}, target = "bio" } = await request.json();

    const gender = clean(profile.gender);
    const age = clean(profile.age);
    const place = clean(profile.city || profile.governorate || profile.country);
    const education = clean(profile.education);
    const job = clean(profile.job);
    const housing = clean(profile.housing_plan || profile.housing);
    const timeline = clean(profile.marriage_timeline || profile.marriageTimeline);
    const prayer = clean(profile.prayer_status || profile.prayer);
    const religiosity = clean(profile.religiosity);
    const traits = Array.isArray(profile.personality_traits || profile.personalityTraits)
      ? (profile.personality_traits || profile.personalityTraits).map(clean).filter(Boolean)
      : [];
    const interests = Array.isArray(profile.interests)
      ? profile.interests.map(clean).filter(Boolean)
      : [];

    if (!age || !place || !education || !job) {
      return NextResponse.json(
        { error: "كمّل العمر والإقامة والمؤهل والعمل الأول عشان الاقتراحات تبقى شخصية فعلًا." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdminClient();
    const column = target === "partner" ? "partner_specs" : "bio";
    const { data: existing } = await supabase
      .from("member_details")
      .select(column)
      .not(column, "is", null);

    const used = new Set(
      (existing || [])
        .map((row: any) => normalize(String(row?.[column] || "")))
        .filter(Boolean),
    );

    let seeds: string[] = [];

    if (target === "partner") {
      const partnerWord = gender === "female" ? "زوج" : "زوجة";
      const values = [
        "الوضوح والاحترام",
        "الحوار الهادئ",
        "تحمل المسؤولية",
        "التفاهم مع الأسرة",
        "الجدية في الزواج",
      ];

      seeds = [
        `أبحث عن ${partnerWord} جاد في تكوين أسرة، يقدّر ${values[0]} و${values[1]}، ويكون مستعدًا لاتخاذ خطوات واضحة نحو الزواج. يهمني التوافق في القيم وطريقة التفكير أكثر من المظاهر.`,
        `الشخص المناسب لي هو ${partnerWord} ناضج، واضح، يحترم الخصوصية ويعرف معنى المشاركة والمسؤولية. أفضل شخصية هادئة ومتفاهمة، ويكون هدفها من التعارف هو الزواج والاستقرار.`,
        `أتمنى ${partnerWord} يكون بيننا قبول وراحة وحوار صريح من غير ضغط أو تصنع. أقدّر ${values[2]} و${values[3]}، وأحب أن تكون خطوات الزواج واقعية ومتدرجة حسب التوافق بيننا.`,
      ];

      if (housing) seeds = seeds.map((text, i) => i === 1 ? `${text} وبالنسبة للسكن أفضّل أن يكون الأمر واضحًا ومتفقًا عليه من البداية (${housing}).` : text);
      if (timeline) seeds = seeds.map((text, i) => i === 2 ? `${text} وتوقيت الزواج المناسب بالنسبة لي: ${timeline}.` : text);
    } else {
      const person = gender === "female" ? "مصرية" : "مصري";
      const traitText = traits.slice(0, 4).join("، ") || "هادئ، واضح وأقدّر الأسرة";
      const interestText = interests.slice(0, 4).join("، ") || "الأسرة والتعلم والحياة المتوازنة";
      const faith = [prayer, religiosity].filter(Boolean).join("، ");

      seeds = [
        `${person} عمري ${age} سنة وأقيم في ${place}. معي ${education} وأعمل في مجال ${job}. أصف نفسي بأنني ${traitText}، ومن اهتماماتي ${interestText}. دخلت قلبي لوڤي بنية زواج جاد وبحث عن توافق حقيقي مبني على الاحترام والوضوح.`,
        `أبحث عن بداية محترمة تنتهي باستقرار حقيقي. عمري ${age} سنة، مقيم في ${place}، وخلفيتي الدراسية ${education} وأعمل في ${job}. أحب ${interestText}، وأقدّر الصراحة والهدوء وتحمل المسؤولية في العلاقة.`,
        `شخصيتي تميل إلى ${traitText}. أعيش في ${place}، عمري ${age} سنة، ومجال عملي ${job}. أهم شيء عندي أن يكون التعارف واضحًا من البداية وأن يكون هدف الطرفين الزواج وتكوين حياة هادئة ومتفاهمة.${faith ? ` وفي الجانب الديني: ${faith}.` : ""}`,
      ];
    }

    const unique: string[] = [];
    for (let i = 0; i < seeds.length; i++) {
      let candidate = seeds[i].replace(/\s+/g, " ").trim();
      if (used.has(normalize(candidate))) {
        candidate = `${candidate} أحب أن يكون كل طرف على طبيعته وأن نترك الحكم للتوافق الحقيقي مع الوقت.`;
      }
      if (!used.has(normalize(candidate)) && !unique.some((item) => normalize(item) === normalize(candidate))) {
        unique.push(candidate);
      }
    }

    return NextResponse.json({ suggestions: unique.slice(0, 3) });
  } catch (error) {
    console.error("assistant suggestions", error);
    return NextResponse.json({ error: "تعذر تجهيز الاقتراحات الآن." }, { status: 500 });
  }
}
