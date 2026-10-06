export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

const signupTips = [
  "ابدأ بالموافقة على الميثاق واختيار صفتك. بعدها سأرافقك في باقي التسجيل.",
  "الاسم الذي سيظهر للأعضاء هو هويتك داخل المنصة ويجب أن يكون غير مستخدم. اختَر اسمًا محترمًا وسهل التذكر.",
  "اختر العمر ومكان الإقامة بدقة، ولو كنت خارج مصر اختر دولة الإقامة.",
  "أكمل الزواج السابق والأبناء والسكن والقدرة الزمنية على الزواج بوضوح.",
  "اختر المؤهل والوظيفة الحقيقيين، ولو لم تجد وظيفتك استخدم خيار «أخرى».",
  "اختر الطول والوزن وحالة الصلاة والصحة كما هي؛ الدقة أفضل من التجميل.",
  "دلوقتي أقدر أساعدك في كتابة نبذة شخصية مبنية على بياناتك ومختلفة عن النبذات الموجودة.",
  "اختَر صورة شخصية واضحة وحديثة. الملف لا يُعتبر مكتملًا 100% بدون صورة.",
  "الاسم الحقيقي ورقم الهاتف في آخر خطوة سريان للإدارة والاسترجاع ولا يظهران للأعضاء.",
];

function clean(value: unknown) {
  return String(value || "").trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = clean(body.message);

    if (!message) {
      return NextResponse.json(
        { success: false, reply: "اكتب سؤالك وأنا معك." },
        { status: 400 },
      );
    }

    const lower = message.toLowerCase();
    const female = body.gender === "female" || body.gender === "أنثى";
    const name = female ? "حواء" : "آدم";
    const profile = body.profile || {};

    let reply = `أنا ${name}، وموجود معك خطوة بخطوة.`;

    if (body.context === "signup") {
      const step = Math.max(0, Math.min(8, Number(body.step) || 0));
      reply = signupTips[step];
    }

    if (lower.includes("اسم") && (lower.includes("ظاهر") || lower.includes("مستخدم"))) {
      reply =
        "الاسم الذي سيظهر للأعضاء هو هويتك داخل قلبي لوڤي. لازم يكون غير مستخدم من عضو آخر، ويُفضّل يكون محترم وسهل التذكر، وماينفعش يكون رقم هاتف.";
    } else if (lower.includes("بريد") || lower.includes("ايميل")) {
      reply =
        "البريد ممكن يكون مرتبط بأكثر من حساب. أهم شيء الاسم الظاهر يكون فريد، والبريد يفيدك في استرجاع الحسابات المرتبطة به.";
    } else if (lower.includes("هاتف") || lower.includes("تليفون") || lower.includes("موبايل")) {
      reply =
        "رقم الهاتف يُكتب في البيانات السرية بآخر التسجيل، ويمكن استخدامه لأكثر من حساب، لكنه لا يظهر للأعضاء.";
    } else if (lower.includes("وظيف") || lower.includes("عمل")) {
      const job = clean(profile.job === "أخرى" ? profile.jobOther : profile.job);
      const education = clean(profile.education);
      reply = job
        ? `شايف إنك اخترت ${job}${education ? ` ومعاك ${education}` : ""}. في مرحلة النبذة أقدر أبني صياغة شخصية مناسبة للخلفية دي بدل كلام عام.`
        : "اختَر الوظيفة الأقرب لعملك. لو مش موجودة، اختَر «أخرى» واكتبها بنفسك.";
    } else if (lower.includes("نبذة") || lower.includes("اكتب عن نفسي")) {
      reply =
        "في مرحلة شخصيتك والشريك هتلاقي زر «اقترح لي 3 نبذات شخصية». هراجع عمرك وإقامتك ومؤهلك وعملك وصفاتك واهتماماتك، وأطلع لك 3 اختيارات مختلفة تقدر تختار منها وتعدل عليها.";
    } else if (lower.includes("اشتراك") || lower.includes("دفع")) {
      reply =
        "من صفحة الباقات اختَر المدة المناسبة، ومن داخل حسابك تقدر تتابع حالة التفعيل.";
    } else if (lower.includes("بحث") || lower.includes("شريك")) {
      reply =
        "استخدم البحث والتوافق واقرأ القيم والنية والبيانات قبل إرسال الاهتمام؛ الصورة وحدها مش كفاية.";
    } else if (lower.includes("رسالة") || lower.includes("شات")) {
      reply =
        "خلي التواصل داخل قلبي لوڤي. مشاركة أرقام أو روابط خارجية ممنوعة حفاظًا على أمان الطرفين.";
    } else if (lower.includes("أمان") || lower.includes("ابتزاز") || lower.includes("فلوس")) {
      reply =
        "لو حد طلب مال أو هددك أو ضغط عليك، أوقف التواصل فورًا واستخدم زر الإبلاغ للإدارة.";
    }

    if (body.memberId) {
      try {
        const supabase = createSupabaseAdminClient();
        await supabase
          .from("assistant_logs")
          .insert({ member_id: body.memberId, question: message, answer: reply });
      } catch {}
    }

    return NextResponse.json({ success: true, reply });
  } catch {
    return NextResponse.json(
      { success: false, reply: "حدث خطأ أثناء تشغيل المساعد." },
      { status: 500 },
    );
  }
}
