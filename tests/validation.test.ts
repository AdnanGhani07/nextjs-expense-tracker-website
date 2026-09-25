import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';

// Mirroring the exact validation schema from app/actions/addExpenseRecord.ts
export const recordSchema = z.object({
  text: z.string().trim().min(1, 'Description is required').max(150, 'Description is too long'),
  amount: z.number().positive('Amount must be greater than 0').max(10000000, 'Amount cannot exceed 10,000,000'),
  category: z.string().trim().min(1, 'Category is required').max(50, 'Category name is too long'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

describe('Input Validation & Zod Schema Tests', () => {
  it('should accept valid expense inputs', () => {
    const validData = {
      text: 'Grocery shopping at Trader Joes',
      amount: 85.50,
      category: 'Food',
      date: '2026-09-25',
    };

    const result = recordSchema.safeParse(validData);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.amount, 85.50);
      assert.equal(result.data.category, 'Food');
      assert.equal(result.data.text, 'Grocery shopping at Trader Joes');
      assert.equal(result.data.date, '2026-09-25');
    }
  });

  it('should trim leading and trailing whitespace from text and category', () => {
    const dataWithWhitespace = {
      text: '   Electric Bill   ',
      amount: 120.0,
      category: '   Bills   ',
      date: '2026-09-01',
    };

    const result = recordSchema.safeParse(dataWithWhitespace);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.text, 'Electric Bill');
      assert.equal(result.data.category, 'Bills');
    }
  });

  it('should reject zero or negative amounts', () => {
    const zeroAmount = {
      text: 'Coffee',
      amount: 0,
      category: 'Food',
      date: '2026-09-25',
    };
    const negAmount = {
      text: 'Coffee',
      amount: -15.50,
      category: 'Food',
      date: '2026-09-25',
    };

    const resZero = recordSchema.safeParse(zeroAmount);
    assert.equal(resZero.success, false);
    if (!resZero.success) {
      assert.equal(resZero.error.issues[0]?.message, 'Amount must be greater than 0');
    }

    const resNeg = recordSchema.safeParse(negAmount);
    assert.equal(resNeg.success, false);
    if (!resNeg.success) {
      assert.equal(resNeg.error.issues[0]?.message, 'Amount must be greater than 0');
    }
  });

  it('should reject amounts exceeding maximum ceiling (10,000,000)', () => {
    const overLimit = {
      text: 'Superyacht',
      amount: 10000001,
      category: 'Shopping',
      date: '2026-09-25',
    };

    const result = recordSchema.safeParse(overLimit);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.issues[0]?.message, 'Amount cannot exceed 10,000,000');
    }
  });

  it('should reject empty or whitespace-only descriptions', () => {
    const emptyDesc = {
      text: '    ',
      amount: 50,
      category: 'Shopping',
      date: '2026-09-25',
    };

    const result = recordSchema.safeParse(emptyDesc);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.issues[0]?.message, 'Description is required');
    }
  });

  it('should reject descriptions longer than 150 characters', () => {
    const longDesc = {
      text: 'A'.repeat(151),
      amount: 50,
      category: 'Shopping',
      date: '2026-09-25',
    };

    const result = recordSchema.safeParse(longDesc);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.issues[0]?.message, 'Description is too long');
    }
  });

  it('should reject empty categories', () => {
    const emptyCat = {
      text: 'Gas refill',
      amount: 45,
      category: '   ',
      date: '2026-09-25',
    };

    const result = recordSchema.safeParse(emptyCat);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.issues[0]?.message, 'Category is required');
    }
  });

  it('should reject categories longer than 50 characters', () => {
    const longCat = {
      text: 'Gas refill',
      amount: 45,
      category: 'C'.repeat(51),
      date: '2026-09-25',
    };

    const result = recordSchema.safeParse(longCat);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.issues[0]?.message, 'Category name is too long');
    }
  });

  it('should validate date format strictly as YYYY-MM-DD', () => {
    const invalidDates = [
      '25-09-2026',
      '09/25/2026',
      '2026/09/25',
      'September 25, 2026',
      '2026-9-25',
      'invalid-date',
    ];

    for (const d of invalidDates) {
      const res = recordSchema.safeParse({
        text: 'Lunch',
        amount: 20,
        category: 'Food',
        date: d,
      });
      assert.equal(res.success, false, `Expected date '${d}' to be rejected`);
      if (!res.success) {
        assert.equal(res.error.issues[0]?.message, 'Date must be in YYYY-MM-DD format');
      }
    }
  });

  it('should correctly format UTC date for database storage', () => {
    const inputDate = '2026-09-25';
    const [year, month, day] = inputDate.split('-');
    const dateObj = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0));
    const isoString = dateObj.toISOString();

    assert.equal(isoString.startsWith('2026-09-25T12:00:00'), true);
  });
});
