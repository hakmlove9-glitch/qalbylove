export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

export async function GET() {
  try {
    await requireAdmin();
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("payments")
      .select("id,member_id,amount,wallet_number,wallet_network,sender_wallet,proof_path,plan_name,duration_months,requested_tier,transaction_ref,note,status,rejection_reason,created_at,reviewed_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: "تعذر تحميل طلبات الدفع" }, { status: 500 });

    const payments = await Promise.all((data || []).map(async (payment) => {
      let receipt_url: string | null = null;
      if (payment.proof_path) {
        const { data: signed } = await supabase.storage.from("payment-receipts").createSignedUrl(payment.proof_path, 600);
        receipt_url = signed?.signedUrl || null;
      }
      return { ...payment, receipt_url };
    }));

    return NextResponse.json({ payments });
  } catch {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
}
