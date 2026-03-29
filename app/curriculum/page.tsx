import Link from "next/link";
import { getAllModules } from "@/lib/content";
import { StickyTabs } from "@/components/ui/StickyTabs";

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
      {/* Shared hero */}
      <header className="max-w-4xl mx-auto px-6 pt-28 pb-24">
        <div className="mb-5">
          <span className="text-[11px] font-mono text-accent font-medium uppercase tracking-[3px]">
            System Design for Builders
          </span>
        </div>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-text leading-[1.04] mb-8">
          Learn why
          <br />
          systems work
          <br />
          <span className="text-accent font-bold italic">(and why they break)</span>
        </h1>
        <p className="text-lg sm:text-xl text-text-muted max-w-lg leading-relaxed font-light">
          A structured path through the fundamentals. Each lesson follows a
          clear framework: What &rarr; Why &rarr; How &rarr; When.
        </p>
      </header>

      <StickyTabs />

      <main className="max-w-4xl mx-auto px-6 pb-24 pt-12">

        <div className="space-y-5">
          {modules.map((mod, i) => (
            <Link
              key={mod.id}
              href={`/curriculum/${mod.slug}`}
              className={`group block bg-surface border ${MODULE_COLORS[mod.color]} rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out animate-[fade-up_0.4s_ease-out_both]`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-5">
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-2xl ${MODULE_BG_COLORS[mod.color]} flex items-center justify-center text-2xl font-bold font-mono ${MODULE_TEXT_COLORS[mod.color]}`}
                >
                  {mod.moduleNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-[11px] font-mono font-medium ${MODULE_TEXT_COLORS[mod.color]}`}
                    >
                      Module {mod.moduleNumber}
                    </span>
                    <span className="text-[11px] text-text-dim">
                      {mod.lessons.length} lessons
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-text group-hover:text-accent transition-colors leading-snug">
                    {mod.title}
                  </h2>
                  <p className="text-sm text-text-muted mt-1.5">
                    {mod.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/50">
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
                <span className="text-text-dim group-hover:text-accent group-hover:translate-x-1 transition-all text-lg mt-3">
                  &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Future modules placeholder */}
        <div className="mt-5 space-y-4">
          {[
            { num: 3, title: "Architecture Patterns" },
            { num: 4, title: "Making It Real (Deployment)" },
            { num: 5, title: "Level Up" },
            { num: 6, title: "AI-Specific Concepts" },
          ].map((mod) => (
            <div
              key={mod.num}
              className="bg-surface/50 border border-dashed border-border rounded-2xl p-8 flex items-center gap-5 opacity-35"
            >
              <div className="w-16 h-16 rounded-2xl bg-bg flex items-center justify-center text-2xl font-mono text-text-dim">
                {mod.num}
              </div>
              <div>
                <span className="text-[11px] font-mono text-text-dim">
                  Module {mod.num}
                </span>
                <h3 className="text-lg font-semibold text-text-muted">
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
