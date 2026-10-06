export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCurrentMember } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { MEMBERSHIP_PLANS } from "@/lib/constants";
import { isValidCashNetwork, isValidEgyptianWalletPhone, OFFICIAL_PAYMENT_PHONE } from "@/lib/payments";

const RECEIPT_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_RECEIPT_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const session = await getCurrentMember();
    if (!session?.memberId) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

    const formData = await request.formData();
    const planId = String(formData.get("plan_id") || "").trim();
    const plan = MEMBERSHIP_PLANS.find((item) => item.id === planId);
    if (!plan) return NextResponse.json({ error: "اختر عضوية صحيحة" }, { status: 400 });

    const walletNetwork = String(formData.get("wallet_network") || "").trim();
    const senderWallet = String(formData.get("sender_wallet") || "").trim();
    const transactionRef = String(formData.get("transaction_ref") || "").trim().slice(0, 120);
    const note = String(formData.get("note") || "").trim().slice(0, 500);
    const receipt = formData.get("receipt") as File | null;

    if (!walletNetwork || !senderWallet || !receipt) {
      return NextResponse.json({ error: "بيانات التحويل غير مكتملة" }, { status: 400 });
    }
    if (!isValidCashNetwork(walletNetwork)) {
      return NextResponse.json({ error: "اختر شبكة تحويل صحيحة" }, { status: 400 });
    }
    if (!isValidEgyptianWalletPhone(senderWallet)) {
      return NextResponse.json({ error: "رقم المحفظة المحول منها غير صحيح" }, { status: 400 });
    }
    if (!RECEIPT_TYPES.has(receipt.type) || receipt.size <= 0) {
      return NextResponse.json({ error: "صيغة الإيصال غير مدعومة" }, { status: 400 });
    }
    if (receipt.size > MAX_RECEIPT_SIZE) {
      return NextResponse.json({ error: "صورة الإيصال أكبر من 5 ميجابايت" }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();

    if (transactionRef) {
      const { data: duplicate } = await supabase
        .from("payments")
        .select("id")
        .eq("transaction_ref", transactionRef)
        .neq("status", "rejected")
        .maybeSingle();
      if (duplicate) return NextResponse.json({ error: "رقم العملية مستخدم في طلب سابق" }, { status: 409 });
    }

    const extension = receipt.type === "image/png" ? "png" : receipt.type === "image/webp" ? "webp" : "jpg";
    const proofPath = `${session.memberId}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const buffer = Buffer.from(await receipt.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("payment-receipts")
      .upload(proofPath, buffer, { contentType: receipt.type, upsert: false, cacheControl: "3600" });

    if (uploadError) return NextResponse.json({ error: "تعذر رفع إيصال التحويل" }, { status: 500 });

    const payload = {
      member_id: session.memberId,
      amount: plan.price,
      wallet_number: OFFICIAL_PAYMENT_PHONE,
      wallet_network: walletNetwork,
      sender_wallet: senderWallet,
      proof_url: null,
      proof_path: proofPath,
      plan_name: plan.title,
      duration_months: plan.durationMonths,
      requested_tier: plan.id,
      transaction_ref: transactionRef || null,
      note: note || null,
      status: "pending",
    };

    const { data, error } = await supabase.from("payments").insert(payload).select("id,amount,plan_name,status,created_at").single();
    if (error) {
      await supabase.storage.from("payment-receipts").remove([proofPath]);
      console.error("payment-request insert:", error.message);
      return NextResponse.json({ error: "تعذر تسجيل طلب الدفع. حاول مرة أخرى." }, { status: 500 });
    }

    return NextResponse.json({ success: true, payment: data, message: "تم إرسال طلب الدفع وانتظار مراجعة الإدارة" }, { status: 201 });
  } catch (error) {
    console.error("payment-request", error);
    return NextResponse.json({ error: "تعذر إرسال طلب الدفع الآن" }, { status: 500 });
  }
}
