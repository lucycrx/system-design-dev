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

      <div className="relative p-5 sm:p-6 pl-6 sm:pl-7">
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
              className="text-xl font-bold leading-snug tracking-[-0.01em] mb-1.5 transition-colors duration-200"
              style={{ color: hovered ? colors.color : "var(--color-text)" }}
            >
              {mod.title}
            </h2>
            <p className="text-[0.9375rem] text-text-muted leading-snug">
              {mod.subtitle}
            </p>

            {/* Lesson list */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {mod.lessons.map((lesson, j) => (
                  <li
                    key={lesson.id}
                    className="flex items-baseline gap-2 label-mono text-text-muted transition-colors duration-200"
                  >
                    <span
                      className="flex-shrink-0 text-[10px] font-mono tabular-nums w-4 text-right transition-colors duration-200"
                      style={{
                        color: hovered ? colors.color : "var(--color-text-dim)",
                        opacity: hovered ? 0.7 : 0.5,
                      }}
                    >
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="transition-colors duration-200"
                      style={{
                        color: hovered ? "var(--color-text)" : undefined,
                      }}
                    >
                      {lesson.topicLabel || lesson.title}
                    </span>
                  </li>
                ))}
              </ol>
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
      <header className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <div
          className="flex items-baseline gap-4 flex-wrap transition-all duration-500"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
            Curriculum
          </h1>
          <span className="label-mono text-text-dim">
            {modules.length} {modules.length === 1 ? "module" : "modules"}
            <span className="mx-2 text-border">/</span>
            {totalLessons} lessons
          </span>
        </div>

        <p
          className="mt-2 text-sm text-text-muted leading-relaxed max-w-lg transition-all duration-500"
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transitionDelay: "100ms",
          }}
        >
          Lessons organized by topic, from fundamentals to advanced patterns.
          Start at the beginning or jump to what you need.
        </p>

        <div className="mt-5 overflow-hidden">
          <HeroRule visible={phase >= 2} />
        </div>
      </header>

      {/* Module cards */}
      <main className="max-w-5xl mx-auto px-6 pb-16 pt-2">
        <div className="space-y-4">
          {modules.map((mod, i) => (
            <ModuleCard key={mod.id} mod={mod} index={i} />
          ))}
        </div>

      </main>
    </>
  );
}
