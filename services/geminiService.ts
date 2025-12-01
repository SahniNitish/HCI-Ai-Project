import { GoogleGenAI, Type } from "@google/genai";
import { Expense, CATEGORIES, AdviceTone } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const categorizeExpenseAI = async (description: string, amount: number): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are an expense categorization assistant.
      The user spent ${amount} on "${description}".
      Pick the best category from this list: ${CATEGORIES.join(', ')}.
      Return ONLY the category name as a raw string. If unsure, return "Other".
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const category = response.text?.trim();
    if (category && CATEGORIES.includes(category as any)) {
      return category;
    }
    return 'Other';
  } catch (error) {
    console.error("Error categorizing expense:", error);
    return 'Other';
  }
};

export const getFinancialAdviceAI = async (expenses: Expense[], budget: number, tone: AdviceTone): Promise<{ advice: string; title: string }> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Summarize data for the prompt to save tokens
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryBreakdown = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    const recentExpenses = expenses.slice(0, 10).map(e => `${e.description}: $${e.amount}`).join(', ');

    const prompt = `
      Analyze these spending habits:
      Total Spent: $${totalSpent}
      Monthly Budget: $${budget > 0 ? budget : 'Not set'}
      Breakdown: ${JSON.stringify(categoryBreakdown)}
      Recent Transactions: ${recentExpenses}

      ${budget > 0 && totalSpent > budget ? "CRITICAL: User is over budget." : ""}
      ${budget > 0 && totalSpent < budget ? "User is under budget." : ""}

      Provide financial advice in a ${tone.toUpperCase()} tone.
      
      Response Format (JSON):
      {
        "title": "A short, catchy title (max 5 words)",
        "advice": "The advice paragraph (max 60 words). If funny, be witty/sarcastic. If serious, be professional/actionable."
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            advice: { type: Type.STRING },
          },
          required: ["title", "advice"]
        }
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error getting advice:", error);
    return {
      title: "Service Unavailable",
      advice: "I couldn't analyze your finances right now. Maybe I'm saving energy to lower your electric bill?"
    };
  }
};