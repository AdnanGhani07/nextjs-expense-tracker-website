'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { generateExpenseInsights, AIInsight, ExpenseRecord } from '@/lib/ai';

interface InsightsResult {
  insights?: AIInsight[];
  error?: string;
}

export async function getAIInsightsAction(): Promise<InsightsResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized: User not signed in' };
    }

    const records = await db.record.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 50,
    });

    if (records.length === 0) {
      return {
        insights: [
          {
            id: 'welcome-tip',
            type: 'info',
            title: 'No Expenses Recorded Yet',
            message: 'Add a few expenses above so our AI can analyze your spending patterns and uncover savings opportunities!',
            action: 'Add your first expense',
            confidence: 1.0,
          },
        ],
      };
    }

    const formattedRecords: ExpenseRecord[] = records.map((r) => ({
      id: r.id,
      amount: r.amount,
      category: r.category,
      description: r.text,
      date: r.date.toISOString().split('T')[0],
    }));

    const insights = await generateExpenseInsights(formattedRecords);
    return { insights };
  } catch (error) {
    console.error('Error in getAIInsightsAction:', error);
    return { error: 'Failed to generate AI insights' };
  }
}
