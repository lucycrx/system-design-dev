import Link from "next/link";
import { getAllStories, getAllModules } from "@/lib/content";
import { IcebergHero } from "@/components/ui/IcebergHero";

export default function HomePage() {
  const stories = getAllStories();
  const modules = getAllModules();

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-bg">
      <IcebergHero />

      {/* Two learning paths */}
      <section className="max-w-5xl mx-auto px-6 pb-24 pt-10">
        <p className="label-mono text-text-muted mb-10">
          Choose your path
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Build Stories */}
          <Link
            href="/stories"
            className="group bg-surface border border-border p-8 hover:border-text/30 transition-all duration-200 animate-[fade-up_0.4s_ease-out_both]"
          >
            <span className="label-mono text-accent mb-5 block">
              Narrative
            </span>
            <h2 className="text-xl font-bold text-text group-hover:text-accent transition-colors tracking-[-0.01em] uppercase mb-3">
              Build Stories
            </h2>
            <p className="text-[0.9375rem] text-text-muted leading-relaxed mb-8">
              Follow a product from first deploy to production crisis. System
              design concepts arrive when the story demands them.
            </p>
            <div className="flex items-center justify-between pt-5 border-t border-border/60">
              <span className="label-mono text-text-dim">
                {stories.length} {stories.length === 1 ? "story" : "stories"}
              </span>
              <span className="text-text-dim group-hover:text-accent group-hover:translate-x-1 transition-all text-lg font-mono">
                &rarr;
              </span>
            </div>
          </Link>

          {/* Curriculum */}
          <Link
            href="/curriculum"
            className="group bg-surface border border-border p-8 hover:border-text/30 transition-all duration-200 animate-[fade-up_0.4s_ease-out_both] [animation-delay:80ms]"
          >
            <span className="label-mono text-blue mb-5 block">
              Structured
            </span>
            <h2 className="text-xl font-bold text-text group-hover:text-accent transition-colors tracking-[-0.01em] uppercase mb-3">
              Curriculum
            </h2>
            <p className="text-[0.9375rem] text-text-muted leading-relaxed mb-8">
              Lessons organized by topic, from fundamentals to advanced patterns.
              Start at the beginning or jump to what you need.
            </p>
            <div className="flex items-center justify-between pt-5 border-t border-border/60">
              <span className="label-mono text-text-dim">
                {modules.length} {modules.length === 1 ? "module" : "modules"} &middot; {totalLessons} lessons
              </span>
              <span className="text-text-dim group-hover:text-accent group-hover:translate-x-1 transition-all text-lg font-mono">
                &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
