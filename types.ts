export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export enum ExpenseCategory {
  Food = 'Food & Dining',
  Transport = 'Transportation',
  Housing = 'Housing',
  Utilities = 'Utilities',
  Entertainment = 'Entertainment',
  Shopping = 'Shopping',
  Health = 'Health & Wellness',
  Travel = 'Travel',
  Other = 'Other'
}

export const CATEGORIES = Object.values(ExpenseCategory);

export type AdviceTone = 'funny' | 'serious';

export interface FinancialAdvice {
  advice: string;
  keyTakeaway: string;
}