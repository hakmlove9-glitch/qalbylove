export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { moderateText } from "@/lib/text-moderation";

function cleanUsername(value: string) {
  return value.trim().normalize("NFC");
}

function invalidReason(username: string) {
  if (!username) return "اكتب اسم المستخدم أولًا";
  if (Array.from(username).length > 40) return "اسم المستخدم طويل جدًا؛ الحد الأقصى 40 رمزًا.";
  if (/\s/.test(username)) return "اسم المستخدم لا يقبل مسافات.";
  if (username.replace(/\D/g, "").length >= 8) return "لا يجوز استخدام رقم هاتف كاسم مستخدم.";
  return null;
}

export async function GET(request: Request) {
  const username = cleanUsername(
    new URL(request.url).searchParams.get("username") || "",
  );

  const invalid = invalidReason(username);
  const moderation = await moderateText(username, { field: "username" });
  if (!moderation.allowed) {
    return NextResponse.json(
      { available: false, message: moderation.reason || "الاسم غير مناسب للمنصة" },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  if (invalid) {
    return NextResponse.json(
      { available: false, message: invalid },
      {
        status: username ? 200 : 400,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  }

  const supabase = createSupabaseAdminClient();

  // المسار الأساسي: مقارنة Unicode غير حساسة لحالة الحروف عبر دالة قاعدة البيانات.
  const { data: rpcAvailable, error: rpcError } = await supabase.rpc(
    "is_username_available",
    { candidate_username: username },
  );

  if (!rpcError && typeof rpcAvailable === "boolean") {
    return NextResponse.json(
      {
        available: rpcAvailable,
        message: rpcAvailable
          ? "الاسم متاح"
          : "الاسم مستخدم بالفعل",
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }

  // توافق مؤقت قبل تشغيل آخر migration.
  // نهرب % و _ حتى لا يتحولا إلى wildcards في ilike.
  const escaped = username
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");

  const { data, error } = await supabase
    .from("members")
    .select("id")
    .ilike("username", escaped)
    .limit(1);

  if (error) {
    return NextResponse.json(
      { available: false, message: "تعذر فحص الاسم الآن" },
      {
        status: 500,
        headers: { "Cache-Control": "no-store, max-age=0" },
      },
    );
  }

  const available = !data?.length;

  return NextResponse.json(
    {
      available,
      message: available
        ? "الاسم متاح"
        : "الاسم مستخدم بالفعل",
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
