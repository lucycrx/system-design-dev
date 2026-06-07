"use client";

import { useMemo, useState } from "react";
import type { GlossaryTerm, ConceptCategory } from "@/types/story";
import { CONCEPT_CATEGORIES } from "@/lib/conceptMeta";
import { Shape } from "@/components/ui/Shape";
import { ConceptCard } from "./ConceptCard";

type Filter = ConceptCategory | "all";

const RED = "#D62828";
const BLUE = "#1D4E89";

export function ConceptsGrid({ terms }: { terms: GlossaryTerm[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of terms) c[t.category] = (c[t.category] ?? 0) + 1;
    return c;
  }, [terms]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter((t) => {
      if (filter !== "all" && t.category !== filter) return false;
      if (!q) return true;
      return (
        t.term.toLowerCase().includes(q) ||
        t.shortDefinition.toLowerCase().includes(q)
      );
    });
  }, [terms, filter, query]);

  return (
    <>
      {/* Hero — asymmetric, oversized background shape */}
      <header className="relative overflow-hidden">
        <Shape
          type="circle"
          color={BLUE}
          size={320}
          className="pointer-events-none absolute"
          style={{ top: "-80px", right: "-90px", opacity: 0.9 }}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-10">
          <div className="flex items-center gap-3 mb-5">
            <Shape type="square" color={RED} size={14} />
            <p className="label-mono text-text-muted">{terms.length} concepts</p>
          </div>
          <h1 className="heading-hero text-5xl sm:text-6xl lg:text-7xl text-text max-w-3xl">
            Learn system design, one{" "}
            <span style={{ color: RED }}>concept</span> at a time.
          </h1>
          <p className="subhead text-lg text-text-muted leading-relaxed max-w-xl mt-6">
            The building blocks behind every app that scales — each in plain
            English, with a real-world analogy and the story where it first
            shows up.
          </p>
        </div>
      </header>

      {/* Controls — sticky under the fixed header */}
      <div className="sticky top-16 z-30 bg-bg/90 backdrop-blur-[8px] border-y border-text/10">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center gap-x-2 gap-y-2">
          <FilterChip
            label="All"
            count={terms.length}
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          {CONCEPT_CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.id}
              label={cat.label}
              count={counts[cat.id] ?? 0}
              active={filter === cat.id}
              shape={cat.shape}
              shapeColor={cat.color}
              onClick={() => setFilter(cat.id)}
            />
          ))}
          <div className="ml-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter concepts…"
              data-cursor
              className="w-40 sm:w-52 bg-bg border border-text/15 px-3 py-1.5 text-[13px] text-text placeholder:text-text-muted outline-none focus:border-text transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-6 py-8 pb-24">
        {visible.length === 0 ? (
          <p className="text-text-muted text-sm py-16 text-center">
            No concepts match “{query}”.
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((term, i) => (
              <ConceptCard key={term.id} term={term} index={i} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function FilterChip({
  label,
  count,
  active,
  shape,
  shapeColor,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  shape?: "circle" | "square" | "triangle" | "half-circle" | "quarter-arc";
  shapeColor?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      data-cursor
      className="label-mono px-2.5 py-1 border inline-flex items-center gap-1.5 transition-colors duration-300"
      style={{
        color: active ? "#F4F1EA" : "var(--color-text)",
        backgroundColor: active ? "#1A1A1A" : "transparent",
        borderColor: active ? "#1A1A1A" : "rgba(26,26,26,0.15)",
      }}
    >
      {shape && !active && <Shape type={shape} color={shapeColor!} size={9} />}
      {label}
      <span className="opacity-50">{count}</span>
    </button>
  );
}
