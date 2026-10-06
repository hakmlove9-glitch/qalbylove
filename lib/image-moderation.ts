export type ImageModerationResult = "approved" | "pending" | "rejected";
export type ModerationSeverity = "low" | "medium" | "high";

export type ImageModerationResponse = {
  status: ImageModerationResult;
  reason?: string;
  provider: string;
  severity: ModerationSeverity;
  categories: Record<string, number>;
  raw?: unknown;
};

type ImageModerationInput = {
  bytes: Buffer;
  mimeType: string;
  fileName?: string;
  memberId?: string;
};

type OpenAIModerationResult = {
  flagged?: boolean;
  categories?: Record<string, boolean>;
  category_scores?: Record<string, number>;
};

const OPENAI_MODERATION_URL = "https://api.openai.com/v1/moderations";

function safeScores(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, score]) => typeof score === "number" && Number.isFinite(score))
      .map(([key, score]) => [key, Number(score)]),
  );
}

function safeFlags(value: unknown): Record<string, boolean> {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, flag]) => typeof flag === "boolean")
      .map(([key, flag]) => [key, Boolean(flag)]),
  );
}

function highestScore(scores: Record<string, number>, keys: string[]) {
  return Math.max(0, ...keys.map((key) => Number(scores[key] || 0)));
}

/**
 * سياسة قلبي لوڤي للصور الشخصية:
 *
 * 1) sexual = رفض مباشر.
 * 2) violence/graphic أو self-harm بدرجة عالية = رفض مباشر.
 * 3) أي Flagged آخر أو درجات متوسطة مقلقة = مراجعة استثنائية.
 * 4) غير ذلك = اعتماد ونشر تلقائي.
 *
 * مهم:
 * OpenAI نفسها توضح أن category_scores قد تتغير مع تحديثات الموديل،
 * لذلك نعتمد أولًا على flags الرسمية ونستخدم الدرجات فقط للمنطقة الرمادية.
 */
function decide(
  result: OpenAIModerationResult,
): Pick<ImageModerationResponse, "status" | "reason" | "severity"> {
  const flags = safeFlags(result.categories);
  const scores = safeScores(result.category_scores);

  const sexualFlagged = flags["sexual"] === true;
  const severeViolence =
    flags["violence/graphic"] === true ||
    highestScore(scores, ["violence/graphic"]) >= 0.80;

  const severeSelfHarm =
    flags["self-harm"] === true &&
    highestScore(scores, ["self-harm", "self-harm/intent"]) >= 0.80;

  if (sexualFlagged) {
    return {
      status: "rejected",
      reason: "الصورة تحتوي على محتوى جنسي أو غير مناسب لصور الملف الشخصي.",
      severity: "high",
    };
  }

  if (severeViolence) {
    return {
      status: "rejected",
      reason: "الصورة تحتوي على مشاهد عنف شديد أو محتوى صادم وغير مناسب للمنصة.",
      severity: "high",
    };
  }

  if (severeSelfHarm) {
    return {
      status: "rejected",
      reason: "الصورة تحتوي على محتوى مؤذٍ أو صادم وغير مناسب للملف الشخصي.",
      severity: "high",
    };
  }

  const mediumConcern =
    highestScore(scores, ["sexual"]) >= 0.25 ||
    highestScore(scores, ["violence", "violence/graphic"]) >= 0.50 ||
    highestScore(scores, ["self-harm", "self-harm/intent", "self-harm/instructions"]) >= 0.50;

  if (result.flagged === true || mediumConcern) {
    return {
      status: "pending",
      reason: "الفحص الآلي لم يحسم الصورة بثقة كافية، فتم تحويلها للمراجعة الاستثنائية فقط.",
      severity: "medium",
    };
  }

  return {
    status: "approved",
    reason: "اجتازت الصورة الفحص الآلي.",
    severity: "low",
  };
}

export async function moderateImageBytes(
  input: ImageModerationInput,
): Promise<ImageModerationResponse> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return {
      status: "pending",
      reason: "مفتاح OPENAI_API_KEY غير موجود في بيئة الخادم.",
      provider: "openai-unconfigured",
      severity: "low",
      categories: {},
    };
  }

  if (!input.bytes?.length) {
    return {
      status: "rejected",
      reason: "الصورة فارغة أو غير صالحة.",
      provider: "local",
      severity: "high",
      categories: {},
    };
  }

  try {
    const dataUrl = `data:${input.mimeType || "image/jpeg"};base64,${input.bytes.toString("base64")}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);

    const response = await fetch(OPENAI_MODERATION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "omni-moderation-latest",
        input: [
          {
            type: "image_url",
            image_url: {
              url: dataUrl,
            },
          },
        ],
      }),
      signal: controller.signal,
      cache: "no-store",
    }).finally(() => clearTimeout(timeout));

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("openai-moderation-http", response.status, payload);
      return {
        status: "pending",
        reason: "تعذر إكمال الفحص الآلي للصورة الآن.",
        provider: "openai-error",
        severity: "low",
        categories: {},
      };
    }

    const result = payload?.results?.[0] as OpenAIModerationResult | undefined;

    if (!result) {
      return {
        status: "pending",
        reason: "لم تصل نتيجة فحص واضحة للصورة.",
        provider: "openai-invalid-response",
        severity: "low",
        categories: {},
        raw: payload,
      };
    }

    const scores = safeScores(result.category_scores);
    const decision = decide(result);

    return {
      ...decision,
      provider: "openai:omni-moderation-latest",
      categories: scores,
      raw: {
        flagged: result.flagged === true,
        categories: safeFlags(result.categories),
        category_scores: scores,
      },
    };
  } catch (error) {
    console.error("openai-image-moderation", error);

    return {
      status: "pending",
      reason: "خدمة الفحص الآلي لم تستجب في الوقت المناسب.",
      provider: "openai-timeout",
      severity: "low",
      categories: {},
    };
  }
}

/**
 * توافق مع أي جزء قديم ما زال يمرر URL.
 * مسار الرفع النهائي يستخدم moderateImageBytes قبل نشر الصورة.
 */
export async function moderateImage(
  imageUrl: string,
): Promise<ImageModerationResponse> {
  if (!imageUrl) {
    return {
      status: "rejected",
      reason: "الصورة غير موجودة.",
      provider: "local",
      severity: "high",
      categories: {},
    };
  }

  return {
    status: "pending",
    reason: "هذا المسار القديم لا ينشر الصورة تلقائيًا. استخدم فحص البايتات قبل النشر.",
    provider: "legacy-url",
    severity: "low",
    categories: {},
  };
}
