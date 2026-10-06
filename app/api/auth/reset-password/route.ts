export const dynamic = "force-dynamic";

import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = String(body.token || "");
    const password = String(body.password || "");
    if (!token) return NextResponse.json({ error: "رابط الاستعادة غير صالح" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "كلمة المرور يجب ألا تقل عن 8 أحرف" }, { status: 400 });

    const tokenHash = createHash("sha256").update(token).digest("hex");
    const { data: record } = await supabase
      .from("password_reset_tokens")
      .select("id,member_id,expires_at,used_at")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (!record || record.used_at || new Date(record.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "انتهت صلاحية رابط الاستعادة أو تم استخدامه بالفعل" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const { error } = await supabase.from("members").update({ password_hash: passwordHash }).eq("id", record.member_id);
    if (error) throw error;
    await supabase.from("password_reset_tokens").update({ used_at: new Date().toISOString() }).eq("id", record.id);
    return NextResponse.json({ success: true, message: "تم تغيير كلمة المرور بنجاح" });
  } catch (error) {
    console.error("reset-password", error);
    return NextResponse.json({ error: "تعذر تغيير كلمة المرور الآن" }, { status: 500 });
  }
}
