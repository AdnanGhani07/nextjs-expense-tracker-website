'use client';

import { useEffect, useState } from 'react';
import { getAIInsightsAction } from '@/app/actions/getAIInsightsAction';
import { askAIAction } from '@/app/actions/askAIAction';
import { AIInsight } from '@/lib/ai';

const typeStyles: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-800 dark:text-amber-300',
    icon: '⚠️',
  },
  tip: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-800 dark:text-emerald-300',
    icon: '💡',
  },
  success: {
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    border: 'border-teal-200 dark:border-teal-800',
    text: 'text-teal-800 dark:text-teal-300',
    icon: '🎉',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-300',
    icon: 'ℹ️',
  },
};

export default function AIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [question, setQuestion] = useState<string>('');
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
      console.error('Error fetching insights:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsAsking(true);
    setAskError(null);
    setAnswer(null);

    try {
      const res = await askAIAction(question.trim());
      if (res.error) {
        setAskError(res.error);
      } else if (res.answer) {
        setAnswer(res.answer);
      }
    } catch {
      setAskError('Failed to communicate with AI advisor.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className='bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg'>
            <span className='text-white text-lg'>🤖</span>
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h3 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                AI Financial Advisor & Insights
              </h3>
              <span className='px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white'>
                Gemini AI
              </span>
            </div>
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              Personalized intelligence based on your spending behavior
            </p>
          </div>
        </div>

        <button
          onClick={fetchInsights}
          disabled={isLoading}
          className='self-start sm:self-auto px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60 transition-all flex items-center gap-1.5'
        >
          <span>🔄</span>
          <span>{isLoading ? 'Analyzing...' : 'Refresh Insights'}</span>
        </button>
      </div>

      {/* AI Insights Cards Grid */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='h-28 bg-gray-100 dark:bg-gray-700/40 rounded-xl animate-pulse p-4 flex flex-col justify-between'
            >
              <div className='w-32 h-4 bg-gray-200 dark:bg-gray-600 rounded'></div>
              <div className='w-full h-3 bg-gray-200 dark:bg-gray-600 rounded'></div>
              <div className='w-3/4 h-3 bg-gray-200 dark:bg-gray-600 rounded'></div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
          {insights.map((insight) => {
            const style = typeStyles[insight.type] || typeStyles.info;
            return (
              <div
                key={insight.id}
                className={`${style.bg} border ${style.border} p-4 sm:p-5 rounded-2xl transition-all duration-200 hover:shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-base'>{style.icon}</span>
                    <h4 className={`text-sm font-bold ${style.text}`}>
                      {insight.title}
                    </h4>
                  </div>
                  <p className='text-xs text-gray-700 dark:text-gray-300 leading-relaxed'>
                    {insight.message}
                  </p>
                </div>

                {insight.action && (
                  <div className='mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center text-[11px] font-semibold text-emerald-700 dark:text-emerald-300'>
                    <span className='mr-1'>👉</span>
                    <span>{insight.action}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive AI Chat Section */}
      <div className='bg-gradient-to-r from-emerald-50/60 to-teal-50/60 dark:from-emerald-950/20 dark:to-teal-950/20 p-4 sm:p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/60'>
        <div className='flex items-center gap-2 mb-3'>
          <span className='text-base'>💬</span>
          <h4 className='text-sm font-bold text-gray-900 dark:text-gray-100'>
            Ask Your AI Advisor
          </h4>
        </div>

        <form onSubmit={handleAskAI} className='flex flex-col sm:flex-row gap-2'>
          <input
            type='text'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='e.g., "How can I reduce my dining out expenses?" or "Summarize my spending"'
            className='flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm'
          />
          <button
            type='submit'
            disabled={isAsking || !question.trim()}
            className='px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap'
          >
            {isAsking ? 'Thinking...' : 'Ask AI'}
          </button>
        </form>

        {/* AI Answer Box */}
        {askError && (
          <div className='mt-3 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400'>
            {askError}
          </div>
        )}

        {answer && (
          <div className='mt-3 p-4 bg-white/90 dark:bg-gray-800/90 rounded-xl border border-emerald-200 dark:border-emerald-800/60 shadow-sm'>
            <div className='flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1'>
              <span>🤖</span>
              <span>Advisor Response</span>
            </div>
            <p className='text-xs text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap'>
              {answer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}