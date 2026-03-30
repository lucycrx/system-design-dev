"use client";

import type { Stage } from "@/types/story";

interface Props {
  stages: Stage[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function StageTabs({ stages, activeIndex, onSelect }: Props) {
  return (
    <div className="flex">
      {stages.map((stage, i) => (
        <button
          key={stage.id}
          onClick={() => onSelect(i)}
          className={`relative px-5 first:pl-0 py-3 text-[11px] font-mono tracking-[2px] uppercase whitespace-nowrap transition-colors ${
            i === activeIndex
              ? "text-text"
              : "text-text-dim hover:text-text-muted"
          }`}
        >
          Stage {i + 1}: {stage.userScale.match(/^[\d,]+ drivers/)?.[0] || stage.userScale}
          {i === activeIndex && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-text" />
          )}
        </button>
      ))}
    </div>
  );
}
