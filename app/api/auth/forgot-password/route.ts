export const dynamic = "force-dynamic";

import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

function normalizePhone(value: string) {
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  const eastern = "۰۱۲۳۴۵۶۷۸۹";
  return value
    .replace(/[٠-٩]/g, d => String(arabic.indexOf(d)))
    .replace(/[۰-۹]/g, d => String(eastern.indexOf(d)))
    .replace(/[^0-9+]/g, "")
    .replace(/^00/, "+");
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

async function createResetLinks(memberIds: string[]) {
  const supabase = createSupabaseAdminClient();
  const result: Record<string, string> = {};

  for (const memberId of memberIds) {
    await supabase.from("password_reset_tokens").delete().eq("member_id", memberId).is("used_at", null);
    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    await supabase.from("password_reset_tokens").insert({
      member_id: memberId,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    });
    result[memberId] = `${siteUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  }

  return result;
}

async function sendEmail(to: string, accounts: Array<{ username: string; resetUrl: string }>) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.PASSWORD_RESET_FROM_EMAIL || "قلبي لوڤي <no-reply@qalbylove.com>";
  const rows = accounts.map((a) => `<li style="margin:12px 0"><b>${a.username}</b> — <a href="${a.resetUrl}">إنشاء كلمة مرور جديدة</a></li>`).join("");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "استعادة حسابات قلبي لوڤي",
      html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.9"><h2>حساباتك على قلبي لوڤي</h2><p>وجدنا الحسابات التالية المرتبطة ببيانات الاستعادة التي أدخلتها:</p><ul>${rows}</ul><p>لأمانك لا نرسل كلمة المرور القديمة؛ أنشئ كلمة مرور جديدة من الرابط الخاص بكل حساب. الروابط صالحة لمدة 30 دقيقة.</p></div>`,
    }),
  });
  return response.ok;
}

async function sendWhatsApp(to: string, accounts: Array<{ username: string; resetUrl: string }>) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) return false;

  const text = [
    "استعادة حسابات قلبي لوڤي",
    "",
    ...accounts.flatMap((a) => [`الحساب: ${a.username}`, `رابط تعيين كلمة مرور جديدة: ${a.resetUrl}`, ""]),
    "لأمانك لا نرسل كلمة المرور القديمة. الروابط صالحة لمدة 30 دقيقة.",
  ].join("\n");

  const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: normalizePhone(to).replace(/^\+/, ""),
      type: "text",
      text: { preview_url: false, body: text },
    }),
  });
  return response.ok;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = normalizePhone(String(body.phone || "").trim());
    const supabase = createSupabaseAdminClient();

    if (!email && !phone) return NextResponse.json({ error: "اكتب البريد الإلكتروني أو رقم الهاتف" }, { status: 400 });

    let members: Array<{ id: string; username: string; email: string | null }> = [];

    if (email) {
      const escaped = email.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
      const { data } = await supabase.from("members").select("id,username,email").ilike("email", escaped).order("created_at", { ascending: true });
      members = (data || []) as typeof members;
    } else {
      const { data: details } = await supabase.from("member_details").select("member_id").eq("phone_normalized", phone);
      const ids = (details || []).map((d: any) => d.member_id).filter(Boolean);
      if (ids.length) {
        const { data } = await supabase.from("members").select("id,username,email").in("id", ids).order("created_at", { ascending: true });
        members = (data || []) as typeof members;
      }
    }

    // رد موحد لمنع كشف ما إذا كانت البيانات مسجلة.
    if (!members.length) {
      return NextResponse.json({ success: true, message: "إذا كانت البيانات مرتبطة بحسابات، ستصلك تعليمات الاستعادة خلال دقائق." });
    }

    const links = await createResetLinks(members.map(m => m.id));
    const accounts = members.map(m => ({ username: m.username, resetUrl: links[m.id] }));

    let sent = false;
    if (email) {
      sent = await sendEmail(email, accounts);
    } else {
      sent = await sendWhatsApp(phone, accounts);
      if (!sent) {
        const uniqueEmails = [...new Set(members.map(m => m.email).filter((v): v is string => Boolean(v)))];
        for (const address of uniqueEmails) sent = (await sendEmail(address, accounts)) || sent;
      }
    }

    return NextResponse.json({
      success: true,
      message: sent
        ? "أرسلنا أسماء الحسابات وروابط الاستعادة الآمنة."
        : "تم تجهيز طلب الاستعادة. فعّل إعدادات البريد أو واتساب في بيئة التشغيل لإرسال الرسالة تلقائيًا.",
      ...(process.env.NODE_ENV !== "production" ? { debugAccounts: accounts } : {}),
    });
  } catch (error) {
    console.error("forgot-password", error);
    return NextResponse.json({ error: "تعذر إرسال طلب الاستعادة الآن" }, { status: 500 });
  }
}
