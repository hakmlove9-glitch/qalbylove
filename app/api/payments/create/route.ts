import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "هذا المسار القديم متوقف. استخدم مسار طلب الدفع الحالي." }, { status: 410 });
}
