"use client";

import { useMemo, useState } from "react";
import type { GlossaryTerm, ConceptCategory } from "@/types/story";
import { CONCEPT_CATEGORIES } from "@/lib/conceptMeta";
import { ConceptCard } from "./ConceptCard";

type Filter = ConceptCategory | "all";

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
      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <p className="label-mono text-text-dim mb-4">{terms.length} concepts</p>
        <h1 className="heading-editorial text-3xl sm:text-4xl lg:text-5xl text-text max-w-2xl">
          Learn system design, one concept at a time.
        </h1>
        <p className="mt-4 text-[15px] text-text-muted leading-relaxed max-w-xl">
          The building blocks behind every app that scales — each explained in
          plain English, with a real-world analogy and the story where it first
          shows up.
        </p>
      </header>

      {/* Controls */}
      <div className="sticky top-[42px] z-30 bg-bg/90 backdrop-blur-[8px] border-y border-border">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center gap-x-2 gap-y-2">
          <FilterChip
            label="All"
            count={terms.length}
            active={filter === "all"}
            color="var(--color-text)"
            onClick={() => setFilter("all")}
          />
          {CONCEPT_CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.id}
              label={cat.label}
              count={counts[cat.id] ?? 0}
              active={filter === cat.id}
              color={cat.color}
              onClick={() => setFilter(cat.id)}
            />
          ))}
          <div className="ml-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter concepts…"
              className="w-40 sm:w-52 bg-surface border border-border px-3 py-1.5 text-[13px] text-text placeholder:text-text-dim outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-6 py-8 pb-20">
        {visible.length === 0 ? (
          <p className="text-text-dim text-sm py-16 text-center">
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
  color,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="label-mono px-2.5 py-1 border transition-colors duration-200"
      style={{
        color: active ? "var(--color-bg)" : color,
        backgroundColor: active ? color : "transparent",
        borderColor: active ? color : "var(--color-border)",
      }}
    >
      {label}
      <span className="ml-1.5 opacity-60">{count}</span>
    </button>
  );
}
