import { createSupabaseAdminClient } from "@/lib/supabase/client";

export async function generateMemberNumber() {
  const supabase = createSupabaseAdminClient();

  // النسخة النهائية من الـmigration تضيف هذا RPC لتفادي تكرار رقم العضوية
  // إذا سجل أكثر من عضو في نفس اللحظة.
  const rpcResult = await supabase.rpc("next_member_number");

  if (!rpcResult.error && typeof rpcResult.data === "number") {
    const memberNumber = rpcResult.data;

    return {
      memberNumber,
      isFounder: memberNumber <= 1000,
    };
  }

  // Fallback متوافق مع قاعدة البيانات الحالية قبل تشغيل migration الجديد.
  const { data, error } = await supabase
    .from("members")
    .select("member_number")
    .not("member_number", "is", null)
    .order("member_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("تعذر إنشاء رقم العضوية");
  }

  const memberNumber = Number(data?.member_number || 0) + 1;

  return {
    memberNumber,
    isFounder: memberNumber <= 1000,
  };
}
