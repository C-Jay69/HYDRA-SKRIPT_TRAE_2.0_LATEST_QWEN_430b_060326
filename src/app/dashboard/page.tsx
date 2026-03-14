import { LucideBookOpen, LucidePenTool, LucideCoins, LucideFlame, LucideBrain, LucideShieldCheck, LucideZap, LucideTrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Author Dashboard</span>
        </h1>
        <p className="text-gray-400 mt-1">Your writing command center</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard icon={<LucidePenTool className="w-5 h-5" />} label="Words Today" value="0" color="purple" />
        <MetricCard icon={<LucideFlame className="w-5 h-5" />} label="Current Streak" value="0 days" color="orange" />
        <MetricCard icon={<LucideCoins className="w-5 h-5" />} label="Credit Balance" value="100" color="cyan" />
        <MetricCard icon={<LucideTrendingUp className="w-5 h-5" />} label="Writing Flow" value="—" color="green" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Recent Books</h2>
            <div className="text-center py-12 text-gray-500">
              <LucideBookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No books yet. Create your first universe to get started!</p>
              <Link href="/onboarding" className="inline-block mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-semibold px-6 py-2 rounded-lg hover:opacity-90">
                Start Onboarding
              </Link>
            </div>
          </div>

          {/* Active Jobs */}
          <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Active Jobs</h2>
            <div className="text-center py-8 text-gray-500">
              <LucideZap className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No active jobs. Start a generation or training task!</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/onboarding" className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                  <LucideBookOpen className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">Create Universe</span>
              </Link>
              <Link href="/styles" className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <LucideBrain className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">Train Style</span>
              </Link>
              <Link href="/credits" className="flex items-center gap-3 p-3 rounded-lg bg-gray-900 hover:bg-gray-800 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <LucideCoins className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-300">View Credits</span>
              </Link>
            </div>
          </div>

          {/* Continuity Health */}
          <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <LucideShieldCheck className="w-5 h-5 text-cyan-400" />
              Continuity Health
            </h2>
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">No continuity data yet</p>
            </div>
          </div>

          {/* Earning Opportunities */}
          <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Earn Credits</h2>
            <div className="space-y-2">
              <EarningItem emoji="🔥" title="Write 500 words" reward={5} />
              <EarningItem emoji="💬" title="Give feedback" reward={10} />
              <EarningItem emoji="🎨" title="Train your style" reward={20} />
              <EarningItem emoji="🎁" title="Daily login" reward={3} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-400',
    cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400',
    orange: 'from-orange-500/20 to-orange-500/5 text-orange-400',
    green: 'from-green-500/20 to-green-500/5 text-green-400',
  };
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg border border-gray-800 p-4`}>
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

function EarningItem({ emoji, title, reward }: { emoji: string; title: string; reward: number }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-900 transition-colors">
      <div className="flex items-center gap-2">
        <span>{emoji}</span>
        <span className="text-sm text-gray-300">{title}</span>
      </div>
      <span className="text-sm font-semibold text-cyan-400">+{reward}</span>
    </div>
  );
}
