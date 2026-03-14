import { LucideBookOpen, LucidePlus, LucideEdit3, LucideMoreVertical } from "lucide-react";
import Link from "next/link";

export default function BooksPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">My Books</span>
          </h1>
          <p className="text-gray-400 mt-1">Manage your universes and manuscripts</p>
        </div>
        <Link href="/onboarding" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-all">
          <LucidePlus className="w-4 h-4" /> New Universe
        </Link>
      </div>

      {/* Empty State */}
      <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-12 text-center">
        <LucideBookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h2 className="text-xl font-bold text-white mb-2">No books yet</h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Start by creating a universe, then add books with chapters.
          Your AI co-writer will help maintain consistency across everything.
        </p>
        <Link href="/onboarding" className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-all">
          Create Your First Universe
        </Link>
      </div>
    </div>
  );
}
