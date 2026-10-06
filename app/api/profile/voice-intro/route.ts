export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentMember } from "@/lib/auth";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = new Set(["audio/webm", "audio/ogg", "audio/mp4", "audio/mpeg", "audio/wav"]);

export async function POST(request: Request) {
  const session = await getCurrentMember();
  if (!session) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  try {
    const form = await request.formData();
    const file = form.get("audio");
    const duration = Math.min(30, Math.max(0, Number(form.get("duration") || 0)));
    if (!(file instanceof File)) return NextResponse.json({ error: "لم يتم العثور على التسجيل" }, { status: 400 });
    const type = file.type.split(";")[0].toLowerCase();
    if (!ALLOWED.has(type)) return NextResponse.json({ error: "صيغة التسجيل غير مدعومة" }, { status: 400 });
    if (file.size <= 0 || file.size > MAX_BYTES) return NextResponse.json({ error: "حجم التسجيل غير مناسب" }, { status: 400 });
    const extension = type.includes("ogg") ? "ogg" : type.includes("mp4") ? "m4a" : type.includes("mpeg") ? "mp3" : type.includes("wav") ? "wav" : "webm";
    const path = `${session.memberId}/intro-${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage.from("voice-intros").upload(path, bytes, { contentType: file.type, upsert: false, cacheControl: "31536000" });
    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
    const { data } = supabase.storage.from("voice-intros").getPublicUrl(path);
    const url = data.publicUrl;
    const { error: updateError } = await supabase.from("member_details").upsert({ member_id: session.memberId, voice_intro_url: url, voice_intro_path: path, voice_intro_duration: duration }, { onConflict: "member_id" });
    if (updateError) {
      await supabase.storage.from("voice-intros").remove([path]);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, url, duration });
  } catch (error) {
    console.error("voice-intro", error);
    return NextResponse.json({ error: "تعذر حفظ التعريف الصوتي" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getCurrentMember();
  if (!session) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  const { data: details } = await supabase.from("member_details").select("voice_intro_path").eq("member_id", session.memberId).maybeSingle();
  if (details?.voice_intro_path) await supabase.storage.from("voice-intros").remove([details.voice_intro_path]);
  const { error } = await supabase.from("member_details").upsert({ member_id: session.memberId, voice_intro_url: null, voice_intro_path: null, voice_intro_duration: null }, { onConflict: "member_id" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
