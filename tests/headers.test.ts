import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import nextConfig from '../next.config.ts';

describe('Next.js Production & Security Header Configuration Tests', () => {
  it('should have output: "standalone" for minimal Docker image size', () => {
    assert.equal(nextConfig.output, 'standalone');
  });

  it('should permit Clerk avatar images via remotePatterns', () => {
    const patterns = nextConfig.images?.remotePatterns;
    assert.equal(Array.isArray(patterns), true);
    const clerkPattern = patterns?.find((p: any) => p.hostname === 'img.clerk.com');
    assert.notEqual(clerkPattern, undefined);
    assert.equal(clerkPattern?.protocol, 'https');
  });

  it('should configure required security headers', async () => {
    assert.equal(typeof nextConfig.headers, 'function');
    if (nextConfig.headers) {
      const headerConfigs = await nextConfig.headers();
      assert.equal(headerConfigs.length > 0, true);
      const rootConfig = headerConfigs[0];
      assert.equal(rootConfig.source, '/(.*)');

      const headerMap = new Map(rootConfig.headers.map((h: any) => [h.key, h.value]));
      
      assert.equal(headerMap.get('X-Content-Type-Options'), 'nosniff');
      assert.equal(headerMap.get('X-Frame-Options'), 'DENY');
      assert.equal(headerMap.get('Referrer-Policy'), 'strict-origin-when-cross-origin');
      assert.equal(headerMap.get('Permissions-Policy'), 'camera=(), microphone=(), geolocation=()');
    }
  });
});
