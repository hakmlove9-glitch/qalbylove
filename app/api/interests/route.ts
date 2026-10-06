export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentMemberId } from "@/lib/auth";
import { createNotification } from "@/lib/create-notification";
import { isSafeMemberId } from "@/lib/messaging";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getMemberId() {
  return getCurrentMemberId();
}

async function ensureMatch(memberOne: string, memberTwo: string) {
  const query = `and(member_one.eq.${memberOne},member_two.eq.${memberTwo}),and(member_one.eq.${memberTwo},member_two.eq.${memberOne})`;
  const { data: existing } = await supabase.from("matches").select("id").or(query).maybeSingle();
  if (existing) return true;

  const { error } = await supabase.from("matches").insert({ member_one: memberOne, member_two: memberTwo });
  if (!error) return true;

  const { data: concurrentMatch } = await supabase.from("matches").select("id").or(query).maybeSingle();
  return Boolean(concurrentMatch);
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

    const { data: interests, error } =
      await supabase
        .from("interests")
        .select(
          "id, sender_id, receiver_id, status, created_at"
        )
        .eq("receiver_id", memberId)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const senderIds = [
      ...Array.from(new Set((interests || []).map(
        (item) => item.sender_id
      )
      )),
    ];

    let members: any[] = [];

    if (senderIds.length > 0) {
      const { data } =
        await supabase
          .from("members")
          .select("id, username")
          .in("id", senderIds);

      members = data || [];
    }

    const result = (interests || []).map(
      (interest) => ({
        ...interest,
        sender:
          members.find(
            (member) =>
              member.id ===
              interest.sender_id
          ) || null,
      })
    );

    return NextResponse.json({
      interests: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "حدث خطأ أثناء تحميل الاهتمامات",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const senderId =
      await getMemberId();

    if (!senderId) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const receiverId = String(
      body.receiver_id || ""
    ).trim();

    if (!isSafeMemberId(receiverId)) {
      return NextResponse.json(
        {
          error:
            "العضو غير موجود",
        },
        { status: 400 }
      );
    }

    if (senderId === receiverId) {
      return NextResponse.json(
        {
          error:
            "لا يمكنك إرسال اهتمام لنفسك",
        },
        { status: 400 }
      );
    }

    const [{ data: receiver }, { data: blocks }] = await Promise.all([
      supabase.from("members").select("id,username,account_status").eq("id", receiverId).maybeSingle(),
      supabase.from("blocks").select("id").or(`and(blocker_id.eq.${senderId},blocked_id.eq.${receiverId}),and(blocker_id.eq.${receiverId},blocked_id.eq.${senderId})`).limit(1),
    ]);

    if (!receiver || ["blocked", "suspended", "deleted"].includes(String(receiver.account_status || ""))) {
      return NextResponse.json(
        {
          error:
            "العضو غير موجود",
        },
        { status: 404 }
      );
    }
    if ((blocks || []).length) {
      return NextResponse.json({ error: "لا يمكن إرسال اهتمام بين هذين الحسابين" }, { status: 403 });
    }

    const { data: existing } =
      await supabase
        .from("interests")
        .select(
          "id, status"
        )
        .eq(
          "sender_id",
          senderId
        )
        .eq(
          "receiver_id",
          receiverId
        )
        .maybeSingle();

    if (existing) {
      const { data: reciprocal } = await supabase
        .from("interests")
        .select("id")
        .eq("sender_id", receiverId)
        .eq("receiver_id", senderId)
        .maybeSingle();
      const mutual = Boolean(reciprocal && await ensureMatch(senderId, receiverId));
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        mutual,
        message:
          existing.status ===
            "accepted"
            ? "تم قبول الاهتمام بالفعل"
            : "تم إرسال الاهتمام مسبقًا",
      });
    }

    const { data: interest, error } =
      await supabase
        .from("interests")
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          status: "pending",
        })
        .select()
        .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const { data: reciprocal } = await supabase
      .from("interests")
      .select("id")
      .eq("sender_id", receiverId)
      .eq("receiver_id", senderId)
      .maybeSingle();
    const mutual = Boolean(reciprocal && await ensureMatch(senderId, receiverId));
    if (reciprocal && !mutual) {
      return NextResponse.json({ error: "تم حفظ الاهتمام، لكن تعذر إنشاء التطابق. حاول مرة أخرى." }, { status: 500 });
    }

    await createNotification({
      memberId: receiverId,
      content:
        "💕 لديك اهتمام جديد من عضو مهتم بملفك",
    });
    if (mutual) {
      await createNotification({ memberId: senderId, content: "💕 الاهتمام متبادل، يمكنكما بدء المحادثة الآن." });
    }

    return NextResponse.json({
      success: true,
      interest,
      mutual,
      message:
        "تم إرسال الاهتمام بنجاح 💕",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "حدث خطأ أثناء إرسال الاهتمام",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request
) {
  try {
    const memberId =
      await getMemberId();

    if (!memberId) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const interestId = String(
      body.id || ""
    ).trim();

    const status = String(
      body.status || ""
    ).trim();

    if (!interestId) {
      return NextResponse.json(
        {
          error:
            "الاهتمام غير موجود",
        },
        { status: 400 }
      );
    }

    if (
      !["accepted", "rejected"].includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          error:
            "حالة غير صحيحة",
        },
        { status: 400 }
      );
    }

    const { data: interest, error } =
      await supabase
        .from("interests")
        .update({
          status,
        })
        .eq("id", interestId)
        .eq(
          "receiver_id",
          memberId
        )
        .select()
        .single();

    if (error || !interest) {
      return NextResponse.json(
        {
          error:
            error?.message ||
            "تعذر تحديث الاهتمام",
        },
        { status: 500 }
      );
    }

    if (status === "accepted") {
      const firstMember =
        interest.sender_id;

      const secondMember =
        interest.receiver_id;

      const { data: existingMatch } =
        await supabase
          .from("matches")
          .select("id")
          .or(
            `and(member_one.eq.${firstMember},member_two.eq.${secondMember}),and(member_one.eq.${secondMember},member_two.eq.${firstMember})`
          )
          .maybeSingle();

      if (!existingMatch) {
        await supabase
          .from("matches")
          .insert({
            member_one:
              firstMember,
            member_two:
              secondMember,
          });
      }

      await createNotification({
        memberId:
          interest.sender_id,
        content:
          "💕 تم قبول اهتمامك! أصبح بينكما تطابق.",
      });
    }

    if (status === "rejected") {
      await createNotification({
        memberId:
          interest.sender_id,
        content:
          "تم تحديث حالة الاهتمام الخاص بك.",
      });
    }

    return NextResponse.json({
      success: true,
      interest,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "حدث خطأ أثناء تحديث الاهتمام",
      },
      { status: 500 }
    );
  }
}