"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Story } from "@/types/story";
import { Shape, type ShapeType } from "./Shape";
import { SubscribeForm } from "./SubscribeForm";

const RED = "#D62828";
const BLUE = "#1D4E89";
const YELLOW = "#F4C430";

const DIFFICULTY_CONFIG: Record<
  Story["difficulty"],
  { shape: ShapeType; color: string; label: string }
> = {
  beginner: { shape: "circle", color: BLUE, label: "Beginner" },
  intermediate: { shape: "square", color: YELLOW, label: "Intermediate" },
  advanced: { shape: "triangle", color: RED, label: "Advanced" },
};

function StoryCard({ story, index }: { story: Story; index: number }) {
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
      data-cursor
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative block border bg-bg"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? "translateY(-4px)"
            : "translateY(0)"
          : "translateY(28px)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionProperty: "opacity, transform, border-color",
        transitionDuration: "600ms",
        borderColor: hovered ? config.color : "rgba(26,26,26,0.10)",
      }}
    >
      <div className="p-5 sm:p-6">
        {/* Difficulty + time */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="label-mono inline-flex items-center gap-2 text-text">
            <Shape type={config.shape} color={config.color} size={11} />
            {config.label}
          </span>
          <span className="label-mono text-text-muted">~{story.estimatedMinutes} min</span>
          <span className="label-mono text-text-muted ml-auto">
            {story.stages.length} stages
          </span>
        </div>

        {/* Stage progress segments */}
        <div className="flex gap-1.5 mb-4">
          {story.stages.map((_, j) => (
            <div
              key={j}
              className="h-1 flex-1 transition-colors duration-500"
              style={{
                backgroundColor: hovered ? config.color : "rgba(26,26,26,0.12)",
                transitionDelay: hovered ? `${j * 50}ms` : "0ms",
              }}
            />
          ))}
        </div>

        {/* Title */}
        <h3
          className="subhead text-lg leading-snug mb-1 transition-colors duration-300"
          style={{ color: hovered ? config.color : "var(--color-text)" }}
        >
          {story.title}
        </h3>
        <p className="text-[0.9375rem] text-text-muted leading-snug">{story.subtitle}</p>
        <p className="text-sm text-text-muted leading-relaxed mt-3 line-clamp-2">
          {story.description}
        </p>

        {/* Concepts */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-text/10">
          {story.concepts.slice(0, 4).map((c) => (
            <span
              key={c}
              className="label-mono px-2 py-0.5 bg-bg border border-text/10 text-text-muted"
            >
              {c}
            </span>
          ))}
          {story.concepts.length > 4 && (
            <span className="label-mono text-text-muted">
              +{story.concepts.length - 4} more
            </span>
          )}
          <span
            className="ml-auto text-text-muted text-lg font-mono transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
  return (
    <>
      {/* Hero */}
      <header className="relative max-w-5xl mx-auto px-6 pt-12 pb-8 overflow-hidden">
        <Shape
          type="square"
          color={YELLOW}
          size={240}
          className="pointer-events-none absolute"
          style={{ top: "-40px", right: "-60px", opacity: 0.85 }}
        />
        <div className="relative flex items-center gap-4 mb-4 flex-wrap">
          <Shape type="triangle" color={RED} size={16} />
          <h1 className="heading-hero text-4xl sm:text-5xl text-text">Build Stories</h1>
          <span className="label-mono text-text-muted">
            {stories.length} {stories.length === 1 ? "story" : "stories"}
            <span className="mx-2 text-text/30">/</span>
            {stories.reduce((sum, s) => sum + s.stages.length, 0)} stages
          </span>
        </div>
        <p className="relative subhead text-text-muted leading-relaxed max-w-lg">
          Follow a product from first deploy to production crisis. System design
          concepts arrive when the story demands them.
        </p>
      </header>

      {/* Cards */}
      <main className="max-w-5xl mx-auto px-6 pb-20 pt-2">
        <div className="grid gap-4 sm:grid-cols-2">
          {stories.map((story, i) => (
            <StoryCard key={story.id} story={story} index={i} />
          ))}
          <div className="border border-dashed border-text/15 p-8 flex items-center justify-center">
            <p className="label-mono text-text-muted">More stories coming soon</p>
          </div>
        </div>

        {/* Subscribe */}
        <div className="mt-16 border-t border-text/10 pt-10">
          <div className="flex items-center gap-3 mb-3">
            <Shape type="circle" color={BLUE} size={14} />
            <h2 className="heading-editorial text-xl text-text">
              Get new Build Stories
            </h2>
          </div>
          <p className="text-sm text-text-muted leading-relaxed max-w-md mb-5">
            New stories, concepts, and risk patterns — occasionally, no spam.
          </p>
          <SubscribeForm />
        </div>
      </main>
    </>
  );
}
