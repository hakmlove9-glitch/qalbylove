export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

const MAX_RECIPIENTS = 1000;
const AUDIENCES = new Set(["all", "men", "women", "governorate", "founders", "subscribers", "non_subscribers", "incomplete"]);

async function getRecipients(audience: string, governorate: string, memberId: string) {
    const supabase = createSupabaseAdminClient();
    if (memberId) {
        const { data: member } = await supabase.from("members").select("id").eq("id", memberId).eq("account_status", "active").eq("is_admin", false).maybeSingle();
        return { ids: member ? [member.id] : [], count: member ? 1 : 0, available: Boolean(member) };
    }
    if (!AUDIENCES.has(audience)) throw new Error("اختر جمهوراً صحيحاً");
    if (audience === "governorate" && !governorate) throw new Error("اختر المحافظة أولاً");

    if (audience === "governorate") {
        const { data: details, error } = await supabase.from("member_details").select("member_id").eq("governorate", governorate).limit(MAX_RECIPIENTS + 1);
        if (error) throw new Error("تعذر تحميل جمهور المحافظة");
        const ids = [...new Set((details || []).map((item) => item.member_id).filter(Boolean))];
        if (ids.length > MAX_RECIPIENTS) return { ids: [], count: null, available: false };
        if (!ids.length) return { ids: [], count: 0, available: true };
        const { data: members, error: memberError } = await supabase.from("members").select("id").in("id", ids).eq("account_status", "active").eq("is_admin", false).limit(MAX_RECIPIENTS + 1);
        if (memberError) throw new Error("تعذر تحميل الأعضاء");
        const recipients = (members || []).map((item) => item.id);
        return { ids: recipients.slice(0, MAX_RECIPIENTS), count: recipients.length, available: recipients.length <= MAX_RECIPIENTS };
    }

    if (audience === "subscribers" || audience === "non_subscribers") {
        const { data: subscriptions, error } = await supabase.from("subscriptions").select("user_id").eq("status", "active").gte("ends_at", new Date().toISOString()).limit(MAX_RECIPIENTS + 1);
        if (error) throw new Error("تعذر تحميل الاشتراكات");
        const ids = [...new Set((subscriptions || []).map((item) => item.user_id).filter(Boolean))];
        if (ids.length > MAX_RECIPIENTS) return { ids: [], count: null, available: false };
        if (audience === "subscribers") {
            if (!ids.length) return { ids: [], count: 0, available: true };
            const { data: members } = await supabase.from("members").select("id").in("id", ids).eq("account_status", "active").eq("is_admin", false).limit(MAX_RECIPIENTS + 1);
            const recipients = (members || []).map((item) => item.id);
            return { ids: recipients.slice(0, MAX_RECIPIENTS), count: recipients.length, available: recipients.length <= MAX_RECIPIENTS };
        }
        let query = supabase.from("members").select("id", { count: "exact" }).eq("account_status", "active").eq("is_admin", false);
        if (ids.length) query = query.not("id", "in", `(${ids.join(",")})`);
        const { data: members, count, error: membersError } = await query.limit(MAX_RECIPIENTS + 1);
        if (membersError) throw new Error("تعذر تحميل الأعضاء");
        const recipients = (members || []).map((item) => item.id);
        return { ids: recipients.slice(0, MAX_RECIPIENTS), count: count ?? recipients.length, available: (count ?? recipients.length) <= MAX_RECIPIENTS };
    }

    let query = supabase.from("members").select("id", { count: "exact" }).eq("account_status", "active").eq("is_admin", false);
    if (audience === "men") query = query.eq("gender", "male");
    if (audience === "women") query = query.eq("gender", "female");
    if (audience === "founders") query = query.eq("is_founder", true);
    const { data: members, count, error } = await query.limit(MAX_RECIPIENTS + 1);
    if (error) throw new Error("تعذر تحميل الأعضاء");
    let ids = (members || []).map((item) => item.id);

    if (audience === "incomplete") {
        if ((count ?? ids.length) > MAX_RECIPIENTS) return { ids: [], count: null, available: false };
        if (!ids.length) return { ids: [], count: 0, available: true };
        const [{ data: details }, { data: photos }] = await Promise.all([
            supabase.from("member_details").select("member_id,age,governorate,city,country,marital_status,education,job,work_status,height,weight,prayer_status,health_status,bio,partner_specs,interests,personality_traits,housing_plan,marriage_timeline").in("member_id", ids),
            supabase.from("photos").select("member_id").in("member_id", ids).eq("moderation_status", "approved"),
        ]);
        const detailMap = new Map((details || []).map((row: any) => [row.member_id, row]));
        const photoIds = new Set((photos || []).map((row: any) => row.member_id));
        const required = ["age", "governorate", "city", "marital_status", "education", "job", "work_status", "height", "weight", "prayer_status", "health_status", "bio", "partner_specs", "housing_plan", "marriage_timeline"];
        ids = ids.filter((id) => {
            const details: any = detailMap.get(id) || {};
            return required.some((field) => !details[field]) || !Array.isArray(details.interests) || details.interests.length < 3 || !Array.isArray(details.personality_traits) || details.personality_traits.length < 3 || !photoIds.has(id);
        });
    }
    return { ids: ids.slice(0, MAX_RECIPIENTS), count: audience === "incomplete" ? ids.length : count ?? ids.length, available: (audience === "incomplete" ? ids.length : count ?? ids.length) <= MAX_RECIPIENTS };
}

async function admin() {
    try { return await requireAdmin(); } catch { return null; }
}

export async function GET(request: Request) {
    const session = await admin();
    if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    try {
        const params = new URL(request.url).searchParams;
        const result = await getRecipients(params.get("audience") || "all", params.get("governorate") || "", params.get("member_id") || "");
        return NextResponse.json({ ...result, maxRecipients: MAX_RECIPIENTS });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "تعذر تجهيز الجمهور" }, { status: 400 });
    }
}

export async function POST(request: Request) {
    const session = await admin();
    if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    try {
        const body = await request.json();
        const content = String(body.content || "").trim();
        if (!content || content.length > 1000) return NextResponse.json({ error: "اكتب رسالة من 1 إلى 1000 حرف" }, { status: 400 });
        const audience = String(body.audience || "all");
        const result = await getRecipients(audience, String(body.governorate || ""), String(body.member_id || ""));
        if (!result.available) return NextResponse.json({ error: result.count === null ? "تعذر تحديد العدد الكامل لهذا الجمهور ضمن الحد الآمن. اختر جمهوراً أضيق." : `عدد المستلمين ${result.count} ويتجاوز حد الإرسال الآمن (${MAX_RECIPIENTS}). اختر جمهوراً أضيق.` }, { status: 413 });
        if (!result.ids.length) return NextResponse.json({ error: "لا يوجد مستلمون لهذا الاختيار" }, { status: 400 });

        const supabase = createSupabaseAdminClient();
        const message = `رسالة من إدارة قلبي لوڤي: ${content}`;
        const { error } = await supabase.from("notifications").insert(result.ids.map((member_id) => ({ member_id, content: message, is_read: false })));
        if (error) return NextResponse.json({ error: "تعذر إرسال الرسالة. لم يتم تأكيد الإرسال." }, { status: 500 });
        await supabase.from("admin_logs").insert({ admin_id: session.memberId, action: "admin_message_sent", details: { audience, recipient_count: result.ids.length, message_excerpt: content.slice(0, 120) } });
        return NextResponse.json({ success: true, recipientCount: result.ids.length });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "تعذر إرسال الرسالة" }, { status: 400 });
    }
}
