"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = [
    { name: "Dashboard", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]"
              onClick={closeMobileMenu}
            >
              {/* Glowing Monogram Emblem */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-400 via-brand-500 to-teal-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all duration-300">
                <span className="font-mono font-black text-white text-lg sm:text-xl tracking-tighter">
                  F
                </span>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full ring-2 ring-white dark:ring-obsidian-950 animate-pulse" />
              </div>

              {/* Wordmark */}
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                  Finova
                </span>
                <span className="bg-gradient-to-r from-brand-500/15 to-cyan-500/15 dark:from-brand-400/20 dark:to-cyan-400/20 border border-brand-500/30 text-brand-600 dark:text-brand-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                  AI
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-obsidian-900/80 p-1 rounded-2xl border border-slate-200/60 dark:border-white/5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Section: Theme Toggle & User Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Auth Buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="relative group overflow-hidden bg-slate-900 dark:bg-brand-500 hover:bg-slate-800 dark:hover:bg-brand-400 text-white dark:text-slate-950 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow-glow-sm transition-all duration-200 active:scale-95 flex items-center gap-1.5">
                  <span>Sign In</span>
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-2 pl-1">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox:
                        "w-9 h-9 ring-2 ring-brand-500/30 hover:ring-brand-500 transition-all rounded-xl",
                    },
                  }}
                />
              </div>
            </SignedIn>

            {/* Mobile Hamburger Toggle Button */}
            <div className="flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
                className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 focus:outline-none transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 glass-panel px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-4">
            <span>Status: Gemini 2.0 Connected</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      )}
    </nav>
  );
}
