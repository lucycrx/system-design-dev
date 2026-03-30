"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Story } from "@/types/story";

const DIFFICULTY_CONFIG = {
  beginner: {
    color: "var(--color-green)",
    bg: "var(--color-green-dim)",
    label: "Beginner",
  },
  intermediate: {
    color: "var(--color-orange)",
    bg: "var(--color-orange-dim)",
    label: "Intermediate",
  },
  advanced: {
    color: "var(--color-accent)",
    bg: "var(--color-accent-dim)",
    label: "Advanced",
  },
};

function HeroPattern({ visible }: { visible: boolean }) {
  // Flowing story-arc lines — represent narrative paths
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="absolute top-0 right-0 w-full h-full transition-opacity"
        style={{
          opacity: visible ? 1 : 0,
          transitionDuration: "1200ms",
          transitionDelay: "300ms",
        }}
        preserveAspectRatio="xMaxYMid slice"
        viewBox="0 0 800 300"
        fill="none"
      >
        {/* Story arc paths — sweeping curves */}
        <path
          d="M500,280 Q580,100 700,60"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeDasharray="4 8"
          opacity="0.2"
          fill="none"
        />
        <path
          d="M520,280 Q620,140 740,100"
          stroke="var(--color-blue)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          opacity="0.15"
          fill="none"
        />
        <path
          d="M540,260 Q640,180 760,150"
          stroke="var(--color-green)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          opacity="0.15"
          fill="none"
        />

        {/* Story stage nodes along the arcs */}
        {[
          { x: 580, y: 180, color: "var(--color-accent)", size: 5 },
          { x: 640, y: 120, color: "var(--color-accent)", size: 7 },
          { x: 700, y: 60, color: "var(--color-accent)", size: 9 },
          { x: 640, y: 180, color: "var(--color-blue)", size: 5 },
          { x: 700, y: 130, color: "var(--color-blue)", size: 6 },
          { x: 660, y: 210, color: "var(--color-green)", size: 5 },
          { x: 720, y: 170, color: "var(--color-green)", size: 6 },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.size + 4} fill={n.color} opacity="0.08" />
            <circle cx={n.x} cy={n.y} r={n.size} fill={n.color} opacity="0.5" />
            <circle cx={n.x} cy={n.y} r={2} fill={n.color} opacity="0.9" />
          </g>
        ))}

        {/* Subtle grid for structure */}
        {[540, 600, 660, 720, 780].map((x) => (
          <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="300" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3" />
        ))}
        {[60, 120, 180, 240].map((y) => (
          <line key={`h-${y}`} x1="480" y1={y} x2="800" y2={y} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3" />
        ))}
      </svg>

      {/* Fade gradient so SVG doesn't compete with text */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, var(--color-bg) 30%, color-mix(in srgb, var(--color-bg) 70%, transparent) 55%, transparent 75%, transparent 92%, var(--color-bg) 100%)",
        }}
      />
    </div>
  );
}

