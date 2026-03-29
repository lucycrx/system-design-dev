import Link from "next/link";
import type { Story, CurriculumModule } from "@/types/story";

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

const MODULE_BG_FULL_COLORS: Record<string, string> = {
  accent: "bg-accent",
  blue: "bg-blue",
  green: "bg-green",
  orange: "bg-orange",
  pink: "bg-pink",
  purple: "bg-purple",
};

export function StoriesPanel({ stories }: { stories: Story[] }) {
  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <h2 className="label-mono text-text-dim">
          Build Stories
        </h2>
        <span className="label-mono text-text-dim">
          {stories.length} {stories.length === 1 ? "story" : "stories"}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {stories.map((story, i) => (
          <Link
            key={story.id}
            href={`/stories/${story.slug}`}
            className="group bg-surface border border-border p-7 hover:border-text/30 transition-all duration-200 animate-[fade-up_0.4s_ease-out_both]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center gap-2.5 mb-5">
              <span className={`label-mono px-2 py-0.5 text-bg ${
                story.difficulty === "beginner"
                  ? "bg-green"
                  : story.difficulty === "intermediate"
                  ? "bg-orange"
                  : "bg-accent"
              }`}>
                {story.difficulty}
              </span>
              <span className="label-mono text-text-dim">
                ~{story.estimatedMinutes} min
              </span>
            </div>
            <h3 className="text-lg font-bold text-text group-hover:text-accent transition-colors mb-1 leading-snug tracking-[-0.01em] uppercase">
              {story.title}
            </h3>
            <p className="text-[0.9375rem] text-text-muted leading-snug">
              {story.subtitle}
            </p>
            <p className="text-sm text-text-dim leading-relaxed mt-3 line-clamp-2">
              {story.description}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-6 pt-5 border-t border-border/60">
              {story.concepts.slice(0, 4).map((c) => (
                <span
                  key={c}
                  className="label-mono px-2 py-0.5 bg-bg border border-border text-text-dim"
                >
                  {c}
                </span>
              ))}
              {story.concepts.length > 4 && (
                <span className="label-mono text-text-dim">
                  +{story.concepts.length - 4} more
                </span>
              )}
            </div>
          </Link>
        ))}
        {/* Coming soon placeholder */}
        <div className="border border-dashed border-text-dim/20 p-8 flex items-center justify-center">
          <p className="label-mono text-text-dim">
            More stories coming soon
          </p>
        </div>
      </div>
    </>
  );
}

export function CurriculumPanel({ modules }: { modules: CurriculumModule[] }) {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <h2 className="label-mono text-text-dim">
          Curriculum
        </h2>
        <span className="label-mono text-text-dim">
          {modules.length} {modules.length === 1 ? "module" : "modules"} &middot; {totalLessons} lessons
        </span>
      </div>
      <div className="space-y-4">
        {modules.map((mod, i) => (
          <Link
            key={mod.id}
            href={`/curriculum/${mod.slug}`}
            className={`group block bg-surface border ${MODULE_COLORS[mod.color]} p-7 hover:border-text/30 transition-all duration-200 animate-[fade-up_0.4s_ease-out_both]`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start gap-5">
              <div
                className={`flex-shrink-0 w-10 h-10 ${MODULE_BG_FULL_COLORS[mod.color]} flex items-center justify-center text-lg font-bold font-mono text-bg`}
              >
                {mod.moduleNumber}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span
                    className={`label-mono font-medium ${MODULE_TEXT_COLORS[mod.color]}`}
                  >
                    Module {mod.moduleNumber}
                  </span>
                  <span className="label-mono text-text-dim">
                    {mod.lessons.length} lessons
                  </span>
                </div>
                <h2 className="text-xl font-bold text-text group-hover:text-accent transition-colors leading-snug tracking-[-0.01em] uppercase">
                  {mod.title}
                </h2>
                <p className="text-[0.9375rem] text-text-muted mt-1.5 leading-snug">
                  {mod.subtitle}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/50">
                  {mod.lessons.slice(0, 3).map((lesson) => (
                    <span
                      key={lesson.id}
                      className="label-mono px-2 py-0.5 bg-bg border border-border text-text-dim"
                    >
                      {lesson.title.length > 30
                        ? lesson.title.slice(0, 30) + "..."
                        : lesson.title}
                    </span>
                  ))}
                  {mod.lessons.length > 3 && (
                    <span className="label-mono text-text-dim">
                      +{mod.lessons.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <span className="text-text-dim group-hover:text-accent group-hover:translate-x-1 transition-all text-lg mt-3 font-mono">
                &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Future modules placeholder */}
      <div className="mt-4 space-y-3">
        {[
          { num: 3, title: "Architecture Patterns" },
          { num: 4, title: "Making It Real (Deployment)" },
          { num: 5, title: "Level Up" },
          { num: 6, title: "AI-Specific Concepts" },
        ].map((mod) => (
          <div
            key={mod.num}
            className="bg-surface/50 border border-dashed border-border p-7 flex items-center gap-5 opacity-35"
          >
            <div className="w-10 h-10 bg-bg flex items-center justify-center text-lg font-mono text-text-dim">
              {mod.num}
            </div>
            <div>
              <span className="label-mono text-text-dim">
                Module {mod.num}
              </span>
              <h3 className="text-lg font-bold text-text-muted tracking-[-0.01em] uppercase">
                {mod.title}
              </h3>
              <p className="label-mono text-text-dim mt-1">Coming soon</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
