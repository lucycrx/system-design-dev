"use client";

import type { Stage } from "@/types/story";

interface Props {
  stages: Stage[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function StageTabs({ stages, activeIndex, onSelect }: Props) {
  return (
    <div className="flex overflow-x-auto">
      {stages.map((stage, i) => (
        <button
          key={stage.id}
          onClick={() => onSelect(i)}
          className={`relative flex-shrink-0 px-6 py-3 text-[11px] font-mono tracking-[2px] uppercase transition-colors ${
            i === activeIndex
              ? "text-text"
              : "text-text-dim hover:text-text-muted"
          }`}
        >
          Stage {i + 1}: {stage.userScale}
          {i === activeIndex && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-text" />
          )}
        </button>
      ))}
    </div>
  );
}
