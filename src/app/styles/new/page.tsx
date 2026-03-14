import { LucideUpload, LucideBrain, LucideCheck } from "lucide-react";
import Link from "next/link";

export default function NewStylePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link href="/styles" className="text-sm text-gray-400 hover:text-white mb-4 inline-block">&larr; Back to Styles</Link>

      <h1 className="text-3xl font-bold mb-2">
        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Train New Style</span>
      </h1>
      <p className="text-gray-400 mb-8">Upload your writing samples to create a unique voice profile</p>

      <div className="space-y-6">
        {/* Style Name */}
        <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Style Name</label>
          <input
            type="text"
            placeholder="e.g. My Fantasy Voice, Literary Fiction Style"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <label className="block text-sm font-medium text-gray-300 mb-2 mt-4">Description (optional)</label>
          <textarea
            placeholder="Describe the style you want to capture..."
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          />
        </div>

        {/* Upload Samples */}
        <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
          <h3 className="font-semibold text-white mb-2">Upload Writing Samples</h3>
          <p className="text-sm text-gray-400 mb-4">Upload 3+ chapters or text files (minimum 10,000 words total)</p>

          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer">
            <LucideUpload className="w-10 h-10 mx-auto mb-3 text-gray-500" />
            <p className="text-gray-400 text-sm mb-1">Drag & drop your text files here</p>
            <p className="text-gray-500 text-xs">Supports .txt, .md, .docx (max 5MB each)</p>
            <button className="mt-4 bg-gray-800 text-gray-300 text-sm px-4 py-2 rounded-lg hover:bg-gray-700">
              Browse Files
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-500">0 files uploaded · 0 words total</p>
          </div>
        </div>

        {/* Training Options */}
        <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
          <h3 className="font-semibold text-white mb-4">Style Preferences</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">POV Preference</label>
              <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">
                <option value="">Auto-detect</option>
                <option value="first_person">First Person</option>
                <option value="third_limited">Third Person Limited</option>
                <option value="third_omniscient">Third Person Omniscient</option>
                <option value="second_person">Second Person</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tense</label>
              <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">
                <option value="">Auto-detect</option>
                <option value="past">Past Tense</option>
                <option value="present">Present Tense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Genre</label>
              <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm">
                <option value="">Auto-detect</option>
                <option value="fantasy">Fantasy</option>
                <option value="sci_fi">Science Fiction</option>
                <option value="mystery">Mystery</option>
                <option value="thriller">Thriller</option>
                <option value="romance">Romance</option>
                <option value="literary">Literary Fiction</option>
                <option value="historical">Historical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cost & Submit */}
        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">Training Cost: 15 credits</p>
              <p className="text-sm text-cyan-400">You'll earn 20 credits back when complete! 🎉</p>
            </div>
            <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-all flex items-center gap-2">
              <LucideBrain className="w-4 h-4" /> Start Training
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
