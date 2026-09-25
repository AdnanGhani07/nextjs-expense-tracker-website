import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

export class SlidingWindowRateLimiter {
  private requests = new Map<string, number[]>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 5, windowMs = 10000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  public check(userId: string, currentTime = Date.now()): { allowed: boolean; remaining: number } {
    const timestamps = (this.requests.get(userId) || []).filter((t) => currentTime - t < this.windowMs);
    
    if (timestamps.length >= this.maxRequests) {
      return { allowed: false, remaining: 0 };
    }

    timestamps.push(currentTime);
    this.requests.set(userId, timestamps);
    return { allowed: true, remaining: this.maxRequests - timestamps.length };
  }

  public clear(userId: string) {
    this.requests.delete(userId);
  }
}

export function validateAIDescription(description: string | null | undefined): { valid: boolean; error?: string } {
  if (!description || description.trim().length < 2) {
    return { valid: false, error: 'Description too short for AI analysis' };
  }
  if (description.trim().length > 150) {
    return { valid: false, error: 'Description exceeds maximum allowed length' };
  }
  return { valid: true };
}

describe('Security & Rate Limiting Tests', () => {
  it('should allow requests within rate limit threshold (up to 5 per 10s)', () => {
    const limiter = new SlidingWindowRateLimiter(5, 10000);
    const userId = 'user_123';
    const now = 100000;

    for (let i = 0; i < 5; i++) {
      const res = limiter.check(userId, now + i * 100);
      assert.equal(res.allowed, true, `Request ${i + 1} should be allowed`);
    }
  });

  it('should block the 6th request within the 10-second window', () => {
    const limiter = new SlidingWindowRateLimiter(5, 10000);
    const userId = 'user_456';
    const now = 100000;

    for (let i = 0; i < 5; i++) {
      limiter.check(userId, now + i * 100);
    }

    const blockedRes = limiter.check(userId, now + 1000);
    assert.equal(blockedRes.allowed, false);
    assert.equal(blockedRes.remaining, 0);
  });

  it('should reset limits after sliding window period expires', () => {
    const limiter = new SlidingWindowRateLimiter(5, 10000);
    const userId = 'user_789';
    const startTime = 100000;

    for (let i = 0; i < 5; i++) {
      limiter.check(userId, startTime + i * 100);
    }

    // 10.5 seconds later
    const futureTime = startTime + 10500;
    const futureRes = limiter.check(userId, futureTime);
    assert.equal(futureRes.allowed, true);
  });

  it('should track separate limits for different users', () => {
    const limiter = new SlidingWindowRateLimiter(5, 10000);
    const now = 100000;

    // User A exhausts quota
    for (let i = 0; i < 5; i++) {
      limiter.check('user_A', now);
    }
    assert.equal(limiter.check('user_A', now).allowed, false);

    // User B should still be allowed
    assert.equal(limiter.check('user_B', now).allowed, true);
  });

  it('should reject descriptions that are too short (< 2 chars)', () => {
    assert.equal(validateAIDescription('').valid, false);
    assert.equal(validateAIDescription('a').valid, false);
    assert.equal(validateAIDescription('   ').valid, false);
    assert.equal(validateAIDescription('   x   ').valid, false);
  });

  it('should reject descriptions exceeding 150 characters', () => {
    const longText = 'x'.repeat(151);
    const res = validateAIDescription(longText);
    assert.equal(res.valid, false);
    assert.equal(res.error, 'Description exceeds maximum allowed length');
  });

  it('should accept valid descriptions between 2 and 150 characters', () => {
    assert.equal(validateAIDescription('Coffee').valid, true);
    assert.equal(validateAIDescription('Weekly grocery run at Trader Joes with family').valid, true);
  });
});
