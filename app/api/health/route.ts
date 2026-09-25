import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const startTime = Date.now();
  let dbStatus = 'disconnected';

  try {
    // Run simple query to verify database connection
    await db.$queryRaw`SELECT 1`;
    dbStatus = 'healthy';
  } catch (error) {
    console.error('Health check DB error:', error);
    dbStatus = 'unhealthy';
  }

  const responseTimeMs = Date.now() - startTime;
  const isHealthy = dbStatus === 'healthy';

  return NextResponse.json(
    {
      status: isHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        api: 'healthy',
      },
      responseTimeMs,
    },
    {
      status: isHealthy ? 200 : 503,
    }
  );
}
