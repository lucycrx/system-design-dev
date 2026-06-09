import Link from "next/link";
import type { CSSProperties } from "react";
import type { GlossaryTerm } from "@/types/story";
import { getAllStories, getAllModules, getGlossaryTerms } from "@/lib/content";
import { ConceptCard } from "@/components/concepts/ConceptCard";
import { PathCards } from "@/components/ui/PathCards";
import { Shape, ShapeDrift } from "@/components/ui/Shape";

const RED = "#D62828";
const BLUE = "#1D4E89";
const YELLOW = "#F4C430";

// A visually-varied slice spanning all six categories, shown on the homepage.
const FEATURED_IDS = [
  "client-server",
  "cache",
  "load-balancer",
  "read-replica",
  "message-queue",
  "microservices",
];

// Headline split into words; one word carries a primary accent. Each letter
// slides up with a staggered delay via the global .reveal-up utility.
function Headline() {
  const words: { text: string; color?: string }[] = [
    { text: "Learn" },
    { text: "how" },
    { text: "apps" },
    { text: "scale.", color: RED },
  ];
  let i = 0;
  return (
    <h1 className="heading-hero text-text" style={{ fontSize: "clamp(3rem, 9.5vw, 8.5rem)" }}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.22em]">
          {[...w.text].map((ch, ci) => (
            <span key={ci} className="reveal-up">
              <span style={{ "--i": i++, color: w.color } as CSSProperties}>{ch}</span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

export default function HomePage() {
  const stories = getAllStories();
  const modules = getAllModules();
  const terms = getGlossaryTerms();
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  const byId = new Map(terms.map((t) => [t.id, t]));
  const featured = FEATURED_IDS.map((id) => byId.get(id)).filter(
    (t): t is GlossaryTerm => Boolean(t)
  );

  // Marquee strip — repeated so the linear scroll loops seamlessly.
  const marqueeItems = terms.slice(0, 16).map((t) => t.term);

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero + marquee fill exactly the first screen: nav (body pt-16) +
          this wrapper = 100svh. flex-col keeps the marquee flush at the fold
          regardless of its height. */}
      <div className="flex flex-col min-h-[calc(100svh-4rem)]">
      {/* Hero — asymmetric, flat drifting shapes behind the type */}
      <section className="relative overflow-hidden flex-1 flex items-center">
        {/* Oversized background shapes (parallax drift, bleeding off edges) */}
        <ShapeDrift speed={0.18} className="pointer-events-none absolute inset-0">
          <Shape
            type="circle"
            color={BLUE}
            size={560}
            style={{ position: "absolute", top: "-12%", right: "-120px", opacity: 0.9 }}
          />
          <Shape
            type="square"
            color={RED}
            size={96}
            style={{ position: "absolute", top: "30%", left: "5%" }}
          />
        </ShapeDrift>
        <ShapeDrift speed={0.32} className="pointer-events-none absolute inset-0">
          <Shape
            type="triangle"
            color={YELLOW}
            size={120}
            style={{ position: "absolute", bottom: "8%", right: "13%" }}
          />
        </ShapeDrift>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8">
          <p className="label-mono text-text-muted mb-5">System Design School</p>
          <Headline />
          <p className="subhead text-lg sm:text-xl text-text-muted leading-snug max-w-xl mt-6">
            The ideas behind every system that handles millions of users —
            caching, load balancing, sharding, queues — in plain English.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/concepts"
              data-cursor
              className="bg-text text-bg px-7 py-3.5 label-mono transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5"
            >
              Browse Concepts
            </Link>
            <Link
              href="/stories"
              data-cursor
              className="border border-text/20 hover:border-text text-text px-7 py-3.5 label-mono transition-colors duration-500"
            >
              Build Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee chromatic break — full-bleed red block */}
      <section
        className="marquee-pause overflow-hidden border-y border-text/10 py-5"
        style={{ backgroundColor: RED }}
      >
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((label, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="label-mono text-[#F4F1EA]" style={{ fontSize: "0.875rem" }}>
                {label}
              </span>
              <Shape type="circle" color="#F4F1EA" size={6} />
            </span>
          ))}
        </div>
      </section>
      </div>

      {/* Intro statement — triangle lead-in */}
      <section className="max-w-3xl mx-auto px-6 py-20 sm:py-28">
        <Shape type="triangle" color={YELLOW} size={28} className="mb-6" />
        <p className="heading-editorial text-2xl sm:text-3xl lg:text-[2.5rem] text-text leading-[1.05]">
          Most explanations of system design assume you already know the
          jargon. This one doesn&apos;t. Every idea starts from a real problem,
          a plain-English analogy, and a picture of what&apos;s actually{" "}
          <span style={{ color: BLUE }}>happening</span>.
        </p>
      </section>

      {/* Featured concepts */}
      <section className="max-w-6xl mx-auto px-6 pb-20 sm:pb-28">
        <div className="flex items-baseline justify-between gap-4 mb-10 flex-wrap">
          <div className="flex items-center gap-4">
            <Shape type="square" color={RED} size={18} />
            <h2 className="heading-editorial text-2xl sm:text-3xl text-text">
              Start with the concepts
            </h2>
          </div>
          <Link
            href="/concepts"
            data-cursor
            className="group label-mono text-text-muted hover:text-text transition-colors inline-flex items-center gap-1.5"
          >
            All {terms.length} concepts
            <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((term, i) => (
            <ConceptCard key={term.id} term={term} index={i} animate />
          ))}
        </div>
      </section>

      {/* Three ways to learn */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28 border-t border-text/10">
        <div className="flex items-center gap-4 mb-3">
          <Shape type="circle" color={BLUE} size={18} />
          <h2 className="heading-editorial text-2xl sm:text-3xl text-text">
            Three ways to learn
          </h2>
        </div>
        <p className="subhead text-text-muted leading-relaxed mb-12 max-w-lg">
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

      {/* Footer — ink block with primary shape accents */}
      <footer className="relative overflow-hidden" style={{ backgroundColor: "#1A1A1A" }}>
        <Shape
          type="circle"
          color={YELLOW}
          size={140}
          className="pointer-events-none absolute"
          style={{ top: "-40px", right: "8%", opacity: 0.9 }}
        />
        <Shape
          type="triangle"
          color={RED}
          size={90}
          className="pointer-events-none absolute"
          style={{ bottom: "30px", left: "-20px", opacity: 0.9 }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-24">
          <h2 className="heading-hero text-4xl sm:text-6xl max-w-2xl" style={{ color: "#F4F1EA" }}>
            Ready to dig <span style={{ color: YELLOW }}>in?</span>
          </h2>
          <p className="subhead mt-5 max-w-md text-[15px] leading-relaxed" style={{ color: "rgba(244,241,234,0.7)" }}>
            Start with the concepts, then watch them come together as a real
            product scales from two users to millions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/concepts"
              data-cursor
              className="px-7 py-3.5 label-mono transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5"
              style={{ backgroundColor: "#F4F1EA", color: "#1A1A1A" }}
            >
              Browse Concepts
            </Link>
            <Link
              href="/curriculum"
              data-cursor
              className="px-7 py-3.5 label-mono border transition-colors duration-500"
              style={{ borderColor: "rgba(244,241,234,0.3)", color: "#F4F1EA" }}
            >
              Curriculum
            </Link>
          </div>

          <div className="mt-20 pt-8 flex items-center justify-between border-t" style={{ borderColor: "rgba(244,241,234,0.12)" }}>
            <span className="label-mono" style={{ color: "rgba(244,241,234,0.7)" }}>
              system-design-school
            </span>
            <a
              href="https://github.com/lucycrx/system-design-dev"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              className="label-mono transition-colors duration-300"
              style={{ color: "rgba(244,241,234,0.6)" }}
            >
              GitHub
            </a>
          </div>
          <p className="label-mono mt-4" style={{ color: "rgba(244,241,234,0.3)", fontSize: "0.75rem" }}>
            &copy; 2026 System Design School
          </p>
        </div>
      </footer>
    </div>
  );
}
