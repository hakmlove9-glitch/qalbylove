export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentMember } from "@/lib/auth";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function dayNumber() {
  return Math.floor(Date.now() / 86400000);
}

export async function GET() {
  const session = await getCurrentMember();
  if (!session) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const { data: questions, error } = await supabase
    .from("daily_questions")
    .select("id,prompt,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!questions?.length) return NextResponse.json({ question: null });

  const question = questions[dayNumber() % questions.length];
  const today = new Date().toISOString().slice(0, 10);
  const { data: answer } = await supabase
    .from("daily_answers")
    .select("answer")
    .eq("member_id", session.memberId)
    .eq("question_id", question.id)
    .eq("answer_date", today)
    .maybeSingle();

  return NextResponse.json({ question: { ...question, answer: answer?.answer || "" } });
}

export async function POST(request: Request) {
  const session = await getCurrentMember();
  if (!session) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  try {
    const body = await request.json();
    const questionId = String(body.question_id || "").trim();
    const answer = String(body.answer || "").trim().slice(0, 280);
    if (!questionId || answer.length < 2) return NextResponse.json({ error: "اكتب إجابة قصيرة أولًا" }, { status: 400 });
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from("daily_answers").upsert({
      member_id: session.memberId,
      question_id: questionId,
      answer_date: today,
      answer,
      updated_at: new Date().toISOString(),
    }, { onConflict: "member_id,question_id,answer_date" });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "تعذر حفظ الإجابة" }, { status: 500 });
  }
}
