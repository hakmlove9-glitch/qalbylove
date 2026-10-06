export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request
) {
  try {
    const cookieStore =
      await cookies();

    const currentUserId =
      cookieStore.get(
        "qalbylove_session"
      )?.value;

    const url = new URL(
      request.url
    );

    const requestedUserId =
      url.searchParams.get(
        "member_id"
      );

    const userId =
      requestedUserId ||
      currentUserId;

    if (!userId) {
      return NextResponse.json(
        {
          error:
            "يجب تسجيل الدخول",
        },
        { status: 401 }
      );
    }

    const { data, error } =
      await supabase
        .from("user_subscriptions")
        .select("*")
        .eq(
          "user_id",
          userId
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          error:
            error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscription:
        data || null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "تعذر تحميل الاشتراك",
      },
      { status: 500 }
    );
  }
}