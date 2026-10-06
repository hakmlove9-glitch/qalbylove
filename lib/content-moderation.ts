import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { createNotification } from "@/lib/create-notification";

const CONTACT_TERMS = [
  "واتساب","واتس","whatsapp","واتس اب","wa.me",
  "تليجرام","تلجرام","telegram","تيليجرام",
  "فيسبوك","فيس بوك","facebook","ماسنجر","messenger",
  "انستجرام","انستا","instagram",
  "سناب","سناب شات","snapchat",
  "تيك توك","tiktok",
  "رقمي","رقم الهاتف","رقم التليفون","رقم موبايلي","موبايل","تليفون","هاتف",
  "كلمني على","اتصل بي","تواصل معي على","ابعتلي على","كلميني على","كلمني واتس",
];

export function normalizeDigits(value: string) {
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  const eastern = "۰۱۲۳۴۵۶۷۸۹";

  return String(value || "")
    .replace(/[٠-٩]/g, (digit) => String(arabic.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String(eastern.indexOf(digit)));
}

export function containsDirectContactInfo(input: unknown) {
  const text = normalizeDigits(String(input || "")).normalize("NFKC").toLowerCase();
  if (!text.trim()) return false;

  if (/\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/i.test(text)) return true;
  if (/(?:https?:\/\/|www\.)\S+/i.test(text)) return true;
  if (/(^|\s)@[a-z0-9_.]{3,}/i.test(text)) return true;

  const candidates = text.match(/[+\d][\d\s()./-]{6,}\d/g) || [];
  if (candidates.some((candidate) => (candidate.match(/\d/g) || []).length >= 8)) return true;

  return CONTACT_TERMS.some((term) => text.includes(term));
}

export function contactSafetyMessage() {
  return "ممنوع مشاركة أرقام الهاتف أو البريد أو الروابط أو حسابات التواصل الخارجية. خليك داخل قلبي لوڤي حفاظًا على الأمان.";
}

export async function registerContactViolation(
  memberId: string,
  source: "message" | "profile" | "signup",
) {
  const supabase = createSupabaseAdminClient();

  const { error: insertError } = await supabase.from("moderation_violations").insert({
    member_id: memberId,
    violation_type: "direct_contact",
    source,
  });

  if (insertError) {
    console.error("registerContactViolation:", insertError.message);
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("moderation_violations")
    .select("id", { count: "exact", head: true })
    .eq("member_id", memberId)
    .eq("violation_type", "direct_contact")
    .gte("created_at", since);

  const attempts = count || 1;

  if (attempts >= 3) {
    await supabase
      .from("members")
      .update({ account_status: "suspended" })
      .eq("id", memberId);

    await createNotification({
      memberId,
      type: "safety",
      content: "تم تعليق حسابك مؤقتًا بسبب تكرار محاولة مشاركة بيانات تواصل مباشرة. راجع مركز الأمان أو تواصل مع الإدارة.",
      actionUrl: "/safety-center",
    });

    return { suspended: true, attempts };
  }

  await createNotification({
    memberId,
    type: "safety",
    content: `تم منع محاولة مشاركة بيانات تواصل مباشرة. هذه المحاولة رقم ${attempts} خلال 24 ساعة. تكرار المخالفة قد يؤدي إلى تعليق الحساب.`,
    actionUrl: "/safety-center",
  });

  return { suspended: false, attempts };
}
