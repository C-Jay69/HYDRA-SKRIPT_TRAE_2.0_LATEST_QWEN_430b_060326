import { LucideBookOpen, LucideBrain, LucideCheck, LucideSparkles, LucideArrowRight } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">HydraSkript</span>
        </h1>
        <p className="text-gray-400">Let's set up your writing universe in three easy steps</p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Create Universe */}
        <OnboardingStep
          number={1}
          title="Create Your Universe"
          description="Define the world your stories live in — genre, tone, characters, and lore."
          icon={<LucideBookOpen className="w-6 h-6" />}
          status="active"
        >
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Universe Name</label>
              <input
                type="text"
                placeholder="e.g. The Realm of Shadows"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea
                placeholder="Describe your story world..."
                rows={3}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Genre</label>
                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-3 text-white">
                  <option value="fantasy">Fantasy</option>
                  <option value="sci_fi">Science Fiction</option>
                  <option value="mystery">Mystery</option>
                  <option value="thriller">Thriller</option>
                  <option value="romance">Romance</option>
                  <option value="literary">Literary Fiction</option>
                  <option value="historical">Historical</option>
                  <option value="contemporary">Contemporary</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tone</label>
                <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-3 text-white">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="serious">Serious</option>
                  <option value="humorous">Humorous</option>
                  <option value="dramatic">Dramatic</option>
                  <option value="satirical">Satirical</option>
                </select>
              </div>
            </div>
            <button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold px-6 py-3 rounded-lg w-full hover:opacity-90 transition-all flex items-center justify-center gap-2">
              Create Universe <LucideArrowRight className="w-4 h-4" />
            </button>
          </div>
        </OnboardingStep>

        {/* Step 2: Train Style */}
        <OnboardingStep
          number={2}
          title="Train Your Writing Style"
          description="Upload writing samples so AI can learn your unique voice."
          icon={<LucideBrain className="w-6 h-6" />}
          status="locked"
        />

        {/* Step 3: First Chapter */}
        <OnboardingStep
          number={3}
          title="Write Your First Chapter"
          description="Start writing manually or let AI generate a draft in your style."
          icon={<LucideSparkles className="w-6 h-6" />}
          status="locked"
        />
      </div>

      {/* Skip */}
      <div className="text-center mt-8">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          Skip onboarding for now →
        </Link>
      </div>
    </div>
  );
}

function OnboardingStep({
  number,
  title,
  description,
  icon,
  status,
  children,
}: {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "active" | "locked";
  children?: React.ReactNode;
}) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";

  return (
    <div className={`bg-[#2a2a2a] rounded-lg border ${
      isLocked ? 'border-gray-800 opacity-50' :
      isCompleted ? 'border-green-500/50' :
      'border-purple-500/50'
    } p-6`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          isCompleted ? 'bg-green-500' :
          isLocked ? 'bg-gray-700' :
          'bg-gradient-to-r from-purple-500 to-cyan-500'
        }`}>
          {isCompleted ? <LucideCheck className="w-5 h-5 text-white" /> :
           <span className="text-white font-bold">{number}</span>}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
          {!isLocked && children}
        </div>
      </div>
    </div>
  );
}
