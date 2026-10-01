import AddNewRecord from "@/components/AddNewRecord";
import AIInsights from "@/components/AIInsights";
import ExpenseStats from "@/components/ExpenseStats";
import Guest from "@/components/Guest";
import RecordChart from "@/components/RecordChart";
import RecordHistory from "@/components/RecordHistory";
import { currentUser } from "@clerk/nextjs/server";
import { checkUser } from "@/lib/checkUser";
import Image from "next/image";

export default async function HomePage() {
  const user = await currentUser();
  if (!user) {
    return <Guest />;
  }

  // Ensure user is synced to our database with foreign key integrity
  await checkUser();

  const userJoinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
      {/* Financial Command Hero Banner */}
      <section className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
        {/* Subtle decorative glow */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-brand-500/10 dark:bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* User Profile & Greeting */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative flex-shrink-0">
              <Image
                src={user.imageUrl}
                alt={`${user.firstName || "User"}'s avatar`}
                width={72}
                height={72}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white dark:border-slate-700 shadow-md object-cover ring-2 ring-brand-500/20"
              />
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-obsidian-950 flex items-center justify-center shadow-sm"
                title="Account Active & Synced"
              >
                <span className="text-[10px] text-white font-bold leading-none">
                  ✓
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome back, {user.firstName || "Friend"}!
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  AI Active
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                Finova AI is monitoring your cash flow. Track your expenses,
                analyze spending patterns, and get personalized financial
                intelligence.
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 text-xs">
            <div className="flex-1 sm:flex-initial bg-slate-100/90 dark:bg-obsidian-900/90 border border-slate-200/80 dark:border-white/5 rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs">
                📅
              </span>
              <div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                  Member Since
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {userJoinedDate}
                </span>
              </div>
            </div>

            <div className="flex-1 sm:flex-initial bg-slate-100/90 dark:bg-obsidian-900/90 border border-slate-200/80 dark:border-white/5 rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                ⚡
              </span>
              <div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block uppercase tracking-wider">
                  Engine
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Gemini AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Quick Entry Form */}
        <div className="lg:col-span-5 space-y-6">
          <AddNewRecord />
        </div>

        {/* Right Column: Visual Telemetry (Stats + Chart) */}
        <div className="lg:col-span-7 space-y-6">
          <ExpenseStats />
          <RecordChart />
        </div>
      </div>

      {/* Bottom Full-Width Sections: AI Advisory & Transaction Ledger */}
      <div className="space-y-6 sm:space-y-8">
        <AIInsights />
        <RecordHistory />
      </div>
    </div>
  );
}
