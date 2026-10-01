"use client";

import { useState, useTransition } from "react";
import addExpenseRecord from "@/app/actions/addExpenseRecord";
import { suggestCategory } from "@/app/actions/suggestCategory";

const CATEGORIES = [
  {
    name: "Food",
    icon: "🍔",
    color:
      "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  {
    name: "Transportation",
    icon: "🚗",
    color:
      "from-blue-500/20 to-sky-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  {
    name: "Bills",
    icon: "💡",
    color:
      "from-rose-500/20 to-red-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30",
  },
  {
    name: "Shopping",
    icon: "🛍️",
    color:
      "from-purple-500/20 to-indigo-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  {
    name: "Entertainment",
    icon: "🎬",
    color:
      "from-fuchsia-500/20 to-pink-500/20 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30",
  },
  {
    name: "Healthcare",
    icon: "🏥",
    color:
      "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  {
    name: "Other",
    icon: "📦",
    color:
      "from-slate-500/20 to-gray-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30",
  },
];

const PRESETS = [10, 25, 50, 100];

export default function AddNewRecord() {
  const [isPending, startTransition] = useTransition();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | string>(50);
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  const [isCategorizingAI, setIsCategorizingAI] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleAISuggest = async () => {
    if (!description.trim() || description.trim().length < 2) {
      setAlert({
        message: 'Enter a description first (e.g., "Grocery shopping")',
        type: "error",
      });
      return;
    }

    setIsCategorizingAI(true);
    setAlert(null);

    try {
      const res = await suggestCategory(description);
      if (res.error) {
        setAlert({ message: res.error, type: "error" });
      } else if (res.category) {
        setCategory(res.category);
        setAlert({
          message: `Gemini classified as "${res.category}"`,
          type: "success",
        });
      }
    } catch {
      setAlert({
        message: "Unable to reach AI categorization service",
        type: "error",
      });
    } finally {
      setIsCategorizingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    if (isNaN(numAmount) || numAmount <= 0) {
      setAlert({
        message: "Please enter a valid amount greater than $0",
        type: "error",
      });
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("text", description);
      formData.set("amount", numAmount.toString());
      formData.set("category", category);
      formData.set("date", date);

      const res = await addExpenseRecord(formData);

      if (res.error) {
        setAlert({ message: res.error, type: "error" });
      } else {
        setAlert({ message: "Expense logged successfully!", type: "success" });
        setDescription("");
        setAmount(50);
        setCategory("Food");
      }
    });
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-7 space-y-6 relative overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-400 to-teal-600 flex items-center justify-center shadow-glow-sm">
            <span className="text-lg">💳</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              Log Expense
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quick entry with AI auto-categorization
            </p>
          </div>
        </div>

        {/* AI Auto-Suggest Button */}
        <button
          type="button"
          onClick={handleAISuggest}
          disabled={isCategorizingAI || !description.trim()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          title="Auto-detect category with Gemini AI"
        >
          <span className={`text-xs ${isCategorizingAI ? "animate-spin" : ""}`}>
            {isCategorizingAI ? "⏳" : "✨"}
          </span>
          <span className="hidden sm:inline">AI Classify</span>
        </button>
      </div>

      {/* Alert Banner */}
      {alert && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-medium flex items-center justify-between transition-all ${
            alert.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
              : "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50"
          }`}
        >
          <span className="flex items-center gap-2">
            <span>{alert.type === "success" ? "✓" : "⚠️"}</span>
            <span>{alert.message}</span>
          </span>
          <button
            type="button"
            onClick={() => setAlert(null)}
            className="opacity-60 hover:opacity-100 text-sm font-bold leading-none"
          >
            ×
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Description Input */}
        <div className="space-y-1.5">
          <label
            htmlFor="expense-text"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between"
          >
            <span>Description</span>
            <span className="text-[10px] text-slate-400 font-mono">
              Max 150 chars
            </span>
          </label>
          <div className="relative">
            <input
              id="expense-text"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Grocery shopping at Trader Joe's"
              maxLength={150}
              required
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* Amount & Presets */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="expense-amount"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Amount (USD)
            </label>
            <div className="flex items-center gap-1">
              {PRESETS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className="px-2 py-0.5 rounded-lg text-[11px] font-mono font-medium bg-slate-100 dark:bg-obsidian-900 hover:bg-brand-500/10 hover:text-brand-500 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 transition-colors"
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
              $
            </span>
            <input
              id="expense-amount"
              type="number"
              step="0.01"
              min="0.01"
              max="10000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all tabular-nums"
            />
          </div>
        </div>

        {/* Category Pills Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all text-left ${
                    isSelected
                      ? "bg-brand-500 text-white dark:text-slate-950 border-brand-500 shadow-glow-sm scale-[1.02]"
                      : "bg-slate-50 dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"
                  }`}
                >
                  <span className="text-sm">{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-1.5">
          <label
            htmlFor="expense-date"
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 block"
          >
            Transaction Date
          </label>
          <input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-500 to-teal-500 hover:from-brand-600 hover:to-teal-600 text-slate-950 font-bold text-sm shadow-glow-sm hover:shadow-glow transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Logging Expense...</span>
            </>
          ) : (
            <>
              <span>+ Save Expense Record</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
