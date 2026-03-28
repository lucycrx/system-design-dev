"use client";

import { useState, useRef, useEffect } from "react";
import type { GlossaryTerm } from "@/types/story";

interface Props {
  term: GlossaryTerm;
  children: React.ReactNode;
}

export function GlossaryTooltip({ term, children }: Props) {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <span className="relative inline">
      <span
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="text-accent border-b border-dashed border-accent/40 cursor-pointer hover:border-accent/80 transition-colors"
      >
        {children}
      </span>
      {open && (
        <div
          ref={tooltipRef}
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-surface border border-border rounded-xl p-4 shadow-lg shadow-black/8"
        >
          <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">
            {term.term}
          </div>
          <p className="text-sm text-text leading-relaxed mb-2">
            {term.shortDefinition}
          </p>
          <div className="text-xs text-text-muted leading-relaxed border-t border-border pt-2">
            <span className="text-accent/70 font-medium">Analogy: </span>
            {term.analogy}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-surface border-r border-b border-border rotate-45 -mt-1" />
        </div>
      )}
    </span>
  );
}
