'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { checkUser } from '@/lib/checkUser';

export interface ExpenseRecordItem {
  id: string;
  text: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

interface GetRecordsResult {
  records?: ExpenseRecordItem[];
  error?: string;
}

export async function getExpenseRecords(query?: string, category?: string): Promise<GetRecordsResult> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized: User not signed in' };
    }

    await checkUser();

    const whereClause: {
      userId: string;
      category?: string;
      text?: { contains: string; mode: 'insensitive' };
    } = {
      userId,
    };

    if (category && category !== 'All') {
      whereClause.category = category;
    }

    if (query && query.trim()) {
      whereClause.text = {
        contains: query.trim(),
        mode: 'insensitive',
      };
    }

    const records = await db.record.findMany({
      where: whereClause,
      orderBy: {
        date: 'desc',
      },
      take: 100,
    });

    const formattedRecords: ExpenseRecordItem[] = records.map((record) => ({
      id: record.id,
      text: record.text,
      amount: record.amount,
      category: record.category,
      date: record.date.toISOString(),
      createdAt: record.createdAt.toISOString(),
    }));

    return { records: formattedRecords };
  } catch (error) {
    console.error('Error fetching expense records:', error);
    return { error: 'Failed to retrieve expense records' };
  }
}
