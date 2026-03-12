import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"] });

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const metadata: Metadata = {
  title: "HydraSkript - AI-Powered Author Empowerment",
  description: "E-Book & Content Generation Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-slate-950 text-slate-50 antialiased")}>
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="container flex h-16 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-indigo-400">HYDRA<span className="text-slate-200">SKRIPT</span></span>
              </div>
              <nav className="flex items-center gap-6">
                <a href="/" className="text-sm font-medium transition-colors hover:text-indigo-400">Dashboard</a>
                <a href="/books" className="text-sm font-medium transition-colors hover:text-indigo-400">Books</a>
                <a href="/styles" className="text-sm font-medium transition-colors hover:text-indigo-400">Styles</a>
                <a href="/credits" className="text-sm font-medium transition-colors hover:text-indigo-400">Credits</a>
                <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700" title="User Profile" />
              </nav>
            </div>
          </header>
          <main className="flex-1">
            <div className="container py-8 px-4">
              {children}
            </div>
          </main>
          <footer className="border-t border-slate-800 py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <p className="text-center text-sm leading-loose text-slate-500 md:text-left">
                &copy; 2026 HydraSkript. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
