import { containsDirectContactInfo } from "@/lib/content-moderation";

export type TextModerationResult = {
  allowed: boolean;
  reason?: string;
  category?: "contact" | "abusive" | "sexual" | "impersonation";
  matched?: string;
};

const SEXUAL_TERMS = [
  "سكس","نيك","نودز","عارية","عاريه","اباحي","إباحي","اباحية","إباحية",
  "porn","porno","xxx","nude","nudes","sex",
];

const ABUSIVE_TERMS = [
  "شرموط","شرموطة","قحبة","خول","وسخ","وسخة","كلب ابن","ابن كلب","بنت كلب",
  "كس ام","كسم","زب","طيز","عرص","متناك","منيوك",
];

const IMPERSONATION_TERMS = [
  "الادارة الرسمية","الإدارة الرسمية","admin qalby","qalbylove admin",
  "دعم قلبي لوفي الرسمي","دعم قلبي لوڤي الرسمي",
];

function normalize(value: string) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstMatch(text: string, terms: string[]) {
  const normalized = normalize(text);
  return terms.find((term) => normalized.includes(normalize(term)));
}

export async function moderateText(
  value: unknown,
  options: { field?: string; allowContact?: boolean } = {},
): Promise<TextModerationResult> {
  const text = String(value || "").trim();
  if (!text) return { allowed: true };

  if (!options.allowContact && containsDirectContactInfo(text)) {
    return {
      allowed: false,
      category: "contact",
      reason: "ممنوع كتابة أرقام الهاتف أو وسائل التواصل أو الروابط خارج قلبي لوڤي.",
    };
  }

  const sexual = firstMatch(text, SEXUAL_TERMS);
  if (sexual) {
    return {
      allowed: false,
      category: "sexual",
      matched: sexual,
      reason: "النص يحتوي على لفظ أو محتوى جنسي غير مناسب للمنصة.",
    };
  }

  const abusive = firstMatch(text, ABUSIVE_TERMS);
  if (abusive) {
    return {
      allowed: false,
      category: "abusive",
      matched: abusive,
      reason: "الاسم أو النص يحتوي على لفظ مسيء أو غير محترم.",
    };
  }

  if (options.field === "username") {
    const impersonation = firstMatch(text, IMPERSONATION_TERMS);
    if (impersonation) {
      return {
        allowed: false,
        category: "impersonation",
        matched: impersonation,
        reason: "لا يجوز استخدام اسم يوحي بأنك تمثل إدارة قلبي لوڤي.",
      };
    }
  }

  return { allowed: true };
}
