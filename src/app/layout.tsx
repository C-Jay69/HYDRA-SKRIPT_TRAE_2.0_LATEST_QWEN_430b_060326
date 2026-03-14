import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { LucideBookOpen, LucidePalette, LucideCoins, LucideLayoutDashboard, LucideUser, LucideMenu } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const metadata: Metadata = {
  title: "HydraSkript - AI-Powered Author Empowerment",
  description: "Collaborative AI authoring platform that learns your unique voice and maintains narrative consistency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-black text-white antialiased")}>
        <div className="relative flex min-h-screen flex-col">
          {/* Navigation */}
          <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur">
            <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">HYDRA</span>
                  <span className="text-white">SKRIPT</span>
                </span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <LucideLayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/books" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <LucideBookOpen className="w-4 h-4" />
                  Books
                </Link>
                <Link href="/styles" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <LucidePalette className="w-4 h-4" />
                  Styles
                </Link>
                <Link href="/credits" className="flex items-center gap-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  <LucideCoins className="w-4 h-4" />
                  Credits
                </Link>
                <Link href="/onboarding" className="text-sm font-medium bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all">
                  Get Started
                </Link>
                <div className="h-8 w-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                  <LucideUser className="w-4 h-4 text-gray-400" />
                </div>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-800 py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto max-w-7xl px-4">
              <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
                &copy; 2026 HydraSkript. All rights reserved.
              </p>
              <div className="flex gap-4 text-sm text-gray-500">
                <Link href="#" className="hover:text-gray-300">Privacy</Link>
                <Link href="#" className="hover:text-gray-300">Terms</Link>
                <Link href="#" className="hover:text-gray-300">Support</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