function StoryCard({
  story,
  index,
}: {
  story: Story;
  index: number;
}) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const config = DIFFICULTY_CONFIG[story.difficulty];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <Link
      ref={ref}
      href={`/stories/${story.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative block overflow-hidden border border-border bg-surface transition-all"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) scale(1)"
          : "translateY(28px) scale(0.98)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDuration: "700ms",
        borderColor: hovered ? config.color + "40" : undefined,
      }}
    >
      {/* Top accent bar — expands on hover */}
      <div
        className="h-[3px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor: config.color,
          transform: hovered ? "scaleX(1)" : "scaleX(0.2)",
          transformOrigin: "left",
        }}
      />

      {/* Hover tint */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: config.bg,
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="relative p-7">
        {/* Difficulty + time */}
        <div className="flex items-center gap-2.5 mb-5">
          <span
            className="label-mono px-2 py-0.5 text-bg"
            style={{ backgroundColor: config.color }}
          >
            {config.label}
          </span>
          <span className="label-mono text-text-dim">
            ~{story.estimatedMinutes} min
          </span>
          <span className="label-mono text-text-dim ml-auto">
            {story.stages.length} stages
          </span>
        </div>

        {/* Stage progress dots */}
        <div className="flex gap-1.5 mb-5">
          {story.stages.map((_, j) => (
            <div
              key={j}
              className="h-1 flex-1 transition-all duration-500"
              style={{
                backgroundColor: hovered ? config.color : "var(--color-border)",
                opacity: hovered ? 0.4 + (j / story.stages.length) * 0.6 : 0.5,
                transitionDelay: hovered ? `${j * 50}ms` : "0ms",
              }}
            />
          ))}
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold leading-snug tracking-[-0.01em] uppercase mb-1 transition-colors duration-200"
          style={{ color: hovered ? config.color : "var(--color-text)" }}
        >
          {story.title}
        </h3>
        <p className="text-[0.9375rem] text-text-muted leading-snug">
          {story.subtitle}
        </p>
        <p className="text-sm text-text-dim leading-relaxed mt-3 line-clamp-2">
          {story.description}
        </p>

        {/* Concepts */}
        <div className="flex flex-wrap gap-1.5 mt-6 pt-5 border-t border-border/60">
          {story.concepts.slice(0, 4).map((c) => (
            <span
              key={c}
              className="label-mono px-2 py-0.5 bg-bg border border-border text-text-dim transition-colors duration-200"
              style={{
                borderColor: hovered ? config.color + "30" : undefined,
              }}
            >
              {c}
            </span>
          ))}
          {story.concepts.length > 4 && (
            <span className="label-mono text-text-dim">
              +{story.concepts.length - 4} more
            </span>
          )}
          {/* Arrow */}
          <span
            className="ml-auto text-text-dim text-lg font-mono transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              color: hovered ? config.color : undefined,
              transform: hovered ? "translateX(4px)" : "translateX(0)",
            }}
          >
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

export function StoriesPageClient({ stories }: { stories: Story[] }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      {/* Hero */}
      <header className="relative w-full overflow-hidden bg-bg">
        <HeroPattern visible={phase >= 1} />

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-12">
          <div
            className="mb-6 transition-all duration-500"
            style={{
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? "translateY(0)" : "translateY(8px)",
            }}
          >
            <span className="label-mono text-accent">Narrative Path</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-[1.02] tracking-tight mb-6 uppercase transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "100ms",
            }}
          >
            Build Stories
          </h1>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 transition-all duration-700"
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
              transitionDelay: "100ms",
            }}
          >
            <p className="font-mono text-[13px] text-text-muted leading-relaxed max-w-md">
              Follow a product from first deploy to production crisis.
              System design concepts arrive when the story demands them.
            </p>
            <div className="flex items-center gap-6 label-mono text-text-dim">
              <span>{stories.length} {stories.length === 1 ? "story" : "stories"}</span>
              <span className="w-px h-3 bg-border" />
              <span>{stories.reduce((sum, s) => sum + s.stages.length, 0)} total stages</span>
            </div>
          </div>

          {/* Animated divider */}
          <div className="mt-10 overflow-hidden">
            <div
              className="border-t border-border transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left"
              style={{
                transform: phase >= 2 ? "scaleX(1)" : "scaleX(0)",
                transitionDelay: "300ms",
              }}
            />
          </div>
        </div>
      </header>

      {/* Cards */}
      <main className="max-w-5xl mx-auto px-6 pb-24 pt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {stories.map((story, i) => (
            <StoryCard key={story.id} story={story} index={i} />
          ))}

          {/* Coming soon */}
          <div
            className="border border-dashed border-text-dim/20 p-8 flex items-center justify-center transition-all duration-700"
            style={{
              opacity: phase >= 2 ? 0.6 : 0,
              transitionDelay: `${stories.length * 100 + 200}ms`,
            }}
          >
            <p className="label-mono text-text-dim">More stories coming soon</p>
          </div>
        </div>
      </main>
    </>
  );
}
