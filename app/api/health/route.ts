export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    site: 'qalbylove.com',
    timestamp: new Date().toISOString(),
  })
}
