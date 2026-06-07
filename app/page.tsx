import Link from "next/link";
import type { GlossaryTerm } from "@/types/story";
import { getAllStories, getAllModules, getGlossaryTerms } from "@/lib/content";
import { CanvasWaveBackground } from "@/components/landing/CanvasWaveBackground";
import { ConceptCard } from "@/components/concepts/ConceptCard";
import { PathCards } from "@/components/ui/PathCards";
import { SectionNumber } from "@/components/landing/SectionNumber";

// A visually-varied slice spanning all six categories, shown on the homepage.
const FEATURED_IDS = [
  "client-server",
  "cache",
  "load-balancer",
  "read-replica",
  "message-queue",
  "microservices",
];

export default function HomePage() {
  const stories = getAllStories();
  const modules = getAllModules();
  const terms = getGlossaryTerms();
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  const byId = new Map(terms.map((t) => [t.id, t]));
  const featured = FEATURED_IDS.map((id) => byId.get(id)).filter(
    (t): t is GlossaryTerm => Boolean(t)
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <CanvasWaveBackground />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-28 sm:pt-32 sm:pb-36">
          <p className="label-mono text-accent mb-5">System Design School</p>
          <h1 className="heading-hero text-4xl sm:text-6xl lg:text-7xl text-text max-w-3xl">
            Learn how apps scale, one concept at a time.
          </h1>
          <p className="mt-6 text-lg text-text-muted leading-relaxed max-w-xl">
            Caching, load balancing, sharding, queues — the ideas behind every
            system that handles millions of users, explained in plain English
            with real-world analogies.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/concepts"
              className="bg-accent hover:bg-accent-dark text-white px-6 py-3 label-mono transition-colors"
            >
              Browse Concepts
            </Link>
            <Link
              href="/stories"
              className="border border-border hover:border-accent bg-bg/80 text-text px-6 py-3 label-mono transition-colors"
            >
              Build Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured concepts */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24">
        <div className="flex items-baseline justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-baseline gap-5">
            <SectionNumber number="01" />
            <h2 className="heading-editorial text-2xl sm:text-3xl text-text">
              Start with the concepts
            </h2>
          </div>
          <Link
            href="/concepts"
            className="group label-mono text-text-dim hover:text-accent transition-colors inline-flex items-center gap-1.5"
          >
            All {terms.length} concepts
            <span className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((term, i) => (
            <ConceptCard key={term.id} term={term} index={i} />
          ))}
        </div>
      </section>

      {/* Three ways to learn */}
      <section className="max-w-6xl mx-auto px-6 py-16 sm:py-24 border-t border-border">
        <div className="flex items-baseline gap-5 mb-4">
          <SectionNumber number="02" />
          <h2 className="heading-editorial text-2xl sm:text-3xl text-text">
            Three ways to learn
          </h2>
        </div>
        <p className="font-mono text-[13px] text-text-muted leading-relaxed mb-10 max-w-lg">
          Look up an idea, watch a product grow into it, or work through a
          structured path — whatever fits how you learn.
        </p>

        <PathCards
          conceptCount={terms.length}
          storyCount={stories.length}
          moduleCount={modules.length}
          lessonCount={totalLessons}
        />
      </section>

      {/* Footer CTA + footer — full-width blue background */}
      <footer className="bg-accent-dark">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <h2 className="heading-editorial text-2xl sm:text-3xl text-white max-w-lg">
            Ready to dig in?
          </h2>
          <p className="text-white/70 mt-3 max-w-md text-[15px] leading-relaxed">
            Start with the concepts, then watch them come together as a real
            product scales from two users to millions.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/concepts"
              className="bg-white text-accent-dark hover:bg-white/90 px-6 py-3 label-mono transition-colors"
            >
              Browse Concepts
            </Link>
            <Link
              href="/curriculum"
              className="border border-white/30 hover:border-white text-white px-6 py-3 label-mono transition-colors"
            >
              Curriculum
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 pt-8 pb-12 border-t border-white/15">
          <div className="flex items-center justify-between">
            <span className="label-mono text-white/70">system-design-school</span>
            <a
              href="https://github.com/lucycrx/system-design-dev"
              className="relative label-mono text-white/60 hover:text-white transition-colors duration-200 group"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full" />
            </a>
          </div>
          <p className="font-mono text-[11px] text-white/30 mt-4">
            &copy; 2026 System Design School. Built with Claude Code.
          </p>
        </div>
      </footer>
    </div>
  );
}
