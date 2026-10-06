export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { createSessionSignature } from "@/lib/session";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = String(body.identifier || body.username || body.email || "").trim();
    const password = String(body.password || "");

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "اكتب الاسم الظاهر في المنصة وكلمة المرور" },
        { status: 400 },
      );
    }

    let member: any = null;

    if (identifier.includes("@")) {
      const { data: emailMembers, error } = await supabase
        .from("members")
        .select("*")
        .ilike("email", identifier.toLowerCase())
        .limit(10);

      if (error || !emailMembers?.length) {
        return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
      }

      if (emailMembers.length > 1) {
        return NextResponse.json(
          {
            error:
              "هذا البريد مرتبط بأكثر من حساب. ادخل بالاسم الظاهر الخاص بحسابك، أو استخدم استرجاع الحساب لعرض الحسابات المرتبطة بالبريد.",
          },
          { status: 409 },
        );
      }

      member = emailMembers[0];
    } else {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .ilike("username", identifier)
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
      }

      member = data;
    }

    if (!(await bcrypt.compare(password, String(member.password_hash || "")))) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    if (member.account_status && member.account_status !== "active") {
      return NextResponse.json(
        { error: "الحساب غير متاح حاليًا. تواصل مع الإدارة إذا كنت تعتقد أن هناك خطأ." },
        { status: 403 },
      );
    }

    let hiddenAllowed = false;
    if (body.hiddenLogin) {
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("plan_name,status,ends_at")
        .eq("user_id", member.id)
        .eq("status", "active")
        .gte("ends_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      hiddenAllowed =
        member.is_founder === true ||
        Boolean(subscription && subscription.plan_name && subscription.plan_name !== "الأساسية");
    }

    const response = NextResponse.json({
      success: true,
      hiddenAllowed,
      member: {
        id: member.id,
        username: member.username,
        memberNumber: member.member_number,
        is_admin: member.is_admin === true,
      },
    });

    const sessionSignature = await createSessionSignature(String(member.id));

    response.cookies.set("qalbylove_session", String(member.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    response.cookies.set("qalbylove_session_sig", sessionSignature, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    response.cookies.set("qalbylove_hidden", hiddenAllowed ? "1" : "0", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("login", error);
    return NextResponse.json({ error: "تعذر تسجيل الدخول الآن" }, { status: 500 });
  }
}
