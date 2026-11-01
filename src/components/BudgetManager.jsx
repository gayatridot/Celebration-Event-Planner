import React, { useState, useEffect, useMemo } from 'react';
import {
  DollarSign, PieChart, Plus, Trash2, Check, X, Sparkles,
  TrendingUp, TrendingDown, AlertTriangle, Wallet, Users,
  CreditCard, CheckCircle2, Clock, Copy, RefreshCw
} from 'lucide-react';
import { getStoredApiKey } from '../services/storageService';

// Default budget allocation categories per event type
const DEFAULT_CATEGORIES = {
  Marriage: [
    'Venue & Mandap', 'Catering & Dining', 'Photography & Video',
    'Decor & Floral', 'Bridal & Groom Attire', 'Music & DJ / Sangeet',
    'Invitations & Stationery', 'Jewelry & Gifts', 'Transport & Lodging', 'Miscellaneous'
  ],
  Birthday: [
    'Venue Rental', 'Cake & Desserts', 'Food & Refreshments',
    'Theme Decorations & Balloons', 'Entertainment / Magician', 'Photography',
    'Party Favors & Goodie Bags', 'Games & Activities', 'Miscellaneous'
  ],
  Diwali: [
    'Pooja Samagri & Decor', 'Mithai & Sweets Feast', 'Lighting & Diyas',
    'Gifts & Dry Fruits', 'Fireworks / Sparklers', 'Traditional Attire', 'Miscellaneous'
  ],
  Corporate: [
    'Conference Venue', 'Executive Catering', 'Audio/Visual & Staging',
    'Keynote Speaker & Host', 'Branding & Swag Bags', 'Photography & Press', 'Transport & Lodging', 'Miscellaneous'
  ],
  Anniversary: [
    'Banquet Venue', 'Fine Dining & Drinks', 'Floral Decor & Ambience',
    'Live Acoustic Music', 'Photography & Album', 'Cake & Toasts', 'Gifts & Keepsakes', 'Miscellaneous'
  ],
  Community: [
    'Event Grounds / Hall', 'Community Feast / Stalls', 'Stage, Sound & Lights',
    'Permits & Security', 'Signage & Marketing', 'Volunteer Supplies', 'Prizes & Honors', 'Miscellaneous'
  ]
};

// Smart fallback budget breakdown suggestions
const FALLBACK_BUDGET_ADVICE = {
  Marriage: [
    { category: 'Venue & Mandap', pct: 25, tip: 'Book 8-12 months early; check package deals including chairs and lighting.' },
    { category: 'Catering & Dining', pct: 30, tip: 'Plan ~₹1,200 - ₹2,500/plate. Live counters leave lasting impressions.' },
    { category: 'Photography & Video', pct: 12, tip: 'Invest in candid photo + cinematic teaser team; request raw backup files.' },
    { category: 'Decor & Floral', pct: 12, tip: 'Opt for seasonal blooms like marigolds & tuberoses to save up to 30%.' },
    { category: 'Bridal & Groom Attire', pct: 8, tip: 'Shop wedding markets early and budget for tailoring & accessories.' },
    { category: 'Music & DJ / Sangeet', pct: 6, tip: 'Book anchor/emcee with DJ package to bundle sound console costs.' },
    { category: 'Miscellaneous & Buffer', pct: 7, tip: 'Keep a 7% reserve for unexpected vendor tips and last-minute transport.' }
  ],
  Birthday: [
    { category: 'Food & Refreshments', pct: 35, tip: 'Finger foods, pizza/sliders & mocktails keep costs controlled.' },
    { category: 'Venue Rental', pct: 25, tip: 'Park pavilions, clubhouses, or cafes with party packages save money.' },
    { category: 'Theme Decorations & Balloons', pct: 15, tip: 'Balloon arches and DIY banner photo-corners make great backdrops.' },
    { category: 'Cake & Desserts', pct: 10, tip: 'Custom theme cakes look grand; supplement with sheet cake for large guest counts.' },
    { category: 'Entertainment / Games', pct: 10, tip: 'Hire an entertainer or prep interactive party games with simple prizes.' },
    { category: 'Party Favors & Misc', pct: 5, tip: 'Customized edible favors or plant saplings are memorable and affordable.' }
  ],
  Community: [
    { category: 'Event Grounds / Hall', pct: 25, tip: 'Check municipal community halls or open parks for subsidized permit rates.' },
    { category: 'Stage, Sound & Lights', pct: 25, tip: 'Audio quality is paramount; ensure cordless mics and monitor speakers.' },
    { category: 'Community Feast / Stalls', pct: 30, tip: 'Partner with local vendors for co-sponsored snack stalls and chai counters.' },
    { category: 'Permits, Safety & Security', pct: 10, tip: 'File police, fire, and sanitation permissions at least 30 days ahead.' },
    { category: 'Marketing & Signage', pct: 10, tip: 'Use WhatsApp community groups and reusable eco-friendly flex banners.' }
  ]
};

