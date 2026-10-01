"use client";

import { useState, useEffect, useCallback } from "react";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

/* ── Transaction Pipeline Demo Data ── */
const PIPELINE_ITEMS = [
  {
    input: "Uber ride to SFO Airport",
    amount: 34.5,
    category: "Transportation",
    icon: "🚗",
    tag: "Ride Share",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/30",
  },
  {
    input: "Whole Foods Market weekly restock",
    amount: 84.2,
    category: "Food & Dining",
    icon: "🍔",
    tag: "Groceries",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/30",
  },
  {
    input: "AWS Cloud Serverless Infrastructure",
    amount: 19.8,
    category: "Bills & Utilities",
    icon: "💡",
    tag: "DevOps",
    accentBg: "bg-rose-500/10",
    accentBorder: "border-rose-500/30",
  },
  {
    input: "AMC IMAX Dolby Cinema tickets",
    amount: 28.0,
    category: "Entertainment",
    icon: "🎬",
    tag: "Recreation",
    accentBg: "bg-purple-500/10",
    accentBorder: "border-purple-500/30",
  },
];

const FAQS = [
  {
    q: "What makes Finova AI different from traditional expense trackers?",
    a: "Finova AI integrates autonomous AI classification powered by Google Gemini. Instead of manual data entry, Finova classifies transactions in real-time, surfaces behavioral spending trends, and acts as an interactive financial co-pilot.",
  },
  {
    q: "Is my financial data secure and private?",
    a: "Yes. Finova AI uses enterprise-grade Clerk authentication, encrypted Postgres databases with SSL enforcement, and strictly isolates user records. We never sell your data or train models on your private receipts.",
  },
  {
    q: "How does the AI auto-categorization work?",
    a: "When you type a transaction description, Finova instantly consults our tuned Gemini classification engine to map it to the proper category with sub-second latency.",
  },
  {
    q: "Can I export my financial data?",
    a: "Yes. Your transaction ledger is fully accessible, searchable, and exportable at any time from your personal dashboard.",
  },
];

