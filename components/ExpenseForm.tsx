import React, { useState } from 'react';
import { ExpenseCategory, CATEGORIES } from '../types';
import { categorizeExpenseAI } from '../services/geminiService';
import { Loader2, Sparkles, Plus } from 'lucide-react';

interface ExpenseFormProps {
  onAddExpense: (amount: number, description: string, category: string, date: string) => void;
  onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, onClose }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isCategorizing, setIsCategorizing] = useState(false);

  const handleAutoCategorize = async () => {
    if (!description) return;
    setIsCategorizing(true);
    const detectedCategory = await categorizeExpenseAI(description, parseFloat(amount) || 0);
    setCategory(detectedCategory);
    setIsCategorizing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;
    onAddExpense(parseFloat(amount), description, category, date);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          ✕
        </button>
        
        <h2 className="text-xl font-bold text-slate-800 mb-6">Add New Expense</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-semibold text-lg"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
            <div className="relative">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => { if(description && !isCategorizing) handleAutoCategorize(); }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all pr-10"
                placeholder="e.g., Starbucks Coffee"
                required
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isCategorizing && <Loader2 className="animate-spin text-indigo-500" size={18} />}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1 flex justify-between">
              Category
              <button
                type="button"
                onClick={handleAutoCategorize}
                disabled={!description || isCategorizing}
                className="text-xs text-indigo-600 font-medium flex items-center gap-1 hover:text-indigo-700 disabled:opacity-50"
              >
                <Sparkles size={12} /> Auto-Detect
              </button>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;