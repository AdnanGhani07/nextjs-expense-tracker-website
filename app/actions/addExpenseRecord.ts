'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { checkUser } from '@/lib/checkUser';

import { z } from 'zod';

const recordSchema = z.object({
  text: z.string().trim().min(1, 'Description is required').max(150, 'Description is too long'),
  amount: z.number().positive('Amount must be greater than 0').max(10000000, 'Amount cannot exceed 10,000,000'),
  category: z.string().trim().min(1, 'Category is required').max(50, 'Category name is too long'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

interface RecordData {
  text: string;
  amount: number;
  category: string;
  date: string;
}

interface RecordResult {
  data?: RecordData;
  error?: string;
}

async function addExpenseRecord(formData: FormData): Promise<RecordResult> {
  const textValue = formData.get('text');
  const amountValue = formData.get('amount');
  const categoryValue = formData.get('category');
  const dateValue = formData.get('date');

  const rawAmount = parseFloat(amountValue ? amountValue.toString() : '');
  const validation = recordSchema.safeParse({
    text: textValue ? textValue.toString() : '',
    amount: isNaN(rawAmount) ? 0 : rawAmount,
    category: categoryValue ? categoryValue.toString() : '',
    date: dateValue ? dateValue.toString() : '',
  });

  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || 'Invalid input data' };
  }

  const { text, amount, category, date: inputDate } = validation.data;

  let date: string;
  try {
    const [year, month, day] = inputDate.split('-');
    const dateObj = new Date(
      Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0)
    );
    date = dateObj.toISOString();
  } catch (error) {
    console.error('Invalid date format:', error);
    return { error: 'Invalid date format' };
  }

  // Get logged in user
  const { userId } = await auth();

  // Check for user
  if (!userId) {
    return { error: 'User not found' };
  }

  // Ensure user exists in our database
  await checkUser();

  try {
    // Create a new record (allow multiple expenses per day)
    const createdRecord = await db.record.create({
      data: {
        text,
        amount,
        category,
        date, // Save the date to the database
        userId,
      },
    });

    const recordData: RecordData = {
      text: createdRecord.text,
      amount: createdRecord.amount,
      category: createdRecord.category,
      date: createdRecord.date?.toISOString() || date,
    };

    revalidatePath('/');

    return { data: recordData };
  } catch (error) {
    console.error('Error adding expense record:', error); // Log the error
    return {
      error: 'An unexpected error occurred while adding the expense record.',
    };
  }
}

export default addExpenseRecord;