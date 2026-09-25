'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { generateAIAnswer, ExpenseRecord } from '@/lib/ai';
import { z } from 'zod';

const questionSchema = z.string().trim().min(3, 'Question must be at least 3 characters').max(200, 'Question too long');

interface AskAIResult {
  answer?: string;
  error?: string;
}

export async function askAIAction(question: string): Promise<AskAIResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized: User not signed in' };
    }

    const validation = questionSchema.safeParse(question);
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message || 'Invalid question format' };
    }

    const records = await db.record.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 50,
    });

    const formattedRecords: ExpenseRecord[] = records.map((r) => ({
      id: r.id,
      amount: r.amount,
      category: r.category,
      description: r.text,
      date: r.date.toISOString().split('T')[0],
    }));

    const answer = await generateAIAnswer(validation.data, formattedRecords);
    return { answer };
  } catch (error) {
    console.error('Error in askAIAction:', error);
    return { error: 'Failed to generate answer at this time' };
  }
}
