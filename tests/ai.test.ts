import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

export const VALID_CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Other',
];

export function validateOrFallbackCategory(rawCategory: string | null | undefined): string {
  const trimmed = rawCategory?.trim() || '';
  return VALID_CATEGORIES.includes(trimmed) ? trimmed : 'Other';
}

export interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}

export function formatInsights(rawInsights: RawInsight[]) {
  const validTypes = new Set(['warning', 'info', 'success', 'tip']);
  return rawInsights.map((insight, index) => ({
    id: `ai-${Date.now()}-${index}`,
    type: (insight.type && validTypes.has(insight.type) ? insight.type : 'info') as 'warning' | 'info' | 'success' | 'tip',
    title: insight.title || 'AI Insight',
    message: insight.message || 'Analysis complete',
    action: insight.action,
    confidence: typeof insight.confidence === 'number' ? insight.confidence : 0.8,
  }));
}

export function getFallbackInsight() {
  return [
    {
      id: 'fallback-1',
      type: 'info' as const,
      title: 'AI Analysis Unavailable',
      message: 'Unable to generate personalized insights at this time. Please try again later.',
      action: 'Refresh insights',
      confidence: 0.5,
    },
  ];
}

describe('AI Layer & Resilient Fallback Tests', () => {
  it('should accept valid categories from whitelist', () => {
    for (const cat of VALID_CATEGORIES) {
      assert.equal(validateOrFallbackCategory(cat), cat);
    }
  });

  it('should fallback to "Other" for unexpected or hallucinated categories', () => {
    assert.equal(validateOrFallbackCategory('Cryptocurrency'), 'Other');
    assert.equal(validateOrFallbackCategory('Pets and Animals'), 'Other');
    assert.equal(validateOrFallbackCategory('random-nonsense'), 'Other');
    assert.equal(validateOrFallbackCategory(''), 'Other');
    assert.equal(validateOrFallbackCategory(null), 'Other');
    assert.equal(validateOrFallbackCategory(undefined), 'Other');
  });

  it('should correctly format raw AI insights with defaults', () => {
    const raw: RawInsight[] = [
      {
        type: 'warning',
        title: 'High Dining Expenses',
        message: 'You spent $350 on dining out this month, which is 40% of your budget.',
        action: 'Cook at home 2 more days per week',
        confidence: 0.9,
      },
      {
        // Missing type, title, message, confidence
      },
    ];

    const formatted = formatInsights(raw);
    assert.equal(formatted.length, 2);

    assert.equal(formatted[0].type, 'warning');
    assert.equal(formatted[0].title, 'High Dining Expenses');
    assert.equal(formatted[0].confidence, 0.9);

    assert.equal(formatted[1].type, 'info');
    assert.equal(formatted[1].title, 'AI Insight');
    assert.equal(formatted[1].message, 'Analysis complete');
    assert.equal(formatted[1].confidence, 0.8);
  });

  it('should return resilient fallback when AI services fail or timeout', () => {
    const fallback = getFallbackInsight();
    assert.equal(fallback.length, 1);
    assert.equal(fallback[0].id, 'fallback-1');
    assert.equal(fallback[0].title, 'AI Analysis Unavailable');
    assert.equal(fallback[0].action, 'Refresh insights');
  });
});