/* ── Mini Sparkline SVG ── */
function Sparkline({
  data,
  color = "#10B981",
}: {
  data: number[];
  color?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 28;
  const points = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`,
    )
    .join(" ");
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Main Guest Component ── */
export default function Guest() {
  const [txIndex, setTxIndex] = useState(0);
  const [txPhase, setTxPhase] = useState<"enter" | "idle" | "exit">("enter");
  const [typedText, setTypedText] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const tx = PIPELINE_ITEMS[txIndex];

  /* Typewriter effect: type out the transaction input character by character */
  useEffect(() => {
    setTypedText("");
    setTxPhase("enter");
    let i = 0;
    const typeInterval = setInterval(() => {
      i++;
      setTypedText(tx.input.slice(0, i));
      if (i >= tx.input.length) clearInterval(typeInterval);
    }, 35);
    return () => clearInterval(typeInterval);
  }, [tx.input]);

  /* Cycle to the next transaction after display period */
  const cycleNext = useCallback(() => {
    setTxPhase("exit");
    setTimeout(() => {
      setTxIndex((prev) => (prev + 1) % PIPELINE_ITEMS.length);
    }, 300);
  }, []);

  useEffect(() => {
    const timer = setTimeout(cycleNext, 4200);
    return () => clearTimeout(timer);
  }, [txIndex, cycleNext]);

  const isTyping = typedText.length < tx.input.length;

  return (
    <div className="relative overflow-hidden selection:bg-brand-500/20">
      {/* ── Aurora Background Orbs ── */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full aurora-blur animate-blob pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-[28rem] h-[28rem] bg-cyan-500/8 rounded-full aurora-blur animate-blob [animation-delay:2s] pointer-events-none" />
      <div className="absolute top-[500px] left-1/3 w-80 h-80 bg-purple-500/8 rounded-full aurora-blur animate-blob [animation-delay:4s] pointer-events-none" />

      {/* ── Subtle Grid Mesh ── */}
      <div className="absolute inset-0 mesh-grid opacity-50 dark:opacity-30 pointer-events-none" />

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <section className="relative pt-14 sm:pt-24 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="max-w-4xl mx-auto stagger-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100/80 dark:bg-obsidian-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm mb-8">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500" />
            </span>
            <span className="font-mono tracking-tight">
              Finova AI • Autonomous Finance Engine
            </span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] mb-6">
            Master your spending
            <br className="hidden sm:block" /> with{" "}
            <span className="bg-gradient-to-r from-brand-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Finova AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            The intelligent personal financial command center. Real-time
            telemetry, autonomous categorization, and predictive AI advisory —
            in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 via-teal-500 to-brand-400 hover:from-brand-600 hover:to-teal-600 text-slate-950 font-extrabold text-sm sm:text-base shadow-glow hover:shadow-glow-cyan transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 group">
                <span>Get Started Free</span>
                <span className="text-lg transform group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </SignInButton>

            <Link
              href="/about"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/80 dark:bg-obsidian-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:border-brand-500/40 text-slate-700 dark:text-slate-300 font-bold text-sm sm:text-base transition-all transform hover:-translate-y-0.5"
            >
              Explore Architecture
            </Link>
          </div>
        </div>

        {/* ═══════════ LIVE AI COMMAND CENTER PREVIEW ═══════════ */}
        <div className="max-w-5xl mx-auto mt-14 sm:mt-20 relative z-10">
          {/* ── Main Glass Dashboard Card with Gradient Border ── */}
          <div className="gradient-border rounded-3xl">
            <div className="glass-card rounded-3xl p-4 sm:p-8 shadow-2xl overflow-hidden relative group">
              {/* Scan line on hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent opacity-0 group-hover:opacity-100 animate-scan pointer-events-none" />

              {/* ─ Dashboard Chrome Bar ─ */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200/60 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500 transition-all hover:scale-125" />
                  <div className="w-3 h-3 rounded-full bg-amber-400 transition-all hover:scale-125" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500 transition-all hover:scale-125" />
                  <span className="ml-3 text-[11px] font-mono text-slate-400 tracking-tight">
                    finova.ai/command-center
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-brand-500/10 text-brand-500 border border-brand-500/20 font-bold">
                    Live AI Engine
                  </span>
                </div>
              </div>

              {/* ─ AI Transaction Pipeline: Live Typewriter + Classification ─ */}
              <div className="mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-100/90 via-brand-50/20 to-slate-100/90 dark:from-obsidian-900 dark:via-brand-950/10 dark:to-obsidian-900 border border-brand-500/15 text-left">
                {/* Pipeline Header */}
                <div className="flex items-center justify-between text-[10px] font-mono mb-3">
                  <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <span className="text-sm">✨</span>
                    <span className="font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                      Smart Transaction Input
                    </span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 font-bold">
                    Auto-Categorized
                  </span>
                </div>

                {/* Transaction Row with Typewriter */}
                <div
                  className={txPhase === "exit" ? "tx-exit" : "tx-enter"}
                  key={txIndex}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left side: Icon + Typed Input + Category */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 rounded-xl ${tx.accentBg} flex items-center justify-center text-xl shadow-sm shrink-0 border ${tx.accentBorder}`}
                      >
                        {tx.icon}
                      </div>
                      <div className="min-w-0">
                        {/* Typewriter input display */}
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <span className={isTyping ? "typing-cursor" : ""}>
                            {typedText}
                          </span>
                        </div>
                        {/* Category mapping result */}
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          {!isTyping && (
                            <>
                              <span className="font-semibold text-brand-500 dark:text-brand-400">
                                → {tx.category}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                {tx.tag}
                              </span>
                            </>
                          )}
                          {isTyping && (
                            <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">
                              Classifying...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side: Amount + Verified */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <span className="text-lg font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        -${tx.amount.toFixed(2)}
                      </span>
                      {!isTyping && (
                        <span className="text-[10px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono font-bold shrink-0">
                          ✓ Categorized
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ─ Telemetry Grid ─ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 text-left">
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-obsidian-900/60 border border-slate-200/70 dark:border-white/5 transition-all hover:border-brand-500/30 group/card">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold mb-1">
                    Total Spending
                  </span>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                      $2,845.20
                    </span>
                    <Sparkline
                      data={[420, 380, 510, 460, 390, 345]}
                      color="#10B981"
                    />
                  </div>
                  <span className="text-[11px] text-emerald-500 font-mono mt-1.5 block font-semibold">
                    ▼ 14% vs last month
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-obsidian-900/60 border border-slate-200/70 dark:border-white/5 transition-all hover:border-brand-500/30">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold mb-1">
                    Top Outlay
                  </span>
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                      🍔 Dining
                    </span>
                    <Sparkline
                      data={[150, 180, 210, 190, 220, 200]}
                      color="#F59E0B"
                    />
                  </div>
                  <span className="text-[11px] text-amber-500 font-mono mt-1.5 block font-semibold">
                    $840.50 · 32% of total
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-obsidian-900/60 border border-slate-200/70 dark:border-white/5 transition-all hover:border-brand-500/30">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold mb-1">
                    AI Advisor Insight
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    &quot;Cooking at home 2 more days weekly could save ~$160
                    this month.&quot;
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-brand-500 font-semibold">
                      Gemini Advisory
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BENTO GRID FEATURES ═══════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-500">
            Architecture & Features
          </h2>
          <p className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for financial intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🤖",
              title: "Gemini AI Engine",
              desc: "Type any receipt description and watch Finova classify transactions with sub-second inference. Contextual pattern detection learns from your behavior.",
              badge: "Real-time heuristic inference",
              glow: "hover:shadow-glow-sm hover:border-brand-500/40",
              accentDot: "bg-brand-500",
              badgeColor: "text-brand-500",
            },
            {
              icon: "📊",
              title: "Zero-Dependency SVG Visuals",
              desc: "Pure mathematical SVG Donut charts and 6-month historical trend bars — no Chart.js, no D3, no Recharts. Pixel-perfect with zero bloat.",
              badge: "0KB charting dependencies",
              glow: "hover:shadow-glow-cyan hover:border-cyan-500/40",
              accentDot: "bg-cyan-500",
              badgeColor: "text-cyan-500",
            },
            {
              icon: "🔒",
              title: "Serverless Security",
              desc: "Clerk multi-factor authentication, Neon serverless Postgres with connection pooling, and keyless Workload Identity Federation deployment.",
              badge: "Keyless WIF + Clerk MFA",
              glow: "hover:shadow-glow-indigo hover:border-purple-500/40",
              accentDot: "bg-purple-500",
              badgeColor: "text-purple-400",
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`glass-card rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 border border-slate-200/80 dark:border-white/10 ${card.glow}`}
            >
              {/* Corner glow on hover */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none" />

              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-obsidian-900 flex items-center justify-center text-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 border border-slate-200/80 dark:border-white/5">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {card.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {card.desc}
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] font-mono">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${card.accentDot} animate-pulse`}
                />
                <span className={card.badgeColor}>{card.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ FAQ ACCORDION ═══════════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Everything you need to know about the Finova AI platform
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                onClick={() => setExpandedFaq(isOpen ? null : idx)}
                className={`glass-card rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-300 ${
                  isOpen
                    ? "border-brand-500/40 shadow-glow-sm scale-[1.01]"
                    : "hover:border-slate-300 dark:hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5 text-left">
                    <span
                      className={`font-mono transition-colors ${isOpen ? "text-brand-400" : "text-brand-500/60"}`}
                    >
                      Q.
                    </span>
                    <span>{item.q}</span>
                  </h3>
                  <span
                    className={`text-xs transition-all duration-300 shrink-0 ${
                      isOpen ? "rotate-180 text-brand-500" : "text-slate-400"
                    }`}
                  >
                    ▼
                  </span>
                </div>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isOpen ? "200px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 pl-6 leading-relaxed pt-3 border-t border-slate-200/50 dark:border-white/5 text-left mt-3">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════ BOTTOM CTA ═══════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className="gradient-border rounded-3xl">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-brand-600 via-teal-600 to-cyan-600 text-slate-950 text-center space-y-6 shadow-glow relative overflow-hidden group">
            {/* Shimmer */}
            <div className="absolute inset-0 shimmer-gradient animate-shimmer pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Ready to take control of your financial future?
              </h2>
              <p className="text-sm sm:text-base font-medium opacity-90 max-w-xl mx-auto">
                Join Finova AI today. Free forever with scale-to-zero serverless
                computing.
              </p>
            </div>

            <div className="relative z-10">
              <SignInButton mode="modal">
                <button className="px-8 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 mx-auto group/btn">
                  <span>Sign Up in 10 Seconds</span>
                  <span className="text-base transform group-hover/btn:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
