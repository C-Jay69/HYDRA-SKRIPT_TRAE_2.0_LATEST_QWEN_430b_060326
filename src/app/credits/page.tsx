import { LucideCoins, LucideArrowUpRight, LucideArrowDownRight, LucideGift, LucideFlame, LucidePenTool, LucideMessageSquare, LucideBrain, LucideSparkles, LucideStar } from "lucide-react";

export default function CreditsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Credit Center</span>
        </h1>
        <p className="text-gray-400 mt-1">Track your credits, earn more, and manage spending</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-gray-800 rounded-lg p-8">
            <p className="text-gray-400 text-sm mb-1">Current Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white">100</span>
              <span className="text-gray-400">credits</span>
            </div>
            <div className="flex gap-6 mt-6">
              <div>
                <p className="text-xs text-gray-500">Earned Today</p>
                <p className="text-lg font-semibold text-green-400">+0</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Spent Today</p>
                <p className="text-lg font-semibold text-orange-400">-0</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Lifetime Earned</p>
                <p className="text-lg font-semibold text-white">100</p>
              </div>
            </div>
          </div>

          {/* Cost Reference */}
          <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Operation Costs</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <CostItem label="Chapter Generation" cost="10 + words/500" icon={<LucideSparkles className="w-4 h-4" />} />
              <CostItem label="Style Training" cost="15 credits" icon={<LucideBrain className="w-4 h-4" />} />
              <CostItem label="Continuity Scan" cost="3 per chapter" icon={<LucideStar className="w-4 h-4" />} />
              <CostItem label="Audiobook Export" cost="50 + words/1000" icon={<LucideCoins className="w-4 h-4" />} />
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Recent Transactions</h2>
            <div className="text-center py-8 text-gray-500">
              <LucideCoins className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No transactions yet. Earn credits by writing or completing activities!</p>
            </div>
          </div>
        </div>

        {/* Earning Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Earning Opportunities</h2>
            <div className="space-y-3">
              <EarningRow emoji="🔥" title="Daily Writing" desc="Write 500 words manually" reward={5} cooldown="24h" />
              <EarningRow emoji="💬" title="Community" desc="Share chapter feedback" reward={10} cooldown="24h" />
              <EarningRow emoji="🔥" title="3-Day Streak" desc="Write 3 days in a row" reward={10} cooldown="72h" />
              <EarningRow emoji="🔥" title="5-Day Streak" desc="Write 5 days in a row" reward={15} cooldown="120h" />
              <EarningRow emoji="🎁" title="Daily Login" desc="Open HydraSkript today" reward={3} cooldown="24h" />
              <EarningRow emoji="📝" title="Prompt Response" desc="Complete today's prompt" reward={5} cooldown="24h" />
              <EarningRow emoji="🎨" title="Train Your Style" desc="Upload 3+ samples" reward={20} cooldown="Once" />
              <EarningRow emoji="✨" title="First AI Chapter" desc="Generate first chapter" reward={10} cooldown="Once" />
            </div>
          </div>

          {/* Subscription Tiers */}
          <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Subscription Tiers</h2>
            <div className="space-y-3">
              <TierCard name="Starter" desc="1 book, 1 style" current />
              <TierCard name="Author" desc="Unlimited books, 3 styles, TTS" />
              <TierCard name="Pro" desc="Everything + priority queue" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CostItem({ label, cost, icon }: { label: string; cost: string; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-900 rounded-lg p-3">
      <div className="text-purple-400 mb-1">{icon}</div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-white">{cost}</p>
    </div>
  );
}

function EarningRow({ emoji, title, desc, reward, cooldown }: { emoji: string; title: string; desc: string; reward: number; cooldown: string }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-900 transition-colors">
      <span className="text-lg">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-cyan-400">+{reward}</p>
        <p className="text-xs text-gray-600">{cooldown}</p>
      </div>
    </div>
  );
}

function TierCard({ name, desc, current }: { name: string; desc: string; current?: boolean }) {
  return (
    <div className={`p-3 rounded-lg border ${current ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 bg-gray-900'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-gray-400">{desc}</p>
        </div>
        {current && <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">Current</span>}
      </div>
    </div>
  );
}
