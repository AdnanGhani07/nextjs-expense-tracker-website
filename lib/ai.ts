import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';

// --- INTERFACES (Unchanged) ---
interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence: number;
}

// --- GEMINI API INITIALIZATION ---
// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const modelName = 'gemini-1.5-flash-latest'; // Using a modern, fast model

export async function generateExpenseInsights(
  expenses: ExpenseRecord[]
): Promise<AIInsight[]> {
  try {
    const model = genAI.getGenerativeModel({
      model: modelName,
      // Enforce JSON output for reliable parsing
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const expensesSummary = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `You are a financial advisor AI. Analyze the following expense data and provide 3-4 actionable financial insights. 
    Return a JSON array of insights with this exact structure:
    [{
      "type": "warning|info|success|tip",
      "title": "Brief title",
      "message": "Detailed insight message with specific numbers when possible",
      "action": "Actionable suggestion",
      "confidence": 0.8
    }]

    Focus on:
    1. Spending patterns (day of week, categories)
    2. Budget alerts (high spending areas)
    3. Money-saving opportunities
    4. Positive reinforcement for good habits

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    if (!responseText) {
      throw new Error('No response from AI');
    }

    const insights = JSON.parse(responseText);

    const formattedInsights = insights.map(
      (insight: RawInsight, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        type: insight.type || 'info',
        title: insight.title || 'AI Insight',
        message: insight.message || 'Analysis complete',
        action: insight.action,
        confidence: insight.confidence || 0.8,
      })
    );

    return formattedInsights;
  } catch (error) {
    console.error('❌ Error generating AI insights with Gemini:', error);
    // Fallback logic remains the same
    return [
      {
        id: 'fallback-1',
        type: 'info',
        title: 'AI Analysis Unavailable',
        message:
          'Unable to generate personalized insights at this time. Please try again later.',
        action: 'Refresh insights',
        confidence: 0.5,
      },
    ];
  }
}

export async function categorizeExpense(description: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `You are an expense categorization AI. Categorize the following expense into one of these categories: Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Other. Respond with only the single category name.
    
    Expense: "${description}"`;

    const result = await model.generateContent(prompt);
    const category = result.response.text()?.trim();

    const validCategories = [
      'Food',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Bills',
      'Healthcare',
      'Other',
    ];

    return validCategories.includes(category || '') ? category! : 'Other';
  } catch (error) {
    console.error('❌ Error categorizing expense with Gemini:', error);
    return 'Other';
  }
}

export async function generateAIAnswer(
  question: string,
  context: ExpenseRecord[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });

    const expensesSummary = context.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `You are a helpful financial advisor AI. Based on the following expense data, provide a concise but thorough answer (2-3 sentences) to this question: "${question}"

    Use concrete data from the expenses when possible and offer actionable advice. Return only the answer text.

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    if (!response) {
      throw new Error('No response from AI');
    }

    return response.trim();
  } catch (error) {
    console.error('❌ Error generating AI answer with Gemini:', error);
    return "I'm unable to provide a detailed answer at the moment. Please try refreshing the insights or check your connection.";
  }
}