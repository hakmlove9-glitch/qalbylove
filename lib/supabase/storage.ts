import { createSupabaseAdminClient } from "@/lib/supabase/client";

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

const MAX_AUDIO_BYTES = 15 * 1024 * 1024;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_AUDIO_TYPES = new Set([
  "audio/webm","audio/ogg","audio/mpeg","audio/mp4","audio/wav","audio/x-m4a",
]);

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg","image/png","image/webp",
]);

function safeExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (extension) return extension.slice(0, 8);
  if (file.type.includes("ogg")) return "ogg";
  if (file.type.includes("mpeg")) return "mp3";
  if (file.type.includes("mp4") || file.type.includes("m4a")) return "m4a";
  if (file.type.includes("wav")) return "wav";
  if (file.type.includes("png")) return "png";
  if (file.type.includes("webp")) return "webp";
  return file.type.startsWith("image/") ? "jpg" : "webm";
}

async function uploadToBucket(
  file: File,
  bucket: string,
  folder: string,
): Promise<UploadResult> {
  try {
    const supabase = createSupabaseAdminClient();
    const extension = safeExtension(file);
    const fileName = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const bytes = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(bucket).upload(fileName, bytes, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });

    if (error) return { success: false, error: error.message };

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return { success: true, url: data.publicUrl, path: fileName };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "تعذر رفع الملف",
    };
  }
}

export async function uploadVoice(file: File, folder = "voice"): Promise<UploadResult> {
  if (!file || file.size <= 0) return { success: false, error: "التسجيل الصوتي فارغ" };
  if (file.size > MAX_AUDIO_BYTES) return { success: false, error: "حجم التسجيل الصوتي أكبر من المسموح" };
  if (file.type && !ALLOWED_AUDIO_TYPES.has(file.type)) return { success: false, error: "صيغة التسجيل الصوتي غير مدعومة" };
  return uploadToBucket(file, "voices", folder);
}

export async function uploadProfileImage(file: File, memberId: string): Promise<UploadResult> {
  if (!file || file.size <= 0) return { success: false, error: "الصورة فارغة" };
  if (file.size > MAX_IMAGE_BYTES) return { success: false, error: "حجم الصورة يجب ألا يزيد عن 5 ميجابايت" };
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) return { success: false, error: "صيغة الصورة غير مدعومة" };
  return uploadToBucket(file, "member-photos", memberId);
}

export async function uploadPaymentReceipt(file: File, memberId: string): Promise<UploadResult> {
  if (!file || file.size <= 0) return { success: false, error: "صورة الإيصال مطلوبة" };
  if (file.size > MAX_IMAGE_BYTES) return { success: false, error: "صورة الإيصال يجب ألا تزيد عن 5 ميجابايت" };
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) return { success: false, error: "صيغة الإيصال غير مدعومة" };
  return uploadToBucket(file, "payment-receipts", memberId);
}
