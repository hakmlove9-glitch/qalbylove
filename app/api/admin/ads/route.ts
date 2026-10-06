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
    .from("ads")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ads: data || [],
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

  const { adId, status } = await request.json();

  if (!adId || !status) {
    return NextResponse.json(
      { error: "بيانات ناقصة" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("ads")
    .update({
      status,
    })
    .eq("id", adId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "تم تحديث الإعلان",
  });
}
