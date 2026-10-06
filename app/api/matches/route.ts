export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentMemberId } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getMemberId() {
  return getCurrentMemberId();
}

export async function GET() {
  try {
    const memberId =
      await getMemberId();

    if (!memberId) {
      return NextResponse.json(
        {
          error:
            "يجب تسجيل الدخول",
        },
        { status: 401 }
      );
    }

    const { data: matches, error } =
      await supabase
        .from("matches")
        .select(
          "id, member_one, member_two, created_at"
        )
        .or(
          `member_one.eq.${memberId},member_two.eq.${memberId}`
        )
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    const otherIds = [
      ...Array.from(new Set((matches || []).map(
          (match) =>
            match.member_one ===
            memberId
              ? match.member_two
              : match.member_one
        )
      )),
    ];

    let members: {
      id: string;
      username: string;
    }[] = [];

    if (otherIds.length > 0) {
      const { data } =
        await supabase
          .from("members")
          .select(
            "id, username"
          )
          .in("id", otherIds);

      members = data || [];
    }

    const result =
      (matches || []).map(
        (match) => {
          const otherMemberId =
            match.member_one ===
            memberId
              ? match.member_two
              : match.member_one;

          return {
            ...match,
            member:
              members.find(
                (member) =>
                  member.id ===
                  otherMemberId
              ) || null,
          };
        }
      );

    return NextResponse.json({
      matches: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "حدث خطأ أثناء تحميل التطابقات",
      },
      { status: 500 }
    );
  }
}