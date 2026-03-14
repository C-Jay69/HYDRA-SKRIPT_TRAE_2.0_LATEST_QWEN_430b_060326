import { LucideBrain, LucidePlus, LucideCheck, LucideLoader2, LucideAlertCircle } from "lucide-react";
import Link from "next/link";

export default function StylesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Writing Styles</span>
          </h1>
          <p className="text-gray-400 mt-1">Train AI to match your unique voice</p>
        </div>
        <Link href="/styles/new" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-all">
          <LucidePlus className="w-4 h-4" /> New Style
        </Link>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-gray-800 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-white mb-2">How Style Training Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
          <div className="flex items-start gap-2">
            <span className="text-purple-400 font-bold">1.</span>
            Upload 3+ sample chapters (min 10,000 words total)
          </div>
          <div className="flex items-start gap-2">
            <span className="text-blue-400 font-bold">2.</span>
            AI analyzes sentence structure, vocabulary, pacing & more
          </div>
          <div className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">3.</span>
            Review a validation sample and approve your voice profile
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-12 text-center">
        <LucideBrain className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h2 className="text-xl font-bold text-white mb-2">No styles trained yet</h2>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          Upload your writing samples and let AI learn your unique voice.
          Every AI generation will then match your style perfectly.
        </p>
        <Link href="/styles/new" className="inline-block bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-all">
          Train Your First Style
        </Link>
        <p className="text-sm text-cyan-400 mt-3">🎨 Earn 20 credits for your first style training!</p>
      </div>
    </div>
  );
}
