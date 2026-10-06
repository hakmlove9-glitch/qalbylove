export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentMember } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function isAdmin(memberId: string) {
  const { data } = await supabase
    .from("members")
    .select("is_admin")
    .eq("id", memberId)
    .single();

  return data?.is_admin;
}

export async function GET() {
  const session = await getCurrentMember();

  if (!session?.memberId || !(await isAdmin(session.memberId))) {
    return NextResponse.json(
      { error: "غير مسموح" },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("account_status", "deactivated")
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    members: data || [],
  });
}

export async function PUT(request: Request) {
  const session = await getCurrentMember();

  if (!session?.memberId || !(await isAdmin(session.memberId))) {
    return NextResponse.json(
      { error: "غير مسموح" },
      { status: 403 }
    );
  }

  const { memberId } = await request.json();

  if (!memberId) {
    return NextResponse.json(
      { error: "رقم العضو مطلوب" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("members")
    .update({
      account_status: "active",
    })
    .eq("id", memberId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "تمت إعادة تفعيل الحساب",
  });
}
