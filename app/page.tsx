import Link from "next/link";
import type { CSSProperties } from "react";
import type { GlossaryTerm } from "@/types/story";
import { getAllStories, getGlossaryTerms } from "@/lib/content";
import { ConceptCard } from "@/components/concepts/ConceptCard";
import { InstallCommand } from "@/components/ui/InstallCommand";
import { SubscribeForm } from "@/components/ui/SubscribeForm";
import { Shape, ShapeDrift } from "@/components/ui/Shape";
import { SITE_NAME, PLUGIN_REPO_URL } from "@/lib/site";

const RED = "#D62828";
const BLUE = "#1D4E89";
const YELLOW = "#F4C430";
const PAPER = "#F4F1EA";

// A visually-varied slice spanning several categories, shown on the homepage.
const FEATURED_IDS = ["cache", "load-balancer", "message-queue"];

// Headline split into words; one word carries a primary accent. Each letter
// slides up with a staggered delay via the global .reveal-up utility.
// `tone="paper"` renders an all-paper copy for the knockout overlay (see hero).
function Headline({ tone = "default" }: { tone?: "default" | "paper" }) {
  const paper = tone === "paper";
  const words: { text: string; color?: string }[] = [
    { text: "See" },
    { text: "what" },
    { text: "you" },
    { text: "actually" },
    { text: "built.", color: RED },
  ];
  let i = 0;
  return (
    <h1 className="heading-hero text-text" style={{ fontSize: "clamp(2.75rem, 8vw, 7rem)" }}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap mr-[0.22em]">
          {[...w.text].map((ch, ci) => (
            <span key={ci} className="reveal-up">
              <span style={{ "--i": i++, color: paper ? PAPER : w.color } as CSSProperties}>{ch}</span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}

// Hero copy block — rendered twice: the base (ink + red accent) and a paper
// `overlay` copy that the knockout mask reveals only over the dark shapes.
function HeroContent({ overlay = false }: { overlay?: boolean }) {
  const light = overlay ? "text-[#F4F1EA]" : "text-text-muted";
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <p className={`label-mono mb-5 ${light}`}>{SITE_NAME} · Claude Code skill</p>
      <Headline tone={overlay ? "paper" : "default"} />
      <p className={`subhead text-lg sm:text-xl leading-snug max-w-xl mt-6 ${light}`}>
        A skill that scans your codebase and hands back an interactive map of your
        architecture — components, data flow, and where it&apos;ll break at scale —
        explained in plain English.
      </p>
      <div className={`mt-7 flex flex-wrap gap-3 ${overlay ? "invisible" : ""}`}>
        <Link
          href="#install"
          data-cursor
          className="bg-text text-bg px-7 py-3.5 label-mono transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5"
        >
          Get the skill
        </Link>
        <Link
          href="/example"
          data-cursor
          className="border border-text/20 hover:border-text text-text px-7 py-3.5 label-mono transition-colors duration-500"
        >
          See an example
        </Link>
      </div>
    </div>
  );
}

// One "what you get" feature, marked by a Bauhaus shape.
function Feature({
  shape,
  color,
  title,
  body,
}: {
  shape: "circle" | "square" | "triangle";
  color: string;
  title: string;
  body: string;
}) {
  return (
    <div className="border border-text/10 bg-bg p-6">
      <Shape type={shape} color={color} size={20} className="mb-5" />
      <h3 className="subhead text-lg text-text mb-2">{title}</h3>
      <p className="text-[0.9375rem] text-text-muted leading-relaxed">{body}</p>
    </div>
  );
}

// Shared section header — one shape marker, one heading, optional subhead.
// Keeps every section on the page to the same visual rhythm.
function SectionHead({
  shape,
  color,
  title,
  subtitle,
}: {
  shape: "circle" | "square" | "triangle";
  color: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-4">
        <Shape type={shape} color={color} size={18} />
        <h2 className="heading-editorial text-2xl sm:text-3xl text-text">{title}</h2>
      </div>
      {subtitle ? (
        <p className="subhead text-text-muted leading-relaxed max-w-xl mt-4">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default function HomePage() {
  const stories = getAllStories();
  const terms = getGlossaryTerms();

  const byId = new Map(terms.map((t) => [t.id, t]));
  const featured = FEATURED_IDS.map((id) => byId.get(id)).filter(
    (t): t is GlossaryTerm => Boolean(t)
  );

  // Marquee strip — repeated so the linear scroll loops seamlessly.
  const marqueeItems = terms.slice(0, 16).map((t) => t.term);

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero + marquee fill the first screen. */}
      <div className="flex flex-col min-h-[calc(100svh-4rem)]">
        {/* Hero — asymmetric, flat drifting shapes behind the type */}
        <section className="relative overflow-hidden flex-1 flex items-center">
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

          {/* Base copy: ink text + red accent */}
          <div className="relative z-10 w-full">
            <HeroContent />
          </div>

          {/* Knockout overlay: a paper copy revealed only over the dark shapes. */}
          <div
            aria-hidden
            className="cs-knockout pointer-events-none absolute inset-0 z-20 flex items-center"
          >
            <div className="w-full">
              <HeroContent overlay />
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

      {/* Install */}
      <section id="install" className="max-w-6xl mx-auto px-6 py-20 sm:py-28 scroll-mt-24">
        <SectionHead
          shape="square"
          color={RED}
          title="Install in Claude Code"
          subtitle="Two commands. It runs locally — your code never leaves your machine — and opens the review in your browser when it's done."
        />
        <div className="max-w-3xl">
          <InstallCommand />
          <p className="label-mono text-text-muted mt-4">
            Then run <span className="text-text">/architecture-review</span> in any
            repo.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="max-w-6xl mx-auto px-6 pb-20 sm:pb-28">
        <SectionHead shape="circle" color={BLUE} title="What you get" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Feature
            shape="circle"
            color={BLUE}
            title="An interactive map"
            body="Your whole system as a browsable diagram — frontend, APIs, databases, caches, queues — with the data flow drawn between them."
          />
          <Feature
            shape="square"
            color={RED}
            title="Plain-English risks"
            body="Where the architecture will strain as you grow, each with a real-world analogy, the scale it bites at, and what the fix looks like."
          />
          <Feature
            shape="triangle"
            color={YELLOW}
            title="A file you can share"
            body="One self-contained HTML file. Drop it in Slack, pull it up in a meeting, or point at it while you explain the system."
          />
        </div>
      </section>

      {/* Example preview link-card */}
      <section className="max-w-6xl mx-auto px-6 pb-20 sm:pb-28">
        <SectionHead shape="triangle" color={YELLOW} title="See a real example" />
        <Link
          href="/example"
          data-cursor
          className="group block border border-text/15 bg-surface p-8 sm:p-10 transition-colors duration-500 hover:border-text/40"
        >
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="label-mono text-text-dim">Input</span>
            <span className="font-mono text-[13px] text-text">facebookresearch/Hyperagents</span>
            <span className="font-mono text-lg text-text-dim">&rarr;</span>
            <span className="label-mono text-text-dim">Output</span>
            <span className="font-mono text-[13px] text-text-muted">Interactive architecture review</span>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <span className="subhead text-xl sm:text-2xl text-text">
              Open the Hyperagents review
            </span>
            <span className="label-mono text-text-muted group-hover:text-text transition-colors inline-flex items-center gap-1.5">
              Open
              <span className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          </div>
        </Link>
      </section>

      {/* Go deeper — demoted learning content */}
      <section className="max-w-6xl mx-auto px-6 py-20 sm:py-28 border-t border-text/10">
        <SectionHead
          shape="circle"
          color={BLUE}
          title="Want to go deeper?"
          subtitle="When the review surfaces something you want to understand, the ideas behind it are here — every concept in plain English, from a real problem."
        />

        {/* A few concepts to preview the glossary */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {featured.map((term, i) => (
            <ConceptCard key={term.id} term={term} index={i} animate />
          ))}
        </div>

        {/* Two full-width entry points to the learning content */}
        <div className="grid sm:grid-cols-2 border border-text/15 mt-4">
          <Link
            href="/concepts"
            data-cursor
            className="group flex items-center justify-between gap-4 p-6 sm:p-7 border-b sm:border-b-0 sm:border-r border-text/15 hover:bg-surface transition-colors duration-300"
          >
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <Shape type="circle" color={BLUE} size={13} />
                <span className="subhead text-lg text-text">All concepts</span>
              </div>
              <span className="label-mono text-text-muted">
                {terms.length} in plain English
              </span>
            </div>
            <span className="text-text-muted text-lg font-mono transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
              &rarr;
            </span>
          </Link>
          <Link
            href="/stories"
            data-cursor
            className="group flex items-center justify-between gap-4 p-6 sm:p-7 hover:bg-surface transition-colors duration-300"
          >
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <Shape type="square" color={RED} size={13} />
                <span className="subhead text-lg text-text">Build Stories</span>
              </div>
              <span className="label-mono text-text-muted">
                {stories.length} scaling journeys
              </span>
            </div>
            <span className="text-text-muted text-lg font-mono transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
              &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* Subscribe band */}
      <section className="max-w-6xl mx-auto px-6 pb-20 sm:pb-28">
        <div className="border-t border-text/10 pt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <Shape type="triangle" color={YELLOW} size={16} />
              <h2 className="heading-editorial text-xl sm:text-2xl text-text">
                New concepts and risk patterns
              </h2>
            </div>
            <p className="text-sm text-text-muted leading-relaxed max-w-md">
              Occasionally, when there&apos;s something worth reading. No spam.
            </p>
          </div>
          <SubscribeForm />
        </div>
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
            Ready to see <span style={{ color: YELLOW }}>it?</span>
          </h2>
          <p className="subhead mt-5 max-w-md text-[15px] leading-relaxed" style={{ color: "rgba(244,241,234,0.7)" }}>
            Install the skill, run it on any repo, and get a map of your system in
            a couple of minutes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#install"
              data-cursor
              className="px-7 py-3.5 label-mono transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5"
              style={{ backgroundColor: "#F4F1EA", color: "#1A1A1A" }}
            >
              Get the skill
            </Link>
            <Link
              href="/concepts"
              data-cursor
              className="px-7 py-3.5 label-mono border transition-colors duration-500"
              style={{ borderColor: "rgba(244,241,234,0.3)", color: "#F4F1EA" }}
            >
              Browse Concepts
            </Link>
          </div>

          {/* Secondary links */}
          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-2">
            {[
              { href: "/example", label: "Example" },
              { href: "/stories", label: "Build Stories" },
              { href: "/concepts", label: "Concepts" },
              { href: "/curriculum", label: "Curriculum" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                data-cursor
                className="label-mono transition-colors duration-300"
                style={{ color: "rgba(244,241,234,0.6)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="mt-10 pt-8 flex items-center justify-between border-t" style={{ borderColor: "rgba(244,241,234,0.12)" }}>
            <span className="font-display font-bold text-xl lowercase" style={{ color: "rgba(244,241,234,0.8)", letterSpacing: "-0.06em" }}>
              {SITE_NAME.toLowerCase()}
            </span>
            <a
              href={PLUGIN_REPO_URL}
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
            &copy; 2026 {SITE_NAME}
          </p>
        </div>
      </footer>
    </div>
  );
}
