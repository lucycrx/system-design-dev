import Link from "next/link";
import { getAllStories, getAllModules } from "@/lib/content";

export default function HomePage() {
  const stories = getAllStories();
  const modules = getAllModules();

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <div className="mb-3">
          <span className="text-[11px] font-mono text-accent font-medium uppercase tracking-[3px]">
            System Design for Builders
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-text leading-tight mb-5">
          Learn why systems work
          <br />
          <span className="text-text-muted font-light">(and why they break)</span>
        </h1>
        <p className="text-lg text-text-muted max-w-xl leading-relaxed">
          Interactive stories and structured lessons that teach system design to
          vibecoders, PMs, and founders — not just engineers prepping for
          interviews.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24">
        {/* Two learning modes */}
        <div className="grid gap-5 sm:grid-cols-2 mb-14">
          {/* Build Stories card */}
          <Link
            href="#stories"
            className="group bg-surface border border-accent/20 rounded-2xl p-7 hover:border-accent/40 hover:shadow-sm transition-all"
          >
            <h2 className="text-lg font-bold text-text group-hover:text-accent transition-colors mb-1.5">
              Build Stories
            </h2>
            <p className="text-sm text-text-muted leading-relaxed mb-3">
              Learn by feeling the problem. Follow an app from 2 users to 2
              million and discover what breaks at each stage.
            </p>
            <span className="text-xs text-accent font-medium">
              Narrative &middot; Exploratory &middot; Intuition-building &rarr;
            </span>
          </Link>

          {/* Curriculum card */}
          <Link
            href="#curriculum"
            className="group bg-surface border border-blue/20 rounded-2xl p-7 hover:border-blue/40 hover:shadow-sm transition-all"
          >
            <h2 className="text-lg font-bold text-text group-hover:text-blue transition-colors mb-1.5">
              Curriculum
            </h2>
            <p className="text-sm text-text-muted leading-relaxed mb-3">
              Learn systematically. Structured modules from basics to advanced,
              each lesson following What &rarr; Why &rarr; How &rarr; When.
            </p>
            <span className="text-xs text-blue font-medium">
              Structured &middot; Sequential &middot; Comprehensive &rarr;
            </span>
          </Link>
        </div>

        {/* Build Stories section */}
        <section id="stories" className="mb-16 scroll-mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-dim">
              Build Stories
            </h2>
            <span className="text-xs text-text-dim">
              {stories.length} {stories.length === 1 ? "story" : "stories"}
            </span>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {stories.map((story) => (
              <Link
                key={story.id}
                href={`/stories/${story.slug}`}
                className="group bg-surface border border-border rounded-2xl p-7 hover:border-accent/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-dim text-green border border-green/20">
                    {story.difficulty}
                  </span>
                  <span className="text-[11px] text-text-dim font-mono">
                    ~{story.estimatedMinutes} min
                  </span>
                </div>
                <h3 className="text-xl font-bold text-text group-hover:text-accent transition-colors mb-1.5">
                  {story.title}
                </h3>
                <p className="text-sm text-text-muted mb-1">
                  {story.subtitle}
                </p>
                <p className="text-xs text-text-dim leading-relaxed mt-4 line-clamp-2">
                  {story.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {story.concepts.slice(0, 4).map((c) => (
                    <span
                      key={c}
                      className="text-[10px] px-2 py-0.5 rounded bg-bg border border-border text-text-dim font-mono"
                    >
                      {c}
                    </span>
                  ))}
                  {story.concepts.length > 4 && (
                    <span className="text-[10px] text-text-dim">
                      +{story.concepts.length - 4} more
                    </span>
                  )}
                </div>
              </Link>
            ))}
            {/* Coming soon placeholder */}
            <div className="border border-dashed border-border rounded-2xl p-7 flex items-center justify-center">
              <p className="text-text-dim text-sm text-center">
                More stories coming soon
              </p>
            </div>
          </div>
        </section>

        {/* Curriculum section */}
        <section id="curriculum" className="scroll-mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-dim">
              Curriculum
            </h2>
            <Link
              href="/curriculum"
              className="text-xs text-blue hover:text-blue/80 transition-colors"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="space-y-3">
            {modules.map((mod) => (
              <Link
                key={mod.id}
                href={`/curriculum/${mod.slug}`}
                className="group block bg-surface border border-border rounded-xl p-5 hover:border-blue/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-dim flex items-center justify-center text-sm font-bold text-blue font-mono">
                    {mod.moduleNumber}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-blue">
                        Module {mod.moduleNumber}
                      </span>
                      <span className="text-[11px] text-text-dim">
                        {mod.lessons.length} lessons
                      </span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-text group-hover:text-blue transition-colors">
                      {mod.title}
                    </h3>
                  </div>
                  <span className="text-text-dim group-hover:text-blue transition-colors">
                    &rarr;
                  </span>
                </div>
              </Link>
            ))}

            {/* Future modules */}
            {[
              { num: 3, title: "Architecture Patterns" },
              { num: 4, title: "Deployment" },
              { num: 5, title: "Level Up" },
              { num: 6, title: "AI Concepts" },
            ].map((mod) => (
              <div
                key={mod.num}
                className="bg-surface/30 border border-dashed border-border rounded-xl p-5 flex items-center gap-4 opacity-40"
              >
                <div className="w-10 h-10 rounded-lg bg-bg flex items-center justify-center text-sm font-mono text-text-dim">
                  {mod.num}
                </div>
                <div>
                  <span className="text-[11px] font-mono text-text-dim">
                    Module {mod.num}
                  </span>
                  <h3 className="text-[15px] font-medium text-text-muted">
                    {mod.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
