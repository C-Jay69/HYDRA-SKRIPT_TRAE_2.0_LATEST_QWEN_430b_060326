import { LucideBook, LucideSparkles, LucideBrain, LucideZap, LucideShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-8">
      <section className="flex flex-col items-center text-center gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-100">
          Empower Your Writing with <span className="text-indigo-400">HydraSkript</span>
        </h1>
        <p className="max-w-[700px] text-lg text-slate-400">
          The high-performance platform for AI-assisted writing, story continuity management, and automated content generation.
        </p>
        <div className="flex gap-4 mt-4">
          <button className="px-6 py-3 rounded-md bg-indigo-600 font-semibold text-white hover:bg-indigo-500 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 rounded-md bg-slate-800 font-semibold text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700">
            View Docs
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<LucideBrain className="w-8 h-8 text-indigo-400" />}
          title="Style Training"
          description="Analyze your unique writing style using local LLMs to create a digital voice fingerprint."
        />
        <FeatureCard 
          icon={<LucideShieldCheck className="w-8 h-8 text-indigo-400" />}
          title="Continuity Guard"
          description="Automated scanning for narrative inconsistencies across chapters, characters, and locations."
        />
        <FeatureCard 
          icon={<LucideSparkles className="w-8 h-8 text-indigo-400" />}
          title="Style-Aware Generation"
          description="Generate new chapters that maintain your exact prose style and narrative voice."
        />
        <FeatureCard 
          icon={<LucideBook className="w-8 h-8 text-indigo-400" />}
          title="Audiobook Generation"
          description="Convert completed manuscripts into high-quality audiobooks with AI voice synthesis."
        />
        <FeatureCard 
          icon={<LucideZap className="w-8 h-8 text-indigo-400" />}
          title="Credit Economy"
          description="Integrated system for AI operations, with ways to earn credits through writing goals."
        />
        <FeatureCard 
          icon={<LucideSparkles className="w-8 h-8 text-indigo-400" />}
          title="Model Agnostic"
          description="Switch between local Ollama models and cloud providers like Gemini or OpenRouter."
        />
      </div>

      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-bold text-slate-100">Ready to start your next masterpiece?</h2>
          <p className="text-slate-400">
            Join 1,000+ authors who are using AI to enhance their creativity without losing their unique voice.
          </p>
        </div>
        <button className="whitespace-nowrap px-8 py-4 rounded-lg bg-indigo-600 font-bold text-white hover:bg-indigo-500 transition-all transform hover:scale-105">
          Create Your First Universe
        </button>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-indigo-500/50 transition-colors group">
      <div className="mb-4 bg-slate-800 w-14 h-14 rounded-lg flex items-center justify-center group-hover:bg-indigo-900/30 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
