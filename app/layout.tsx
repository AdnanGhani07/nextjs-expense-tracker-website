import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Footer from "@/components/Footer";
import ClerkThemeProvider from "@/components/ClerkThemeProvider";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Finova AI — Intelligent Financial Command Center",
  description:
    "Autonomous expense tracking, real-time spending analytics, and AI financial advisory powered by Gemini.",
  keywords: [
    "expense tracker",
    "personal finance",
    "AI financial advisor",
    "budget manager",
    "Finova AI",
    "smart finance",
  ],
  authors: [{ name: "Finova AI Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Finova AI — Intelligent Financial Command Center",
    description:
      "Autonomous expense tracking, real-time spending analytics, and AI financial advisory powered by Gemini.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased bg-slate-50 dark:bg-obsidian-950 text-slate-800 dark:text-slate-100 min-h-screen selection:bg-brand-500/20 selection:text-brand-500`}
      >
        <ThemeProvider>
          <ClerkThemeProvider>
            <div className="relative min-h-screen flex flex-col">
              <div className="ambient-glow" aria-hidden="true" />
              <Navbar />
              <main className="flex-1 relative z-10">{children}</main>
              <Footer />
            </div>
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
