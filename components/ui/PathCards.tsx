"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function PathCard({
  href,
  label,
  labelColor,
  title,
  description,
  meta,
  accentColor,
  accentBg,
  delay,
}: {
  href: string;
  label: string;
  labelColor: string;
  title: string;
  description: string;
  meta: string;
  accentColor: string;
  accentBg: string;
  delay: number;
}) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Link
      ref={ref}
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative block overflow-hidden border border-border transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0)"
          : "translateY(32px)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDuration: "700ms",
        borderColor: hovered ? accentColor + "50" : undefined,
      }}
    >
      {/* Color accent bar at top */}
      <div
        className="h-[3px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor: accentColor,
          transform: hovered ? "scaleX(1)" : "scaleX(0.3)",
          transformOrigin: "left",
        }}
      />

      {/* Background tint on hover */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundColor: accentBg,
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="relative p-8">
        <span className="label-mono mb-5 block" style={{ color: accentColor }}>
          {label}
        </span>
        <h2
          className="text-xl font-bold text-text tracking-[-0.01em] uppercase mb-3 transition-colors duration-200"
          style={{ color: hovered ? accentColor : undefined }}
        >
          {title}
        </h2>
        <p className="text-[0.9375rem] text-text-muted leading-relaxed mb-8">
          {description}
        </p>
        <div className="flex items-center justify-between pt-5 border-t border-border/60">
          <span className="label-mono text-text-dim">{meta}</span>
          <span
            className="text-text-dim text-lg font-mono transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              color: hovered ? accentColor : undefined,
              transform: hovered ? "translateX(6px)" : "translateX(0)",
            }}
          >
            &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PathCards({
  storyCount,
  moduleCount,
  lessonCount,
}: {
  storyCount: number;
  moduleCount: number;
  lessonCount: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PathCard
        href="/stories"
        label="Narrative"
        labelColor="var(--color-accent)"
        title="Build Stories"
        description="Follow a product from first deploy to production crisis. System design concepts arrive when the story demands them."
        meta={`${storyCount} ${storyCount === 1 ? "story" : "stories"}`}
        accentColor="var(--color-accent)"
        accentBg="var(--color-accent-dim)"
        delay={0}
      />
      <PathCard
        href="/curriculum"
        label="Structured"
        labelColor="var(--color-blue)"
        title="Curriculum"
        description="Lessons organized by topic, from fundamentals to advanced patterns. Start at the beginning or jump to what you need."
        meta={`${moduleCount} ${moduleCount === 1 ? "module" : "modules"} · ${lessonCount} lessons`}
        accentColor="var(--color-blue)"
        accentBg="var(--color-blue-dim)"
        delay={120}
      />
    </div>
  );
}
