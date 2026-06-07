"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CurriculumModule } from "@/types/story";
import { Shape, type ShapeType } from "./Shape";

// Bauhaus: modules are ink-dominant; each carries a rotating primary + shape
// marker (R/B/Y) cycled by module number rather than six different colors.
const MARKERS: { color: string; shape: ShapeType }[] = [
  { color: "#1D4E89", shape: "circle" },
  { color: "#D62828", shape: "square" },
  { color: "#F4C430", shape: "triangle" },
  { color: "#1D4E89", shape: "half-circle" },
  { color: "#D62828", shape: "quarter-arc" },
  { color: "#F4C430", shape: "circle" },
];

function HeroRule({ visible }: { visible: boolean }) {
  return (
    <div
      className="border-t border-text/10 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left"
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
  const marker = MARKERS[(mod.moduleNumber - 1) % MARKERS.length];

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
      className="group relative block overflow-hidden border bg-bg transition-all"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? "translateY(-3px)"
            : "translateY(0)"
          : "translateY(28px)",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDuration: "700ms",
        borderColor: hovered ? marker.color : "rgba(26,26,26,0.10)",
      }}
    >
      {/* Left accent bar — ink, grows on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-text transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: hovered ? "scaleY(1)" : "scaleY(0.4)",
          transformOrigin: "top",
        }}
      />

      <div className="relative p-5 sm:p-6 pl-6 sm:pl-7">
        <div className="flex items-start gap-5">
          {/* Module number — ink box with a primary shape marker */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div
              className="w-11 h-11 flex items-center justify-center text-lg font-bold font-mono text-bg bg-text transition-transform duration-300"
              style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
            >
              {mod.moduleNumber}
            </div>
            <Shape type={marker.shape} color={marker.color} size={12} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="label-mono text-text-muted">
                Module {mod.moduleNumber}
              </span>
              <span className="label-mono text-text-muted">
                {mod.lessons.length} lessons
              </span>
            </div>

            <h2
              className="subhead text-xl leading-snug mb-1.5 transition-colors duration-200"
              style={{ color: hovered ? marker.color : "var(--color-text)" }}
            >
              {mod.title}
            </h2>
            <p className="text-[0.9375rem] text-text-muted leading-snug">
              {mod.subtitle}
            </p>

            {/* Lesson list */}
            <div className="mt-4 pt-4 border-t border-text/10">
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                {mod.lessons.map((lesson, j) => (
                  <li
                    key={lesson.id}
                    className="flex items-baseline gap-2 label-mono text-text-muted"
                  >
                    <span className="flex-shrink-0 text-[10px] font-mono tabular-nums w-4 text-right text-text-muted opacity-60">
                      {String(j + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="transition-colors duration-200"
                      style={{ color: hovered ? "var(--color-text)" : undefined }}
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
            className="text-lg font-mono mt-3 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              color: hovered ? marker.color : "var(--color-text-muted)",
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
      <header className="relative max-w-5xl mx-auto px-6 pt-12 pb-6 overflow-hidden">
        <Shape
          type="triangle"
          color="#F4C430"
          size={240}
          className="pointer-events-none absolute"
          style={{ top: "-30px", right: "-50px", opacity: 0.85 }}
        />
        <div
          className="relative flex items-center gap-4 flex-wrap transition-all duration-500"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <Shape type="square" color="#1D4E89" size={16} />
          <h1 className="heading-hero text-4xl sm:text-5xl text-text">
            Curriculum
          </h1>
          <span className="label-mono text-text-muted">
            {modules.length} {modules.length === 1 ? "module" : "modules"}
            <span className="mx-2 text-text/30">/</span>
            {totalLessons} lessons
          </span>
        </div>

        <p
          className="relative mt-3 subhead text-text-muted leading-relaxed max-w-lg transition-all duration-500"
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transitionDelay: "100ms",
          }}
        >
          Lessons organized by topic, from fundamentals to advanced patterns.
          Start at the beginning or jump to what you need.
        </p>

        <div className="relative mt-5 overflow-hidden">
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
