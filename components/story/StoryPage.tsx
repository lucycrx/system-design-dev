"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Story, Diagram, GlossaryTerm } from "@/types/story";
import { StoryHero } from "./StoryHero";
import { StageTabs } from "./StageTabs";
import { ScrollytellingLayout } from "@/components/scrollytelling/ScrollytellingLayout";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";

interface Props {
  story: Story;
  allDiagrams: Record<string, Diagram>;
  glossaryMap: Record<string, GlossaryTerm>;
}

export function StoryPage({ story, allDiagrams, glossaryMap }: Props) {
  const searchParams = useSearchParams();
  const initialStage = searchParams.get("stage");
  const initialIndex = initialStage
    ? Math.max(0, story.stages.findIndex((s) => s.id === initialStage))
    : 0;

  const [activeStageIndex, setActiveStageIndex] = useState(initialIndex);
  const contentRef = useRef<HTMLDivElement>(null);

  const stage = story.stages[activeStageIndex];
  const hasDiagrams = stage.blocks.some((b) => b.type === "diagram");

  const stageDiagrams = useMemo(() => {
    const diagramIds = stage.blocks
      .filter((b): b is Extract<typeof b, { type: "diagram" }> => b.type === "diagram")
      .map((b) => b.diagramId);
    const result: Record<string, Diagram> = {};
    for (const id of diagramIds) {
      if (allDiagrams[id]) result[id] = allDiagrams[id];
    }
    return result;
  }, [stage.blocks, allDiagrams]);

  const handleStageSelect = useCallback(
    (index: number) => {
      setActiveStageIndex(index);
      const stageId = story.stages[index].id;
      window.history.replaceState(null, "", `?stage=${stageId}`);
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [story.stages]
  );

  return (
    <div className="min-h-screen bg-bg">
      <StoryHero story={story} />

      {/* Sticky container: journey header + stage tabs */}
      <div className="sticky top-[44px] z-30 bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="py-3 border-b border-border/50">
            <h2 className="text-sm font-semibold text-text">
              The journey of {story.title.toLowerCase()}:
            </h2>
          </div>
          <StageTabs
            stages={story.stages}
            activeIndex={activeStageIndex}
            onSelect={handleStageSelect}
          />
        </div>
      </div>

      {/* Stage content */}
      <div ref={contentRef} className="max-w-6xl mx-auto px-6 py-8">
        <div key={activeStageIndex}>
          {/* Stage header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-accent-dim text-accent border border-accent/20">
                {stage.userScale}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-text mb-3">{stage.title}</h2>
            <p className="text-text-muted leading-relaxed">
              {stage.narrative.setup}
            </p>
          </div>

          {/* Problem callout */}
          {stage.narrative.problem && (
            <div className="bg-pink-dim border-l-[3px] border-l-pink rounded-r-xl p-5 mb-8">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-pink mb-2">
                The Problem
              </div>
              <p className="text-[14px] text-text/80 leading-relaxed">
                {stage.narrative.problem}
              </p>
            </div>
          )}

          {/* Resolution teaser */}
          {stage.narrative.resolution && (
            <div className="bg-green-dim border-l-[3px] border-l-green rounded-r-xl p-5 mb-8">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-green mb-2">
                The Solution
              </div>
              <p className="text-[14px] text-text/80 leading-relaxed">
                {stage.narrative.resolution}
              </p>
            </div>
          )}

          {/* Content blocks */}
          {hasDiagrams ? (
            <ScrollytellingLayout
              blocks={stage.blocks}
              diagrams={stageDiagrams}
              glossaryMap={glossaryMap}
              stickyTop={140}
            />
          ) : (
            <BlockRenderer blocks={stage.blocks} glossaryMap={glossaryMap} />
          )}
        </div>
      </div>
    </div>
  );
}
