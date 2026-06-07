"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GlossaryTerm } from "@/types/story";
import { CATEGORY_BY_ID } from "@/lib/conceptMeta";
import { ConceptVisual } from "./ConceptVisual";

export function ConceptCard({ term, index }: { term: GlossaryTerm; index: number }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const category = CATEGORY_BY_ID[term.category];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      href={`/concepts/${term.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative block border border-border bg-bg overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionProperty: "opacity, transform, border-color",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDuration: "600ms",
        transitionDelay: `${(index % 8) * 40}ms`,
        borderColor: hovered ? category.color : undefined,
      }}
    >
      {/* Animated visual */}
      <div
        className="relative h-28 sm:h-32 border-b border-border flex items-center justify-center px-6 py-4 transition-colors duration-300"
        style={{ backgroundColor: hovered ? `${category.color}0F` : "var(--color-surface)" }}
      >
        <ConceptVisual visual={term.visual} color={category.color} playing={visible} />
      </div>

      {/* Copy */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="label-mono" style={{ color: category.color }}>
            {category.label}
          </span>
          <span
            className="text-sm font-mono text-text-dim transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              color: hovered ? category.color : undefined,
              transform: hovered ? "translateX(3px)" : "translateX(0)",
            }}
          >
            &rarr;
          </span>
        </div>
        <h3
          className="text-base font-bold leading-snug tracking-[-0.01em] mb-1.5 transition-colors duration-200"
          style={{ color: hovered ? category.color : "var(--color-text)" }}
        >
          {term.term}
        </h3>
        <p className="text-[0.8125rem] text-text-muted leading-relaxed line-clamp-3">
          {term.shortDefinition}
        </p>
      </div>
    </Link>
  );
}
