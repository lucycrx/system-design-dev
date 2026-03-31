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

function HeroRule({ visible }: { visible: boolean }) {
  return (
    <div
      className="border-t border-border transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left"
      style={{
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        transitionDelay: "200ms",
      }}
    />
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

      <div className="relative p-5 sm:p-6">
        {/* Difficulty + time */}
        <div className="flex items-center gap-2.5 mb-4">
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
        <div className="flex gap-1.5 mb-4">
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
          className="text-lg font-bold leading-snug tracking-[-0.01em] mb-1 transition-colors duration-200"
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
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-border/60">
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
      <header className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <div
          className="flex items-baseline gap-4 flex-wrap transition-all duration-500"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
            Build Stories
          </h1>
          <span className="label-mono text-text-dim">
            {stories.length} {stories.length === 1 ? "story" : "stories"}
            <span className="mx-2 text-border">/</span>
            {stories.reduce((sum, s) => sum + s.stages.length, 0)} stages
          </span>
        </div>

        <p
          className="mt-2 text-sm text-text-muted leading-relaxed max-w-lg transition-all duration-500"
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transitionDelay: "100ms",
          }}
        >
          Follow a product from first deploy to production crisis.
          System design concepts arrive when the story demands them.
        </p>

        <div className="mt-5 overflow-hidden">
          <HeroRule visible={phase >= 2} />
        </div>
      </header>

      {/* Cards */}
      <main className="max-w-5xl mx-auto px-6 pb-16 pt-2">
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
