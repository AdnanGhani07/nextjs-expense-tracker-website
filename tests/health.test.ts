import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

export function simulateHealthCheck(dbQueryFn: () => Promise<void>) {
  return async () => {
    const startTime = Date.now();
    let dbStatus = 'disconnected';

    try {
      await dbQueryFn();
      dbStatus = 'healthy';
    } catch {
      dbStatus = 'unhealthy';
    }

    const responseTimeMs = Date.now() - startTime;
    const isHealthy = dbStatus === 'healthy';

    return {
      status: isHealthy ? 200 : 503,
      body: {
        status: isHealthy ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        services: {
          database: dbStatus,
          api: 'healthy',
        },
        responseTimeMs,
      },
    };
  };
}

export function simulateHealthzProbe(dbQueryFn: () => Promise<void>) {
  return async () => {
    const startTime = Date.now();
    try {
      await dbQueryFn();
      return {
        status: 200,
        body: {
          status: 'healthy',
          timestamp: new Date().toISOString(),
          latencyMs: Date.now() - startTime,
        },
      };
    } catch (error) {
      return {
        status: 503,
        body: {
          status: 'unhealthy',
          error: (error as Error).message,
          latencyMs: Date.now() - startTime,
        },
      };
    }
  };
}

describe('Healthcheck & Probe Endpoint Tests', () => {
  it('should return 200 ok and healthy status when database is reachable', async () => {
    const healthHandler = simulateHealthCheck(async () => {
      // Simulate fast DB query
      await new Promise((r) => setTimeout(r, 5));
    });

    const res = await healthHandler();
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.services.database, 'healthy');
    assert.equal(res.body.services.api, 'healthy');
    assert.equal(typeof res.body.responseTimeMs, 'number');
    assert.equal(res.body.responseTimeMs >= 0, true);
  });

  it('should return 503 degraded when database connection fails', async () => {
    const healthHandler = simulateHealthCheck(async () => {
      throw new Error('Connection refused to Postgres');
    });

    const res = await healthHandler();
    assert.equal(res.status, 503);
    assert.equal(res.body.status, 'degraded');
    assert.equal(res.body.services.database, 'unhealthy');
    assert.equal(res.body.services.api, 'healthy');
  });

  it('should return 200 healthy for healthz liveness/readiness probe', async () => {
    const probeHandler = simulateHealthzProbe(async () => {});

    const res = await probeHandler();
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'healthy');
    assert.equal(typeof res.body.latencyMs, 'number');
  });

  it('should return 503 unhealthy for healthz probe when failure occurs', async () => {
    const probeHandler = simulateHealthzProbe(async () => {
      throw new Error('Deadlock or timeout');
    });

    const res = await probeHandler();
    assert.equal(res.status, 503);
    assert.equal(res.body.status, 'unhealthy');
    assert.equal(res.body.error, 'Deadlock or timeout');
  });
});
