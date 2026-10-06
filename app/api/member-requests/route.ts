export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCurrentMemberId } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { isSafeMemberId } from "@/lib/messaging";
import { createNotification } from "@/lib/create-notification";

async function ensureMatch(supabase: ReturnType<typeof createSupabaseAdminClient>, firstId: string, secondId: string) {
    const condition = `and(member_one.eq.${firstId},member_two.eq.${secondId}),and(member_one.eq.${secondId},member_two.eq.${firstId})`;
    const { data: existing } = await supabase.from("matches").select("id").or(condition).maybeSingle();
    if (existing) return true;
    const { error } = await supabase.from("matches").insert({ member_one: firstId, member_two: secondId });
    if (!error) return true;
    const { data: concurrent } = await supabase.from("matches").select("id").or(condition).maybeSingle();
    return Boolean(concurrent);
}

export async function GET() {
    const memberId = await getCurrentMemberId();
    if (!memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const supabase = createSupabaseAdminClient();
    const { data: requests, error } = await supabase
        .from("member_requests")
        .select("id,sender_id,receiver_id,status,created_at")
        .eq("receiver_id", memberId)
        .order("created_at", { ascending: false })
        .limit(50);
    if (error) return NextResponse.json({ error: "تعذر تحميل طلبات الزواج" }, { status: 500 });

    const senderIds = [...new Set((requests || []).map((item) => item.sender_id).filter(Boolean))];
    const [{ data: members }, { data: details }] = await Promise.all([
        senderIds.length ? supabase.from("members").select("id,username,created_at,member_number").in("id", senderIds) : Promise.resolve({ data: [] }),
        senderIds.length ? supabase.from("member_details").select("member_id,display_name,age,city,governorate,country").in("member_id", senderIds) : Promise.resolve({ data: [] }),
    ]);

    const memberMap = new Map((members || []).map((item: any) => [item.id, item]));
    const detailMap = new Map((details || []).map((item: any) => [item.member_id, item]));
    return NextResponse.json({
        requests: (requests || []).map((item) => ({
            ...item,
            sender: { ...(memberMap.get(item.sender_id) || {}), ...(detailMap.get(item.sender_id) || {}) },
        })),
    });
}

export async function POST(request: Request) {
    const senderId = await getCurrentMemberId();
    if (!senderId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    try {
        const body = await request.json();
        const receiverId = String(body.receiver_id || "").trim();
        if (!isSafeMemberId(receiverId) || receiverId === senderId) {
            return NextResponse.json({ error: "العضو غير صالح" }, { status: 400 });
        }

        const supabase = createSupabaseAdminClient();
        const [{ data: receiver }, { data: settings }, { data: existing }, { data: blocks }] = await Promise.all([
            supabase.from("members").select("id,account_status").eq("id", receiverId).maybeSingle(),
            supabase.from("member_settings").select("show_profile").eq("member_id", receiverId).maybeSingle(),
            supabase.from("member_requests").select("id,status").eq("sender_id", senderId).eq("receiver_id", receiverId).maybeSingle(),
            supabase.from("blocks").select("id").or(`and(blocker_id.eq.${senderId},blocked_id.eq.${receiverId}),and(blocker_id.eq.${receiverId},blocked_id.eq.${senderId})`).limit(1),
        ]);

        if (!receiver || ["blocked", "suspended", "deleted"].includes(String(receiver.account_status || "")) || settings?.show_profile === false) {
            return NextResponse.json({ error: "هذا الملف غير متاح" }, { status: 404 });
        }
        if ((blocks || []).length) return NextResponse.json({ error: "لا يمكن إرسال طلب لهذا العضو" }, { status: 403 });
        if (existing) return NextResponse.json({ success: true, alreadyExists: true, message: "تم إرسال طلبك من قبل." });

        const { data: memberRequest, error } = await supabase
            .from("member_requests")
            .insert({ sender_id: senderId, receiver_id: receiverId, status: "pending" })
            .select("id,status,created_at")
            .single();

        if (error) return NextResponse.json({ error: "تعذر إرسال الطلب الآن" }, { status: 500 });
        await createNotification({ memberId: receiverId, content: "لديك طلب زواج جاد جديد." });
        return NextResponse.json({ success: true, memberRequest, message: "تم إرسال طلب الزواج الجاد." }, { status: 201 });
    } catch (error) {
        console.error("member-request", error);
        return NextResponse.json({ error: "تعذر إرسال الطلب الآن" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const receiverId = await getCurrentMemberId();
    if (!receiverId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    try {
        const body = await request.json();
        const requestId = String(body.id || "").trim();
        const status = String(body.status || "").trim();
        if (!requestId || !["accepted", "rejected"].includes(status)) {
            return NextResponse.json({ error: "طلب الزواج أو الحالة غير صحيحة" }, { status: 400 });
        }

        const supabase = createSupabaseAdminClient();
        const { data: memberRequest } = await supabase
            .from("member_requests")
            .select("id,sender_id,receiver_id,status")
            .eq("id", requestId)
            .eq("receiver_id", receiverId)
            .maybeSingle();
        if (!memberRequest) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });

        if (status === "accepted" && !await ensureMatch(supabase, memberRequest.sender_id, receiverId)) {
            return NextResponse.json({ error: "تعذر إنشاء التطابق. حاول مرة أخرى." }, { status: 500 });
        }

        const { data, error } = await supabase
            .from("member_requests")
            .update({ status })
            .eq("id", requestId)
            .eq("receiver_id", receiverId)
            .select("id,status,sender_id,receiver_id,created_at")
            .single();
        if (error) return NextResponse.json({ error: "تعذر تحديث الطلب" }, { status: 500 });

        await createNotification({
            memberId: memberRequest.sender_id,
            content: status === "accepted" ? "تم قبول طلب الزواج الجاد، وأصبح التواصل متاحاً بينكما." : "تم الرد على طلب الزواج الجاد.",
        });
        return NextResponse.json({ success: true, request: data, mutual: status === "accepted" });
    } catch (error) {
        console.error("member-request-update", error);
        return NextResponse.json({ error: "تعذر تحديث الطلب" }, { status: 500 });
    }
}