import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import AIAdvisor from './components/AIAdvisor';
import { Expense } from './types';
import { LayoutDashboard, List, Bot, Plus, Wallet } from 'lucide-react';

// Mock data to make the app feel populated for new users
const MOCK_DATA: Expense[] = [
  { 
    id: '1', 
    amount: 14.50, 
    description: 'Morning Coffee & Bagel', 
    category: 'Food & Dining', 
    date: new Date().toISOString().split('T')[0] 
  },
  { 
    id: '2', 
    amount: 32.00, 
    description: 'Uber to Downtown', 
    category: 'Transportation', 
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0] // Yesterday
  },
  { 
    id: '3', 
    amount: 125.40, 
    description: 'Weekly Groceries', 
    category: 'Food & Dining', 
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0] 
  },
  { 
    id: '4', 
    amount: 15.99, 
    description: 'Netflix Subscription', 
    category: 'Entertainment', 
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0] 
  },
  { 
    id: '5', 
    amount: 180.00, 
    description: 'Electric Bill', 
    category: 'Utilities', 
    date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0] 
  },
  { 
    id: '6', 
    amount: 89.95, 
    description: 'New Running Shoes', 
    category: 'Shopping', 
    date: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0] 
  },
  { 
    id: '7', 
    amount: 45.00, 
    description: 'Pharmacy', 
    category: 'Health & Wellness', 
    date: new Date(Date.now() - 86400000 * 15).toISOString().split('T')[0] 
  },
  { 
    id: '8', 
    amount: 450.00, 
    description: 'Weekend Getaway Hotel', 
    category: 'Travel', 
    date: new Date(Date.now() - 86400000 * 20).toISOString().split('T')[0] 
  },
];

function App() {
  // State
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : MOCK_DATA;
  });
  
  const [budget, setBudget] = useState<number>(() => {
    const saved = localStorage.getItem('budget');
    // Default budget of 2500 if none is set, to show off the progress bar
    return saved ? parseFloat(saved) : 2500;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'advisor'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('budget', budget.toString());
  }, [budget]);

  // Handlers
  const addExpense = (amount: number, description: string, category: string, date: string) => {
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount,
      description,
      category,
      date,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Wallet size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">SmartSpend<span className="text-indigo-600">AI</span></h1>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="md:hidden bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={24} />
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-indigo-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <Plus size={18} /> Add Expense
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Navigation (Desktop) */}
          <aside className="hidden md:block w-64 shrink-0 space-y-2 sticky top-24 h-fit">
            <NavButton 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
              icon={<LayoutDashboard size={20} />} 
              label="Dashboard" 
            />
            <NavButton 
              active={activeTab === 'transactions'} 
              onClick={() => setActiveTab('transactions')} 
              icon={<List size={20} />} 
              label="Transactions" 
            />
            <NavButton 
              active={activeTab === 'advisor'} 
              onClick={() => setActiveTab('advisor')} 
              icon={<Bot size={20} />} 
              label="AI Advisor" 
            />
          </aside>

          {/* Page Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'dashboard' && (
              <Dashboard 
                expenses={expenses} 
                budget={budget} 
                onSetBudget={setBudget} 
              />
            )}
            {activeTab === 'transactions' && <ExpenseList expenses={expenses} onDelete={deleteExpense} />}
            {activeTab === 'advisor' && <AIAdvisor expenses={expenses} budget={budget} />}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 pb-safe">
        <div className="flex justify-around items-center h-16">
          <MobileNavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard size={24} />} 
            label="Home" 
          />
          <MobileNavButton 
            active={activeTab === 'transactions'} 
            onClick={() => setActiveTab('transactions')} 
            icon={<List size={24} />} 
            label="History" 
          />
          <MobileNavButton 
            active={activeTab === 'advisor'} 
            onClick={() => setActiveTab('advisor')} 
            icon={<Bot size={24} />} 
            label="Advisor" 
          />
        </div>
      </nav>

      {/* Add Expense Modal */}
      {isFormOpen && (
        <ExpenseForm 
          onAddExpense={addExpense} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
}

// Helpers for Navigation Components
const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
      active 
        ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    {icon}
    {label}
  </button>
);

const MobileNavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
      active ? 'text-indigo-600' : 'text-slate-400'
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;