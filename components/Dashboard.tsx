import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Expense } from '../types';
import { DollarSign, TrendingUp, CreditCard, Pencil, Check, X, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  expenses: Expense[];
  budget: number;
  onSetBudget: (amount: number) => void;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6'];

const Dashboard: React.FC<DashboardProps> = ({ expenses, budget, onSetBudget }) => {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.toString());

  const totalSpent = useMemo(() => expenses.reduce((acc, curr) => acc + curr.amount, 0), [expenses]);
  
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach(e => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const recentSpending = useMemo(() => {
    // Group by date (last 5 days)
    const data: Record<string, number> = {};
    const last5Expenses = [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 15); // Take recent 15 to map to days

    last5Expenses.forEach(e => {
      const date = new Date(e.date).toLocaleDateString(undefined, { weekday: 'short' });
      data[date] = (data[date] || 0) + e.amount;
    });

    return Object.entries(data).map(([name, amount]) => ({ name, amount })).reverse();
  }, [expenses]);

  const handleSaveBudget = () => {
    const val = parseFloat(newBudget);
    if (!isNaN(val) && val >= 0) {
      onSetBudget(val);
      setIsEditingBudget(false);
    }
  };

  const cancelEditBudget = () => {
    setNewBudget(budget.toString());
    setIsEditingBudget(false);
  };

  // Budget calculations
  const progress = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const isOverBudget = budget > 0 && totalSpent > budget;
  const remaining = Math.max(budget - totalSpent, 0);
  
  let progressColor = 'bg-emerald-500';
  if (progress > 75) progressColor = 'bg-amber-400';
  if (progress > 90) progressColor = 'bg-rose-500';
  if (isOverBudget) progressColor = 'bg-red-600';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Budget Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Monthly Budget</h2>
            <p className="text-sm text-slate-500">Track your spending limits</p>
          </div>
          {!isEditingBudget ? (
            <button 
              onClick={() => {
                setNewBudget(budget.toString());
                setIsEditingBudget(true);
              }}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Budget"
            >
              <Pencil size={18} />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w-28 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm font-semibold"
                placeholder="0.00"
                autoFocus
              />
              <button 
                onClick={handleSaveBudget}
                className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <Check size={16} />
              </button>
              <button 
                onClick={cancelEditBudget}
                className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {budget > 0 ? (
          <div>
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-3xl font-bold text-slate-800">${totalSpent.toFixed(2)}</span>
                <span className="text-slate-400 ml-2 font-medium">/ ${budget.toFixed(2)}</span>
              </div>
              <div className={`text-sm font-semibold ${isOverBudget ? 'text-red-500' : 'text-emerald-600'}`}>
                {isOverBudget ? (
                  <span className="flex items-center gap-1"><AlertTriangle size={14} /> ${Math.abs(budget - totalSpent).toFixed(2)} over</span>
                ) : (
                  <span>${remaining.toFixed(2)} left</span>
                )}
              </div>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full ${progressColor} transition-all duration-1000 ease-out`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 mb-3">No budget set for this month</p>
            {!isEditingBudget && (
              <button 
                onClick={() => setIsEditingBudget(true)}
                className="text-indigo-600 font-medium hover:underline"
              >
                Set a budget now
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Spent</p>
            <h3 className="text-2xl font-bold text-slate-800">${totalSpent.toFixed(2)}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Transactions</p>
            <h3 className="text-2xl font-bold text-slate-800">{expenses.length}</h3>
          </div>
        </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Top Category</p>
            <h3 className="text-xl font-bold text-slate-800 truncate max-w-[150px]">
              {categoryData.length > 0 ? categoryData[0].name : '-'}
            </h3>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[350px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Expenses by Category</h3>
          {categoryData.length > 0 ? (
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {categoryData.slice(0, 5).map((entry, index) => (
                  <div key={entry.name} className="flex items-center text-xs text-slate-500">
                    <span className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[350px]">
           <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
           {recentSpending.length > 0 ? (
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={recentSpending}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                   <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   />
                   <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           ) : (
            <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;