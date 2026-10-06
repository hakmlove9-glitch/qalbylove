import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "إنشاء العضوية يتم من خلال الدفع المعتمد أو كود التفعيل فقط." }, { status: 410 });
}
