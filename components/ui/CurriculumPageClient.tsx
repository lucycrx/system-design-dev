"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CurriculumModule } from "@/types/story";

const COLOR_MAP: Record<string, { color: string; bg: string }> = {
  accent: { color: "var(--color-accent)", bg: "var(--color-accent-dim)" },
  blue: { color: "var(--color-blue)", bg: "var(--color-blue-dim)" },
  green: { color: "var(--color-green)", bg: "var(--color-green-dim)" },
  orange: { color: "var(--color-orange)", bg: "var(--color-orange-dim)" },
  pink: { color: "var(--color-pink)", bg: "var(--color-pink-dim)" },
  purple: { color: "var(--color-purple)", bg: "var(--color-purple-dim)" },
};

function HeroPattern({ visible }: { visible: boolean }) {
  // Structured curriculum grid — represents organized learning
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
        {/* Background grid */}
        {[520, 580, 640, 700, 760].map((x) => (
          <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="300" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3" />
        ))}
        {[50, 100, 150, 200, 250].map((y) => (
          <line key={`h-${y}`} x1="480" y1={y} x2="800" y2={y} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3" />
        ))}

        {/* Stacked module blocks — representing curriculum structure */}
        {[
          { x: 560, y: 50, w: 80, h: 40, color: "var(--color-accent)" },
          { x: 560, y: 100, w: 120, h: 40, color: "var(--color-blue)" },
          { x: 560, y: 150, w: 100, h: 40, color: "var(--color-green)" },
          { x: 560, y: 200, w: 140, h: 40, color: "var(--color-orange)" },
        ].map((block, i) => (
          <g key={i}>
            <rect
              x={block.x}
              y={block.y}
              width={block.w}
              height={block.h}
              fill={block.color}
              opacity="0.06"
              stroke={block.color}
              strokeWidth="1"
              strokeOpacity="0.15"
            />
            {/* Inner "lesson" lines */}
            {[0.3, 0.5, 0.7].map((frac, j) => (
              <line
                key={j}
                x1={block.x + 8}
                y1={block.y + block.h * frac}
                x2={block.x + block.w * 0.6}
                y2={block.y + block.h * frac}
                stroke={block.color}
                strokeWidth="1"
                opacity="0.2"
              />
            ))}
          </g>
        ))}

        {/* Connecting line through modules */}
        <path
          d="M545,70 L545,220"
          stroke="var(--color-text)"
          strokeWidth="1"
          strokeDasharray="2 6"
          opacity="0.15"
        />
        {/* Progress nodes */}
        {[70, 120, 170, 220].map((y, i) => (
          <g key={i}>
            <circle cx={545} cy={y} r={4} fill="none" stroke="var(--color-text)" strokeWidth="1" opacity="0.2" />
            <circle cx={545} cy={y} r={2} fill="var(--color-text)" opacity="0.3" />
          </g>
        ))}
      </svg>

      {/* Fade gradient */}
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

function ModuleCard({
  mod,
  index,
}: {
  mod: CurriculumModule;
  index: number;
}) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const colors = COLOR_MAP[mod.color] || COLOR_MAP.accent;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 120);
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
      href={`/curriculum/${mod.slug}`}
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
        borderColor: hovered ? colors.color + "40" : undefined,
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          backgroundColor: colors.color,
          opacity: hovered ? 1 : 0.3,
          transform: hovered ? "scaleY(1)" : "scaleY(0.4)",
          transformOrigin: "top",
        }}
      />

      {/* Hover tint */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundColor: colors.bg,
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="relative p-7 pl-8">
        <div className="flex items-start gap-5">
          {/* Module number */}
          <div
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-lg font-bold font-mono text-bg transition-transform duration-300"
            style={{
              backgroundColor: colors.color,
              transform: hovered ? "scale(1.08)" : "scale(1)",
            }}
          >
            {mod.moduleNumber}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span
                className="label-mono font-medium"
                style={{ color: colors.color }}
              >
                Module {mod.moduleNumber}
              </span>
              <span className="label-mono text-text-dim">
                {mod.lessons.length} lessons
              </span>
            </div>

            <h2
              className="text-xl font-bold leading-snug tracking-[-0.01em] uppercase mb-1.5 transition-colors duration-200"
              style={{ color: hovered ? colors.color : "var(--color-text)" }}
            >
              {mod.title}
            </h2>
            <p className="text-[0.9375rem] text-text-muted leading-snug">
              {mod.subtitle}
            </p>

            {/* Lesson progress bar */}
            <div className="flex gap-1 mt-4 mb-3">
              {mod.lessons.map((_, j) => (
                <div
                  key={j}
                  className="h-1 flex-1 transition-all duration-500"
                  style={{
                    backgroundColor: hovered ? colors.color : "var(--color-border)",
                    opacity: hovered ? 0.3 + (j / mod.lessons.length) * 0.7 : 0.4,
                    transitionDelay: hovered ? `${j * 60}ms` : "0ms",
                  }}
                />
              ))}
            </div>

            {/* Lesson tags */}
            <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/50">
              {mod.lessons.slice(0, 3).map((lesson) => (
                <span
                  key={lesson.id}
                  className="label-mono px-2 py-0.5 bg-bg border border-border text-text-dim transition-colors duration-200"
                  style={{
                    borderColor: hovered ? colors.color + "30" : undefined,
                  }}
                >
                  {lesson.title.length > 30
                    ? lesson.title.slice(0, 30) + "..."
                    : lesson.title}
                </span>
              ))}
              {mod.lessons.length > 3 && (
                <span className="label-mono text-text-dim">
                  +{mod.lessons.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <span
            className="text-lg font-mono mt-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              color: hovered ? colors.color : "var(--color-text-dim)",
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

const FUTURE_MODULES = [
  { num: 3, title: "Architecture Patterns", color: "var(--color-green)" },
  { num: 4, title: "Making It Real (Deployment)", color: "var(--color-orange)" },
  { num: 5, title: "Level Up", color: "var(--color-pink)" },
  { num: 6, title: "AI-Specific Concepts", color: "var(--color-purple)" },
];

export function CurriculumPageClient({ modules }: { modules: CurriculumModule[] }) {
  const [phase, setPhase] = useState(0);
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

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
            <span className="label-mono text-blue">Structured Path</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-[1.02] tracking-tight mb-6 uppercase transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: phase >= 1 ? 1 : 0,
              transform: phase >= 1 ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "100ms",
            }}
          >
            Curriculum
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
              Lessons organized by topic, from fundamentals to advanced patterns.
              Start at the beginning or jump to what you need.
            </p>
            <div className="flex items-center gap-6 label-mono text-text-dim">
              <span>{modules.length} {modules.length === 1 ? "module" : "modules"}</span>
              <span className="w-px h-3 bg-border" />
              <span>{totalLessons} lessons</span>
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

      {/* Module cards */}
      <main className="max-w-5xl mx-auto px-6 pb-24 pt-4">
        <div className="space-y-4">
          {modules.map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} index={i} />
          ))}
        </div>

        {/* Future modules — with colored accents */}
        <div className="mt-6 space-y-3">
          {FUTURE_MODULES.map((mod, i) => (
            <div
              key={mod.num}
              className="relative bg-surface/50 border border-dashed border-border p-7 flex items-center gap-5 overflow-hidden transition-all duration-700"
              style={{
                opacity: phase >= 2 ? 0.35 : 0,
                transitionDelay: `${(modules.length + i) * 120 + 300}ms`,
              }}
            >
              {/* Subtle left accent */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px]"
                style={{ backgroundColor: mod.color, opacity: 0.25 }}
              />
              <div
                className="w-10 h-10 flex items-center justify-center text-lg font-mono border border-border text-text-dim"
              >
                {mod.num}
              </div>
              <div>
                <span className="label-mono text-text-dim">
                  Module {mod.num}
                </span>
                <h3 className="text-lg font-bold text-text-muted tracking-[-0.01em] uppercase">
                  {mod.title}
                </h3>
                <p className="label-mono text-text-dim mt-1">Coming soon</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
