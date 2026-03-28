import Link from "next/link";
import { getAllModules } from "@/lib/content";

const MODULE_COLORS: Record<string, string> = {
  accent: "border-accent/20 hover:border-accent/40",
  blue: "border-blue/20 hover:border-blue/40",
  green: "border-green/20 hover:border-green/40",
  orange: "border-orange/20 hover:border-orange/40",
  pink: "border-pink/20 hover:border-pink/40",
  purple: "border-purple/20 hover:border-purple/40",
};

const MODULE_TEXT_COLORS: Record<string, string> = {
  accent: "text-accent",
  blue: "text-blue",
  green: "text-green",
  orange: "text-orange",
  pink: "text-pink",
  purple: "text-purple",
};

const MODULE_BG_COLORS: Record<string, string> = {
  accent: "bg-accent-dim",
  blue: "bg-blue-dim",
  green: "bg-green-dim",
  orange: "bg-orange-dim",
  pink: "bg-pink-dim",
  purple: "bg-purple-dim",
};

export default function CurriculumPage() {
  const modules = getAllModules();

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-sm text-text-muted hover:text-text transition-colors flex items-center gap-2"
          >
            <span>←</span> Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono text-blue font-semibold uppercase tracking-[2px]">
              Curriculum
            </span>
          </div>
          <h1 className="text-4xl font-bold text-text mb-2">
            Learn Systematically
          </h1>
          <p className="text-lg text-text-muted max-w-xl leading-relaxed">
            A structured path through the fundamentals. Each lesson follows a
            clear framework: What is it? Why does it matter? How does it work?
            When should I use it?
          </p>
        </div>

        <div className="space-y-4">
          {modules.map((mod) => (
            <Link
              key={mod.id}
              href={`/curriculum/${mod.slug}`}
              className={`group block bg-surface border ${MODULE_COLORS[mod.color]} rounded-2xl p-6 transition-all`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-xl ${MODULE_BG_COLORS[mod.color]} flex items-center justify-center text-2xl`}
                >
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[11px] font-mono ${MODULE_TEXT_COLORS[mod.color]}`}
                    >
                      Module {mod.moduleNumber}
                    </span>
                    <span className="text-[11px] text-text-dim">
                      {mod.lessons.length} lessons
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-text group-hover:text-accent transition-colors">
                    {mod.title}
                  </h2>
                  <p className="text-sm text-text-muted mt-1">
                    {mod.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {mod.lessons.slice(0, 3).map((lesson) => (
                      <span
                        key={lesson.id}
                        className="text-[10px] px-2 py-0.5 rounded bg-bg border border-border text-text-dim"
                      >
                        {lesson.title.length > 30
                          ? lesson.title.slice(0, 30) + "..."
                          : lesson.title}
                      </span>
                    ))}
                    {mod.lessons.length > 3 && (
                      <span className="text-[10px] text-text-dim">
                        +{mod.lessons.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-text-dim group-hover:text-accent transition-colors text-lg mt-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Future modules placeholder */}
        <div className="mt-4 space-y-3">
          {[
            { num: 3, title: "Architecture Patterns", icon: "🏗️" },
            { num: 4, title: "Making It Real (Deployment)", icon: "🚀" },
            { num: 5, title: "Level Up", icon: "⚡" },
            { num: 6, title: "AI-Specific Concepts", icon: "🤖" },
          ].map((mod) => (
            <div
              key={mod.num}
              className="bg-surface/50 border border-dashed border-border rounded-2xl p-6 flex items-center gap-4 opacity-50"
            >
              <div className="w-12 h-12 rounded-xl bg-bg flex items-center justify-center text-2xl">
                {mod.icon}
              </div>
              <div>
                <span className="text-[11px] font-mono text-text-dim">
                  Module {mod.num}
                </span>
                <h3 className="text-base font-semibold text-text-muted">
                  {mod.title}
                </h3>
                <p className="text-xs text-text-dim">Coming soon</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
