'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const deleteSchema = z.object({
  recordId: z.string().min(1, 'Record ID is required'),
});

export async function deleteExpenseRecord(recordId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: 'Unauthorized: User not signed in' };
    }

    const validation = deleteSchema.safeParse({ recordId });
    if (!validation.success) {
      return { error: validation.error.issues[0]?.message || 'Invalid record ID' };
    }

    const existingRecord = await db.record.findFirst({
      where: {
        id: recordId,
        userId,
      },
    });

    if (!existingRecord) {
      return { error: 'Expense record not found or unauthorized' };
    }

    await db.record.delete({
      where: {
        id: recordId,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting expense record:', error);
    return { error: 'Failed to delete expense record' };
  }
}
