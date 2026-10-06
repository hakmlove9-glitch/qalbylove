export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getMemberId() {
  const cookieStore = await cookies();

  return cookieStore.get(
    "qalbylove_session"
  )?.value;
}

export async function GET() {
  try {
    const memberId = await getMemberId();

    if (!memberId) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const { data: favorites, error } =
      await supabase
        .from("favorites")
        .select(
          "id, user_id, favorite_id, created_at"
        )
        .eq("user_id", memberId)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const favoriteIds = [
      ...Array.from(new Set((favorites || []).map(
          (item) => item.favorite_id
        )
      )),
    ];

    let members: {
      id: string;
      username: string;
    }[] = [];

    if (favoriteIds.length > 0) {
      const { data } =
        await supabase
          .from("members")
          .select(
            "id, username"
          )
          .in(
            "id",
            favoriteIds
          );

      members = data || [];
    }

    const result =
      (favorites || []).map(
        (favorite) => ({
          ...favorite,
          member:
            members.find(
              (member) =>
                member.id ===
                favorite.favorite_id
            ) || null,
        })
      );

    return NextResponse.json({
      favorites: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "حدث خطأ أثناء تحميل المفضلة",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
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

    const body = await request.json();

    const favoriteId = String(
      body.favorite_id || ""
    ).trim();

    if (!favoriteId) {
      return NextResponse.json(
        {
          error:
            "العضو غير موجود",
        },
        { status: 400 }
      );
    }

    if (favoriteId === memberId) {
      return NextResponse.json(
        {
          error:
            "لا يمكنك إضافة نفسك للمفضلة",
        },
        { status: 400 }
      );
    }

    const { data: member } =
      await supabase
        .from("members")
        .select("id")
        .eq("id", favoriteId)
        .maybeSingle();

    if (!member) {
      return NextResponse.json(
        {
          error:
            "العضو غير موجود",
        },
        { status: 404 }
      );
    }

    const { data: existing } =
      await supabase
        .from("favorites")
        .select("id")
        .eq(
          "user_id",
          memberId
        )
        .eq(
          "favorite_id",
          favoriteId
        )
        .maybeSingle();

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        message:
          "العضو موجود بالفعل في المفضلة",
      });
    }

    const { data: favorite, error } =
      await supabase
        .from("favorites")
        .insert({
          user_id: memberId,
          favorite_id: favoriteId,
        })
        .select(
          "id, user_id, favorite_id, created_at"
        )
        .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      favorite,
      message:
        "تمت إضافة العضو للمفضلة ❤️",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "حدث خطأ أثناء إضافة المفضلة",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request
) {
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

    const body = await request.json();

    const favoriteId = String(
      body.favorite_id || ""
    ).trim();

    if (!favoriteId) {
      return NextResponse.json(
        {
          error:
            "العضو غير موجود",
        },
        { status: 400 }
      );
    }

    const { error } =
      await supabase
        .from("favorites")
        .delete()
        .eq(
          "user_id",
          memberId
        )
        .eq(
          "favorite_id",
          favoriteId
        );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "تمت إزالة العضو من المفضلة",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "حدث خطأ أثناء إزالة المفضلة",
      },
      { status: 500 }
    );
  }
}