export const BudgetManager = ({ isOpen, onClose, event, onToast }) => {
  const storageKey = event?.id ? `event_budget_${event.id}` : 'temp_budget';
  const categoryList = (event && DEFAULT_CATEGORIES[event.category]) || DEFAULT_CATEGORIES.Community;

  // Local State
  const [budgetData, setBudgetData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved budget:', e);
    }
    return {
      totalBudget: 150000,
      guestCount: 100,
      currencySymbol: '₹',
      expenses: [
        {
          id: 'exp-1',
          name: 'Advance Venue Booking Deposit',
          amount: 45000,
          category: categoryList[0] || 'Venue',
          date: event.date || new Date().toISOString().split('T')[0],
          isPaid: true,
          notes: '50% advance cleared via UPI'
        },
        {
          id: 'exp-2',
          name: 'Welcome Drinks & Catering Tasting',
          amount: 15000,
          category: categoryList[1] || 'Catering',
          date: event.date || new Date().toISOString().split('T')[0],
          isPaid: false,
          notes: 'Balance due upon menu sign-off'
        }
      ]
    };
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(budgetData));
    } catch (e) {
      console.error('Failed to save budget:', e);
    }
  }, [budgetData, storageKey]);

  // Form state for adding an expense
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    category: categoryList[0] || 'Miscellaneous',
    date: new Date().toISOString().split('T')[0],
    isPaid: false,
    notes: ''
  });

  // Filters & UI states
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PAID, PENDING
  const [isAiAdvising, setIsAiAdvising] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // Derived calculations
  const totalBudget = Number(budgetData.totalBudget) || 0;
  const guestCount = Number(budgetData.guestCount) || 1;
  const currency = budgetData.currencySymbol || '₹';

  const expenses = budgetData.expenses || [];

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  const paidAmount = useMemo(() => {
    return expenses
      .filter((e) => e.isPaid)
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  const pendingAmount = totalSpent - paidAmount;
  const remainingBudget = totalBudget - totalSpent;
  const percentUsed = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 100) : 0;
  const costPerGuest = guestCount > 0 ? Math.round(totalSpent / guestCount) : 0;
  const budgetedPerGuest = guestCount > 0 ? Math.round(totalBudget / guestCount) : 0;

  // Breakdown by category
  const categoryBreakdown = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      const cat = e.category || 'Miscellaneous';
      map[cat] = (map[cat] || 0) + (Number(e.amount) || 0);
    });
    return Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
    })).sort((a, b) => b.amount - a.amount);
  }, [expenses, totalSpent]);

  // Add Expense Handler
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.name.trim() || !newExpense.amount) {
      onToast?.('Please enter an expense name and amount.', 'error');
      return;
    }

    const item = {
      id: `exp-${Date.now()}`,
      name: newExpense.name.trim(),
      amount: Number(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date || new Date().toISOString().split('T')[0],
      isPaid: Boolean(newExpense.isPaid),
      notes: newExpense.notes.trim()
    };

    setBudgetData((prev) => ({
      ...prev,
      expenses: [item, ...prev.expenses]
    }));

    setNewExpense({
      name: '',
      amount: '',
      category: categoryList[0] || 'Miscellaneous',
      date: new Date().toISOString().split('T')[0],
      isPaid: false,
      notes: ''
    });

    onToast?.(`Added "${item.name}" (${currency}${item.amount.toLocaleString()})`, 'success');
  };

  // Toggle paid status
  const handleTogglePaid = (id) => {
    setBudgetData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((e) => (e.id === id ? { ...e, isPaid: !e.isPaid } : e))
    }));
  };

  // Delete Expense
  const handleDeleteExpense = (id) => {
    setBudgetData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id)
    }));
    onToast?.('Expense entry removed', 'info');
  };

  // Filtered expenses list
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchCategory = filterCategory === 'ALL' || e.category === filterCategory;
      const matchStatus =
        filterStatus === 'ALL' ||
        (filterStatus === 'PAID' && e.isPaid) ||
        (filterStatus === 'PENDING' && !e.isPaid);
      return matchCategory && matchStatus;
    });
  }, [expenses, filterCategory, filterStatus]);

  // AI Budget Advisor
  const handleGetAiAdvice = async () => {
    setIsAiAdvising(true);
    setShowAiModal(true);

    const apiKey = getStoredApiKey();
    if (apiKey && apiKey.trim() !== '') {
      try {
        const prompt = `You are a premier certified luxury event planner & financial strategist.
Provide a high-impact, realistic budget allocation and financial optimization plan for this celebration:
Event: "${event.name}"
Category: "${event.category}"
Total Budget: ${currency}${totalBudget.toLocaleString()}
Expected Guests: ${guestCount}
Venue: "${event.venue}"
Current Total Spent: ${currency}${totalSpent.toLocaleString()}

Analyze this budget and output STRICTLY a JSON object with this exact shape:
{
  "summary": "2-3 sentences assessing overall financial feasibility and cost per head.",
  "allocations": [
    { "category": "Category Name", "recommendedPct": 30, "recommendedAmount": 45000, "strategy": "Practical advice" }
  ],
  "savingsTips": [
    "Tip 1 for saving money without compromising luxury",
    "Tip 2",
    "Tip 3"
  ],
  "riskAlerts": [
    "Potential hidden cost to watch out for"
  ]
}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 900,
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(raw.replace(/```json/gi, '').replace(/```/g, '').trim());
            setAiAdvice({ ...parsed, source: 'gemini-1.5-flash' });
            setIsAiAdvising(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Gemini AI Budget call error, using smart fallback advisor:', err);
      }
    }

    // Smart Fallback
    const fallbackTemplate = FALLBACK_BUDGET_ADVICE[event.category] || FALLBACK_BUDGET_ADVICE.Community;
    const allocations = fallbackTemplate.map((item) => ({
      category: item.category,
      recommendedPct: item.pct,
      recommendedAmount: Math.round((totalBudget * item.pct) / 100),
      strategy: item.tip
    }));

    setAiAdvice({
      summary: `For a ${event.category} celebration with ${guestCount} guests and a total budget of ${currency}${totalBudget.toLocaleString()}, allocating roughly ${currency}${costPerGuest || Math.round(totalBudget / guestCount)} per guest allows a memorable experience when prioritizing catering and venue aesthetics.`,
      allocations,
      savingsTips: [
        'Bundle your floral decorator and lighting vendor to negotiate a 15-20% package discount.',
        'Opt for a signature mocktail/cocktail rather than an open bar to trim beverage costs.',
        'Send digital animated AI invitations (from our Card Studio) rather than expensive physical prints.'
      ],
      riskAlerts: [
        'Watch for venue generator surcharge, corkage fees, and overtime service taxes.',
        'Keep 5-8% in an emergency cash pool for day-of vendor gratuities.'
      ],
      source: 'smart-cultural-engine'
    });
    setIsAiAdvising(false);
  };

  // Copy Budget Summary to Clipboard
  const handleCopySummary = () => {
    const text = `📊 Budget Summary for "${event.name}" (${event.category})
Total Budget: ${currency}${totalBudget.toLocaleString()}
Guest Count: ${guestCount} (${currency}${costPerGuest.toLocaleString()}/guest)
Total Committed/Spent: ${currency}${totalSpent.toLocaleString()} (${percentUsed}% used)
Paid: ${currency}${paidAmount.toLocaleString()} | Remaining to Pay: ${currency}${pendingAmount.toLocaleString()}
Budget Balance: ${remainingBudget >= 0 ? '+' : ''}${currency}${remainingBudget.toLocaleString()}

Category Breakdown:
${categoryBreakdown.map((c) => `• ${c.category}: ${currency}${c.amount.toLocaleString()} (${c.percentage}%)`).join('\n')}
`;
    navigator.clipboard.writeText(text);
    onToast?.('Budget summary copied to clipboard!', 'success');
  };

  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="budget-manager-title"
    >
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-indigo-500/20 border border-emerald-500/30 text-emerald-300">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="budget-manager-title" className="text-base sm:text-lg font-bold text-slate-100">
                  Smart Budget & Expense Manager
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {event.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-sm sm:max-w-md">
                Track financial allocations, payments & smart savings for "{event.name}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGetAiAdvice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 text-amber-200 border border-amber-500/30 transition-all shadow-sm"
              title="Get GenAI Budget Allocation Advice"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">AI Advisor</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Copy Summary"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Copy</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-1"
              aria-label="Close Budget Manager"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Financial KPI Banner */}
        <div className="bg-slate-950/40 border-b border-slate-800/80 p-4 sm:p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Budget Card */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Budget</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-slate-100">
                  {currency}{totalBudget.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Guest Count:</span>
                <input
                  type="number"
                  min="1"
                  value={budgetData.guestCount || ''}
                  onChange={(e) =>
                    setBudgetData((prev) => ({ ...prev, guestCount: Number(e.target.value) || 1 }))
                  }
                  className="w-16 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-200 text-right text-xs"
                />
              </div>
            </div>

            {/* Total Spent */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Committed / Spent</span>
                <TrendingUp className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-indigo-300">
                  {currency}{totalSpent.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                <span>{percentUsed}% of planned budget</span>
              </div>
            </div>

            {/* Remaining Balance */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Remaining Pool</span>
                <TrendingDown className={`w-4 h-4 ${remainingBudget < 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  className={`text-xl sm:text-2xl font-bold ${
                    remainingBudget < 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {remainingBudget < 0 ? '-' : ''}{currency}{Math.abs(remainingBudget).toLocaleString()}
                </span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                {remainingBudget < 0 ? 'Over budget by ' + currency + Math.abs(remainingBudget).toLocaleString() : 'Available for unbooked items'}
              </div>
            </div>

            {/* Per Guest Ratio */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Cost / Guest</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-amber-300">
                  {currency}{costPerGuest.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500">/head</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                <span>Target: {currency}{budgetedPerGuest.toLocaleString()}/head</span>
              </div>
            </div>
          </div>

          {/* Visual Budget Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 font-medium">Budget Consumption Gauge</span>
              <span className={`font-semibold ${percentUsed > 90 ? 'text-rose-400' : percentUsed > 70 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {percentUsed}% Used ({currency}{paidAmount.toLocaleString()} settled • {currency}{pendingAmount.toLocaleString()} pending)
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 transition-all duration-500"
                style={{ width: `${totalBudget > 0 ? (paidAmount / totalBudget) * 100 : 0}%` }}
                title={`Paid: ${currency}${paidAmount.toLocaleString()}`}
              />
              <div
                className="bg-amber-500 transition-all duration-500"
                style={{ width: `${totalBudget > 0 ? (pendingAmount / totalBudget) * 100 : 0}%` }}
                title={`Pending: ${currency}${pendingAmount.toLocaleString()}`}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Form & Category Breakdown (5 Cols) */}
          <div className="lg:col-span-5 p-5 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/30 overflow-y-auto space-y-6">
            {/* Quick Set Total Budget */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                Configure Overall Event Budget
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={budgetData.totalBudget}
                    onChange={(e) =>
                      setBudgetData((prev) => ({ ...prev, totalBudget: Number(e.target.value) || 0 }))
                    }
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-semibold text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Enter total budget amount..."
                  />
                </div>
                <select
                  value={budgetData.currencySymbol}
                  onChange={(e) =>
                    setBudgetData((prev) => ({ ...prev, currencySymbol: e.target.value }))
                  }
                  className="px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs font-semibold"
                >
                  <option value="₹">₹ INR</option>
                  <option value="$">$ USD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                  <option value="AED">AED</option>
                </select>
              </div>
            </div>

            {/* Add New Expense Form */}
            <form onSubmit={handleAddExpense} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                Record New Expense Item
              </h3>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Expense Name *</label>
                <input
                  type="text"
                  value={newExpense.name}
                  onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                  placeholder="e.g. Wedding Cake, Floral Mandap, DJ Advance..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Amount ({currency}) *</label>
                  <input
                    type="number"
                    min="0"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="25000"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {categoryList.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Expense Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={newExpense.isPaid}
                      onChange={(e) => setNewExpense({ ...newExpense, isPaid: e.target.checked })}
                      className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-700 focus:ring-emerald-500"
                    />
                    <span>Already Settled / Paid</span>
                  </label>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  placeholder="Optional notes or invoice ref..."
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Expense Item</span>
              </button>
            </form>

            {/* Category Allocations Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-indigo-400" />
                Spending by Category
              </h3>

              {categoryBreakdown.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No expenses recorded yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {categoryBreakdown.map((item) => (
                    <div key={item.category} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span className="truncate max-w-[180px]">{item.category}</span>
                        <span className="font-semibold text-slate-200">
                          {currency}{item.amount.toLocaleString()}{' '}
                          <span className="text-[10px] text-slate-500 font-normal">({item.percentage}%)</span>
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Expense Log Table (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col bg-slate-950/20 overflow-hidden">
            {/* Table Filters Toolbar */}
            <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/40">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  Itemized Expenses ({filteredExpenses.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="PAID">Paid Only</option>
                  <option value="PENDING">Pending Only</option>
                </select>

                {/* Category Filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  {categoryList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expense Item List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-16 text-slate-500">
                  <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs sm:text-sm">No expenses match your active filter.</p>
                </div>
              ) : (
                filteredExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => handleTogglePaid(exp.id)}
                        className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                          exp.isPaid
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                        }`}
                        title={exp.isPaid ? 'Mark as Pending' : 'Mark as Paid'}
                        aria-label={`Toggle paid status for ${exp.name}`}
                      >
                        {exp.isPaid ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-200 truncate">
                            {exp.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${
                              exp.isPaid
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {exp.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{exp.category}</span>
                          <span>•</span>
                          <span>{exp.date}</span>
                          {exp.notes && (
                            <>
                              <span>•</span>
                              <span className="italic truncate max-w-[140px] text-slate-500">
                                {exp.notes}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-slate-100">
                        {currency}{Number(exp.amount).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors opacity-80 group-hover:opacity-100"
                        title="Delete expense"
                        aria-label={`Delete ${exp.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Summary Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
              <div className="text-slate-400">
                Settled: <strong className="text-emerald-400">{currency}{paidAmount.toLocaleString()}</strong> |
                Unpaid: <strong className="text-amber-400">{currency}{pendingAmount.toLocaleString()}</strong>
              </div>
              <div className="text-slate-200 font-semibold">
                Total Tracked: {currency}{totalSpent.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* AI Advisor Modal Popup */}
        {showAiModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-lg">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>GenAI Smart Financial Strategy</span>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isAiAdvising ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 mx-auto text-amber-400 animate-spin" />
                  <p className="text-sm text-slate-300">
                    Gemini AI is analyzing event category, guest headcount & regional budget benchmarks...
                  </p>
                </div>
              ) : aiAdvice ? (
                <div className="mt-4 space-y-5">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm leading-relaxed">
                    <strong>Financial Assessment:</strong> {aiAdvice.summary}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Optimal Category Allocation Ratios
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiAdvice.allocations?.map((alloc, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
                          <div className="flex justify-between font-semibold text-slate-200">
                            <span>{alloc.category}</span>
                            <span className="text-emerald-400">
                              {alloc.recommendedPct}% ({currency}{alloc.recommendedAmount?.toLocaleString() || Math.round((totalBudget * alloc.recommendedPct) / 100).toLocaleString()})
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{alloc.strategy}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {aiAdvice.savingsTips && (
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                        Smart Savings Directives
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                        {aiAdvice.savingsTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {aiAdvice.riskAlerts && (
                    <div>
                      <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Hidden Cost Alerts
                      </h4>
                      <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                        {aiAdvice.riskAlerts.map((alert, idx) => (
                          <li key={idx}>{alert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Close Advisor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetManager;
