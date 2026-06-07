"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GlossaryTerm } from "@/types/story";
import { CATEGORY_BY_ID } from "@/lib/conceptMeta";
import { Shape } from "@/components/ui/Shape";
import { ConceptIcon } from "./ConceptIcon";

const INK = "#1A1A1A";

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
      data-cursor
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative block border bg-bg overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? "translateY(-4px)"
            : "translateY(0)"
          : "translateY(20px)",
        transitionProperty: "opacity, transform, border-color",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDuration: "600ms",
        transitionDelay: `${(index % 8) * 40}ms`,
        borderColor: hovered ? category.color : "rgba(26,26,26,0.10)",
      }}
    >
      {/* Static filled icon — ink mass reveals the category primary on hover */}
      <div
        className="relative h-28 sm:h-32 border-b flex items-center justify-center px-6 py-5"
        style={{ borderColor: "rgba(26,26,26,0.10)" }}
      >
        <div className="h-full w-auto aspect-square">
          <ConceptIcon
            id={term.id}
            color={hovered ? category.color : INK}
            accent={category.color}
          />
        </div>
      </div>

      {/* Copy */}
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="flex items-center gap-2">
            <Shape type={category.shape} color={category.color} size={11} />
            <span className="label-mono text-text-muted">{category.label}</span>
          </span>
          <span
            className="text-sm font-mono text-text-muted transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              color: hovered ? category.color : undefined,
              transform: hovered ? "translateX(3px)" : "translateX(0)",
            }}
          >
            &rarr;
          </span>
        </div>
        <h3 className="subhead text-base text-text mb-1.5">{term.term}</h3>
        <p className="text-[0.8125rem] text-text-muted leading-relaxed line-clamp-3">
          {term.shortDefinition}
        </p>
      </div>
    </Link>
  );
}
