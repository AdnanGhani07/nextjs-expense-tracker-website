import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  try {
    // Quick DB connectivity check
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - startTime,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Healthz probe failure:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: (error as Error).message,
        latencyMs: Date.now() - startTime,
      },
      { status: 503 }
    );
  }
}
