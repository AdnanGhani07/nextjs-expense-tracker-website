'use server';

import { auth } from '@clerk/nextjs/server';
import { categorizeExpense } from '@/lib/ai';

// Simple in-memory rate limiter per user (3 requests per 10 seconds)
const userRequests = new Map<string, number[]>();

export async function suggestCategory(
  description: string
): Promise<{ category: string; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        category: 'Other',
        error: 'Please sign in to use AI categorization',
      };
    }

    const now = Date.now();
    const timestamps = (userRequests.get(userId) || []).filter((t) => now - t < 10000);
    if (timestamps.length >= 5) {
      return {
        category: 'Other',
        error: 'Rate limit reached. Please wait a moment before trying again.',
      };
    }
    timestamps.push(now);
    userRequests.set(userId, timestamps);

    if (!description || description.trim().length < 2) {
      return {
        category: 'Other',
        error: 'Description too short for AI analysis',
      };
    }

    if (description.trim().length > 150) {
      return {
        category: 'Other',
        error: 'Description exceeds maximum allowed length',
      };
    }

    const category = await categorizeExpense(description.trim());
    return { category };
  } catch (error) {
    console.error('❌ Error in suggestCategory server action:', error);
    return {
      category: 'Other',
      error: 'Unable to suggest category at this time',
    };
  }
}