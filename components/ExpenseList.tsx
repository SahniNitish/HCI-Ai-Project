import React from 'react';
import { Expense } from '../types';
import { Trash2, Coffee, Bus, Home, Zap, Film, ShoppingBag, Heart, Plane, Box } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Food & Dining': return <Coffee size={18} className="text-orange-500" />;
    case 'Transportation': return <Bus size={18} className="text-blue-500" />;
    case 'Housing': return <Home size={18} className="text-indigo-500" />;
    case 'Utilities': return <Zap size={18} className="text-yellow-500" />;
    case 'Entertainment': return <Film size={18} className="text-pink-500" />;
    case 'Shopping': return <ShoppingBag size={18} className="text-purple-500" />;
    case 'Health & Wellness': return <Heart size={18} className="text-red-500" />;
    case 'Travel': return <Plane size={18} className="text-sky-500" />;
    default: return <Box size={18} className="text-slate-500" />;
  }
};

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Box className="text-slate-300" size={32} />
        </div>
        <h3 className="text-lg font-medium text-slate-800">No expenses yet</h3>
        <p className="text-slate-500">Add your first transaction to get started.</p>
      </div>
    );
  }

  // Sort by date descending
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-slate-50">
        {sortedExpenses.map((expense) => (
          <div key={expense.id} className="p-4 px-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                {getCategoryIcon(expense.category)}
              </div>
              <div>
                <p className="font-medium text-slate-800">{expense.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{expense.category}</span>
                  <span>•</span>
                  <span>{new Date(expense.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-800">
                -${expense.amount.toFixed(2)}
              </span>
              <button 
                onClick={() => onDelete(expense.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseList;