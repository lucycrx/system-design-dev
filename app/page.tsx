import Link from "next/link";
import { getAllStories } from "@/lib/content";
import { StickyTabs } from "@/components/ui/StickyTabs";

export default function HomePage() {
  const stories = getAllStories();

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

      <StickyTabs />

      <main className="max-w-4xl mx-auto px-6 pb-24 pt-10">
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
      </main>
    </div>
  );
}
