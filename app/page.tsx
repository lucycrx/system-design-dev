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
      <section className="max-w-5xl mx-auto px-6 pb-24 pt-4">
        <p className="label-mono text-text-muted mb-8">
          Two ways to learn
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Build Stories */}
          <Link
            href="/stories"
            className="group bg-surface border border-border p-8 hover:border-text/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text group-hover:text-accent transition-colors tracking-[-0.01em] uppercase">
                Build Stories
              </h2>
              <span className="text-text-dim group-hover:text-accent group-hover:translate-x-1 transition-all text-lg font-mono">
                &rarr;
              </span>
            </div>
            <p className="text-[0.9375rem] text-text-muted leading-relaxed mb-6">
              Follow a product as it grows from MVP to production scale. Each
              story introduces system design concepts as they become necessary.
            </p>
            <span className="label-mono text-text-dim">
              {stories.length} {stories.length === 1 ? "story" : "stories"}
            </span>
          </Link>

          {/* Curriculum */}
          <Link
            href="/curriculum"
            className="group bg-surface border border-border p-8 hover:border-text/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text group-hover:text-accent transition-colors tracking-[-0.01em] uppercase">
                Curriculum
              </h2>
              <span className="text-text-dim group-hover:text-accent group-hover:translate-x-1 transition-all text-lg font-mono">
                &rarr;
              </span>
            </div>
            <p className="text-[0.9375rem] text-text-muted leading-relaxed mb-6">
              Structured lessons organized by topic. Start from the basics or
              jump to what you need.
            </p>
            <span className="label-mono text-text-dim">
              {modules.length} {modules.length === 1 ? "module" : "modules"} &middot; {totalLessons} lessons
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
