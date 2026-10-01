import Link from "next/link";

const Footer = () => {
  return (
    <footer className="relative border-t border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-obsidian-950 transition-colors duration-300 overflow-hidden">
      {/* Top subtle glow line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-teal-600 flex items-center justify-center shadow-glow-sm">
                <span className="font-mono font-black text-white text-base">
                  F
                </span>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Finova <span className="text-brand-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Autonomous expense tracking and predictive financial insights.
              Built on serverless infrastructure for zero idle footprint.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-obsidian-900 border border-slate-300/50 dark:border-white/5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                Next.js 15
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-obsidian-900 border border-slate-300/50 dark:border-white/5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                Gemini AI
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-obsidian-900 border border-slate-300/50 dark:border-white/5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                Neon Postgres
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-colors"
                >
                  Architecture & About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-500 transition-colors"
                >
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Health */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              System Status
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Cloud Run: Healthy</span>
              </li>
              <li className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>SSL Encrypted</span>
              </li>
              <li>
                <a
                  href="/api/healthz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  Live Probe Endpoint ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Finova AI. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <span className="text-brand-500">⚡</span>
            <span>by Adnan Ghani</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
