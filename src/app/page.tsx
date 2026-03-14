import { LucideBook, LucideSparkles, LucideBrain, LucideZap, LucideShieldCheck, LucideHeadphones, LucideArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 px-4">
        <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Write</span> with AI.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Sound</span> like{" "}
              <span className="text-white">You.</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl">
              HydraSkript learns your unique voice and helps you write faster while maintaining
              perfect continuity across complex narratives. Your AI co-writer that never forgets.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/onboarding" className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 flex items-center gap-2">
                Start Writing <LucideArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/dashboard" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-black transition-all">
                View Dashboard
              </Link>
            </div>
          </div>
          <div className="bg-gray-900 rounded-2xl h-80 lg:h-96 flex items-center justify-center border border-gray-800">
            <div className="text-center space-y-4 p-8">
              <div className="text-6xl">✍️</div>
              <p className="text-gray-400 text-sm">AI-Powered Writing Assistant</p>
              <div className="flex gap-2 justify-center">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">Style Training</span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs">Continuity Guard</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-900 to-black px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From style analysis to audiobook generation — one platform for the complete author journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<LucideBrain className="w-8 h-8" />}
              title="Style Training"
              description="Upload your writing samples and our AI analyzes your unique voice — sentence rhythm, vocabulary, pacing, and dialogue style."
              gradient="from-purple-500 to-blue-500"
            />
            <FeatureCard
              icon={<LucideShieldCheck className="w-8 h-8" />}
              title="Continuity Guard"
              description="Automatic scanning for narrative inconsistencies. Character locations, timelines, relationships — nothing slips through."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<LucideSparkles className="w-8 h-8" />}
              title="Style-Aware Generation"
              description="Generate chapters that sound like YOU wrote them. AI matches your prose style, POV, tense, and pacing."
              gradient="from-cyan-500 to-purple-500"
            />
            <FeatureCard
              icon={<LucideHeadphones className="w-8 h-8" />}
              title="Audiobook Export"
              description="Convert your completed manuscripts into high-quality M4B audiobooks with chapter markers."
              gradient="from-purple-500 to-cyan-500"
            />
            <FeatureCard
              icon={<LucideZap className="w-8 h-8" />}
              title="Credit Economy"
              description="Earn credits by writing daily, completing prompts, and training styles. Spend them on AI operations."
              gradient="from-blue-400 to-cyan-400"
            />
            <FeatureCard
              icon={<LucideBook className="w-8 h-8" />}
              title="Universe Management"
              description="Build rich story universes with lore, characters, and relationships that AI references during generation."
              gradient="from-purple-400 to-blue-400"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl lg:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Three Simple Steps
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard number={1} title="Train Your Style" description="Upload 3+ chapters of your writing. Our AI builds a fingerprint of your unique voice." />
            <StepCard number={2} title="Build Your Universe" description="Define your world, characters, and lore. The AI uses this for continuity-aware generation." />
            <StepCard number={3} title="Write Together" description="Generate chapters, check continuity, and refine — all while sounding authentically like you." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-gray-800 rounded-2xl p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Ready to start your next masterpiece?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join authors who use AI to enhance their creativity without losing their unique voice.
            </p>
            <Link href="/onboarding" className="inline-flex bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold px-10 py-4 rounded-lg hover:opacity-90 transition-all transform hover:scale-105">
              Create Your First Universe
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <div className="bg-[#2a2a2a] border border-gray-800 p-6 rounded-lg hover:border-purple-500/50 transition-colors group">
      <div className={`mb-4 w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-r ${gradient} text-white`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white">
        {number}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
