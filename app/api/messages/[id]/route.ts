export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCurrentMemberId } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { fallbackAvatar } from "@/lib/avatar-fallback";
import { ensureMessagingAccess, isSafeMemberId } from "@/lib/messaging";

async function signedVoiceUrl(supabase: ReturnType<typeof createSupabaseAdminClient>, value?: string | null) {
  if (!value) return null;
  let bucket = "voice-messages";
  let path = value;
  if (/^https?:\/\//i.test(value)) {
    const markers = [
      { bucket: "voice-messages", marker: "/storage/v1/object/public/voice-messages/" },
      { bucket: "voices", marker: "/storage/v1/object/public/voices/" },
    ];
    const found = markers.find(({ marker }) => value.includes(marker));
    if (!found) return null;
    bucket = found.bucket;
    path = decodeURIComponent(value.slice(value.indexOf(found.marker) + found.marker.length));
  }
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60);
  return error ? null : data?.signedUrl || null;
}

export async function GET(_request: Request, context: { params: { id: string } }) {
  const memberId = await getCurrentMemberId();
  if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const otherMemberId = String(context.params.id || "").trim();
  if (!isSafeMemberId(otherMemberId)) return NextResponse.json({ error: "العضو غير موجود" }, { status: 400 });

  const restriction = await ensureMessagingAccess(memberId, otherMemberId);
  if (restriction) return NextResponse.json({ error: restriction }, { status: 403 });

  const supabase = createSupabaseAdminClient();

  try {
    const [{ data: messages, error }, { data: member }, { data: details }, { data: photos }] = await Promise.all([
      supabase
        .from("messages")
        .select("id,sender_id,receiver_id,content,type,voice_url,is_read,created_at")
        .or(
          `and(sender_id.eq.${memberId},receiver_id.eq.${otherMemberId}),and(sender_id.eq.${otherMemberId},receiver_id.eq.${memberId})`,
        )
        .order("created_at", { ascending: true })
        .limit(500),
      supabase.from("members").select("id,username,last_seen,account_status").eq("id", otherMemberId).maybeSingle(),
      supabase.from("member_details").select("gender,age").eq("member_id", otherMemberId).maybeSingle(),
      supabase
        .from("photos")
        .select("image_url,is_primary")
        .eq("member_id", otherMemberId)
        .eq("moderation_status", "approved")
        .limit(8),
    ]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!member || member.account_status === "blocked" || member.account_status === "suspended") {
      return NextResponse.json({ error: "هذا الحساب غير متاح حاليًا" }, { status: 404 });
    }

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", otherMemberId)
      .eq("receiver_id", memberId)
      .eq("is_read", false);

    const primary = (photos || []).find((photo) => photo.is_primary) || (photos || [])[0];
    const lastSeen = member.last_seen ? new Date(member.last_seen).getTime() : 0;

    const safeMessages = await Promise.all((messages || []).map(async (message) => ({
      ...message,
      voice_url: message.type === "voice" ? await signedVoiceUrl(supabase, message.voice_url) : message.voice_url,
    })));

    return NextResponse.json({
      messages: safeMessages,
      member: {
        id: otherMemberId,
        username: member.username || "عضو قلبي لوڤي",
        avatar_url: primary?.image_url || fallbackAvatar(details?.gender, details?.age),
        is_online: Boolean(lastSeen && Date.now() - lastSeen <= 10 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error("messages-thread", error);
    return NextResponse.json({ error: "تعذر تحميل المحادثة" }, { status: 500 });
  }
}
