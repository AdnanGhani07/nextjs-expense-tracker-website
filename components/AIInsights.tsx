"use client";

import { useEffect, useState } from "react";
import { getAIInsightsAction } from "@/app/actions/getAIInsightsAction";
import { askAIAction } from "@/app/actions/askAIAction";
import { AIInsight } from "@/lib/ai";

const typeStyles: Record<
  string,
  { bg: string; border: string; text: string; badge: string; icon: string }
> = {
  warning: {
    bg: "bg-amber-50/70 dark:bg-amber-950/20",
    border: "border-amber-200/80 dark:border-amber-800/40",
    text: "text-amber-800 dark:text-amber-300",
    badge:
      "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300",
    icon: "⚠️",
  },
  tip: {
    bg: "bg-purple-50/70 dark:bg-purple-950/20",
    border: "border-purple-200/80 dark:border-purple-800/40",
    text: "text-purple-800 dark:text-purple-300",
    badge:
      "bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300",
    icon: "💡",
  },
  success: {
    bg: "bg-emerald-50/70 dark:bg-emerald-950/20",
    border: "border-emerald-200/80 dark:border-emerald-800/40",
    text: "text-emerald-800 dark:text-emerald-300",
    badge:
      "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300",
    icon: "🎉",
  },
  info: {
    bg: "bg-blue-50/70 dark:bg-blue-950/20",
    border: "border-blue-200/80 dark:border-blue-800/40",
    text: "text-blue-800 dark:text-blue-300",
    badge: "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300",
    icon: "ℹ️",
  },
};

const SUGGESTED_QUESTIONS = [
  "Where did most of my money go this month?",
  "How can I lower my recurring bills?",
  "What is my single largest expense?",
  "Give me 3 actionable tips to save $200.",
];

export default function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const [askError, setAskError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const res = await getAIInsightsAction();
      if (res.insights) {
        setInsights(res.insights);
      }
    } catch (err) {
      console.error("Error fetching insights:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleAskAI = async (queryToAsk?: string) => {
    const q = queryToAsk || question;
    if (!q.trim()) return;

    setIsAsking(true);
    setAskError(null);
    setAnswer(null);

    try {
      const res = await askAIAction(q.trim());
      if (res.error) {
        setAskError(res.error);
      } else if (res.answer) {
        setAnswer(res.answer);
      }
    } catch {
      setAskError("Failed to communicate with Finova AI advisor.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 sm:space-y-8 relative overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-glow-sm">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                Finova AI Co-Pilot
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Predictive spending analytics & interactive advisory
            </p>
          </div>
        </div>

        <button
          onClick={fetchInsights}
          disabled={isLoading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-1.5"
        >
          <span className={isLoading ? "animate-spin" : ""}>🔄</span>
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Insights Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-100/60 dark:bg-obsidian-900/60 border border-slate-200/50 dark:border-white/5 animate-pulse h-32 flex flex-col justify-between"
            >
              <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-full h-8 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((item) => {
            const style = typeStyles[item.type] || typeStyles.info;
            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${style.bg} ${style.border}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{style.icon}</span>
                    <h3 className={`text-sm font-bold ${style.text}`}>
                      {item.title}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${style.badge}`}
                  >
                    {Math.round(item.confidence * 100)}% Match
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {item.message}
                </p>

                {item.action && (
                  <div className="pt-2 border-t border-slate-200/40 dark:border-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>{item.action}</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive AI Financial Advisor Q&A Drawer */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-100/90 to-brand-50/40 dark:from-obsidian-900/90 dark:to-brand-950/20 border border-slate-200 dark:border-white/5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">💬</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Ask Finova AI Anything About Your Finances
          </h3>
        </div>

        {/* Suggested Question Chips */}
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setQuestion(q);
                handleAskAI(q);
              }}
              className="px-3 py-1 rounded-xl text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-brand-500/50 hover:text-brand-500 dark:hover:text-brand-400 transition-all text-left"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input & Ask Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAI();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='Ask a custom question (e.g. "How much did I spend on groceries in August?")...'
            maxLength={150}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
          <button
            type="submit"
            disabled={isAsking || !question.trim()}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-slate-950 font-bold text-xs sm:text-sm shadow-glow-sm transition-all flex items-center justify-center gap-2"
          >
            {isAsking ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <span>Ask Advisor →</span>
            )}
          </button>
        </form>

        {/* AI Answer Bubble */}
        {askError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs">
            {askError}
          </div>
        )}

        {answer && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-brand-500/30 shadow-glow-sm space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
              <span>🤖</span>
              <span>Finova AI Assessment</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
