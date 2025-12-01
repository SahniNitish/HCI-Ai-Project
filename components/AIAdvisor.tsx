import React, { useState } from 'react';
import { Expense, AdviceTone, FinancialAdvice } from '../types';
import { getFinancialAdviceAI } from '../services/geminiService';
import { Bot, Smile, Briefcase, RefreshCw, Quote } from 'lucide-react';

interface AIAdvisorProps {
  expenses: Expense[];
  budget: number;
}

const AIAdvisor: React.FC<AIAdvisorProps> = ({ expenses, budget }) => {
  const [tone, setTone] = useState<AdviceTone>('serious');
  const [advice, setAdvice] = useState<FinancialAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAdvice = async () => {
    if (expenses.length === 0) return;
    setIsLoading(true);
    const result = await getFinancialAdviceAI(expenses, budget, tone);
    setAdvice({ advice: result.advice, keyTakeaway: result.title });
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Bot className="text-indigo-200" /> AI Financial Advisor
          </h2>
          <p className="text-indigo-100 mb-6 max-w-lg">
            Get personalized insights based on your spending habits and budget. Choose your preferred style below.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl flex items-center">
               <button
                 onClick={() => setTone('serious')}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                   tone === 'serious' ? 'bg-white text-indigo-700 shadow-md' : 'text-indigo-100 hover:bg-white/10'
                 }`}
               >
                 <Briefcase size={16} /> Serious
               </button>
               <button
                 onClick={() => setTone('funny')}
                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                   tone === 'funny' ? 'bg-white text-indigo-700 shadow-md' : 'text-indigo-100 hover:bg-white/10'
                 }`}
               >
                 <Smile size={16} /> Funny
               </button>
             </div>

             <button
              onClick={handleGetAdvice}
              disabled={isLoading || expenses.length === 0}
              className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-md hover:bg-indigo-50 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
             >
               {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <SparklesIcon />}
               {isLoading ? 'Analyzing...' : 'Generate Advice'}
             </button>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl"></div>
      </div>

      {expenses.length === 0 && (
         <div className="text-center py-12 text-slate-400">
           Add some expenses first to unlock AI advice!
         </div>
      )}

      {advice && !isLoading && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8 relative animate-in slide-in-from-bottom-4 duration-500">
           <Quote className="absolute top-6 left-6 text-indigo-100" size={64} />
           <div className="relative z-10">
             <h3 className="text-xl font-bold text-slate-800 mb-3">{advice.keyTakeaway}</h3>
             <p className="text-slate-600 leading-relaxed text-lg">
               "{advice.advice}"
             </p>
             <div className="mt-6 flex justify-end">
               <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-500 rounded-full">
                 AI Generated • {tone === 'funny' ? 'Humorous Mode' : 'Professional Mode'}
               </span>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Simple icon helper
const SparklesIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
);

export default AIAdvisor;