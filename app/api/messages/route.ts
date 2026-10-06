export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { getCurrentMemberId } from "@/lib/auth";
import { fallbackAvatar } from "@/lib/avatar-fallback";
import { createNotification } from "@/lib/create-notification";
import { containsDirectContactInfo, registerContactViolation } from "@/lib/content-moderation";
import { ensureMessagingAccess, isSafeMemberId } from "@/lib/messaging";

function online(lastSeen?: string | null) {
  if (!lastSeen) return false;
  const time = new Date(lastSeen).getTime();
  return Number.isFinite(time) && Date.now() - time <= 10 * 60 * 1000;
}

export async function GET() {
  const memberId = await getCurrentMemberId();
  if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const supabase = createSupabaseAdminClient();

  try {
    const [{ data: sent, error: sentError }, { data: received, error: receivedError }] = await Promise.all([
      supabase
        .from("messages")
        .select("id,sender_id,receiver_id,content,type,voice_url,is_read,created_at")
        .eq("sender_id", memberId)
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("messages")
        .select("id,sender_id,receiver_id,content,type,voice_url,is_read,created_at")
        .eq("receiver_id", memberId)
        .order("created_at", { ascending: false })
        .limit(500),
    ]);

    if (sentError || receivedError) {
      return NextResponse.json({ error: sentError?.message || receivedError?.message || "تعذر تحميل المحادثات" }, { status: 500 });
    }

    const all = [...(sent || []), ...(received || [])].sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(),
    );

    const grouped = new Map<string, { last: any; unread: number }>();
    for (const message of all) {
      const otherId = message.sender_id === memberId ? message.receiver_id : message.sender_id;
      if (!grouped.has(otherId)) grouped.set(otherId, { last: message, unread: 0 });
      if (message.receiver_id === memberId && !message.is_read) grouped.get(otherId)!.unread += 1;
    }

    const memberIds = Array.from(grouped.keys()).filter(isSafeMemberId);
    if (!memberIds.length) return NextResponse.json({ conversations: [], unreadCount: 0 });

    const [{ data: members }, { data: details }, { data: photos }] = await Promise.all([
      supabase.from("members").select("id,username,last_seen,account_status").in("id", memberIds),
      supabase.from("member_details").select("member_id,gender,age").in("member_id", memberIds),
      supabase
        .from("photos")
        .select("member_id,image_url,is_primary,moderation_status")
        .in("member_id", memberIds)
        .eq("moderation_status", "approved"),
    ]);

    const memberById = new Map((members || []).map((item) => [item.id, item]));
    const detailById = new Map((details || []).map((item) => [item.member_id, item]));
    const photoById = new Map<string, string>();
    for (const photo of photos || []) {
      if (!photoById.has(photo.member_id) || photo.is_primary) photoById.set(photo.member_id, photo.image_url);
    }

    const conversations = memberIds
      .map((otherId) => {
        const group = grouped.get(otherId)!;
        const member = memberById.get(otherId);
        const detail = detailById.get(otherId);
        if (!member || member.account_status === "blocked" || member.account_status === "suspended") return null;
        const lastType = String(group.last.type || "text");
        return {
          memberId: otherId,
          member: {
            id: otherId,
            username: member.username || "عضو قلبي لوڤي",
            avatar_url: photoById.get(otherId) || fallbackAvatar(detail?.gender, detail?.age),
            is_online: online(member.last_seen),
          },
          lastMessage: lastType === "voice" ? "رسالة صوتية" : group.last.content || "محادثة جديدة",
          lastMessageType: lastType,
          created_at: group.last.created_at || new Date().toISOString(),
          unread: group.unread,
        };
      })
      .filter(Boolean)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({
      conversations,
      unreadCount: conversations.reduce((total: number, item: any) => total + item.unread, 0),
    });
  } catch (error) {
    console.error("messages-list", error);
    return NextResponse.json({ error: "تعذر تحميل المحادثات" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const senderId = await getCurrentMemberId();
  if (!senderId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  try {
    const body = await request.json();
    const receiverId = String(body.receiver_id || body.receiverId || "").trim();
    const content = String(body.content || "").trim();

    if (!isSafeMemberId(receiverId)) return NextResponse.json({ error: "العضو غير صالح" }, { status: 400 });
    if (!content) return NextResponse.json({ error: "اكتب الرسالة أولًا" }, { status: 400 });
    if (content.length > 4000) return NextResponse.json({ error: "الرسالة طويلة جدًا" }, { status: 400 });

    if (containsDirectContactInfo(content)) {
      const violation = await registerContactViolation(senderId, "message");
      return NextResponse.json(
        {
          error: violation.suspended
            ? "تم تعليق حسابك مؤقتًا بسبب تكرار محاولة مشاركة بيانات تواصل مباشرة."
            : "تم منع الرسالة: لا تشارك رقم هاتف أو رابطًا أو وسيلة تواصل خارجية. تكرار المخالفة قد يؤدي إلى تعليق الحساب.",
        },
        { status: 403 },
      );
    }

    const restriction = await ensureMessagingAccess(senderId, receiverId);
    if (restriction) return NextResponse.json({ error: restriction }, { status: 403 });

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content,
        type: "text",
        voice_url: null,
        is_read: false,
      })
      .select("id,sender_id,receiver_id,content,type,voice_url,is_read,created_at")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await createNotification({ memberId: receiverId, content: "لديك رسالة جديدة في قلبي لوڤي" });
    return NextResponse.json({ success: true, message: data });
  } catch (error) {
    console.error("message-send", error);
    return NextResponse.json({ error: "تعذر إرسال الرسالة الآن" }, { status: 500 });
  }
}
