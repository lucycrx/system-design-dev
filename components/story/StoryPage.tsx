"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
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

/** Height of site nav + stage tabs (approx) */
const STICKY_HEADER_HEIGHT = 100;

export function StoryPage({ story, allDiagrams, glossaryMap }: Props) {
  const searchParams = useSearchParams();
  const initialStage = searchParams.get("stage");
  const initialIndex = initialStage
    ? Math.max(0, story.stages.findIndex((s) => s.id === initialStage))
    : 0;

  const [activeStageIndex, setActiveStageIndex] = useState(initialIndex);
  const stageRefs = useRef<Map<number, HTMLElement>>(new Map());
  const isScrollingToStage = useRef(false);

  // Compute diagrams for each stage once
  const allStageDiagrams = useMemo(() => {
    return story.stages.map((stage) => {
      const diagramIds = stage.blocks
        .filter((b): b is Extract<typeof b, { type: "diagram" }> => b.type === "diagram")
        .map((b) => b.diagramId);
      const result: Record<string, Diagram> = {};
      for (const id of diagramIds) {
        if (allDiagrams[id]) result[id] = allDiagrams[id];
      }
      return result;
    });
  }, [story.stages, allDiagrams]);

  // Track which stage is in view via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingToStage.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-stage-index"));
            if (!isNaN(index)) {
              setActiveStageIndex(index);
            }
          }
        }
      },
      {
        rootMargin: `-${STICKY_HEADER_HEIGHT}px 0px -50% 0px`,
        threshold: 0.01,
      }
    );

    stageRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [story.stages]);

  // Scroll to a specific stage on initial load if ?stage= param is set
  useEffect(() => {
    if (initialIndex > 0) {
      const el = stageRefs.current.get(initialIndex);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
    // Only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStageSelect = useCallback(
    (index: number) => {
      setActiveStageIndex(index);
      const el = stageRefs.current.get(index);
      if (el) {
        isScrollingToStage.current = true;
        const top = el.getBoundingClientRect().top + window.scrollY - STICKY_HEADER_HEIGHT;
        window.scrollTo({ top, behavior: "smooth" });
        // Re-enable observer after scroll settles
        setTimeout(() => {
          isScrollingToStage.current = false;
        }, 800);
      }
    },
    []
  );

  const registerStageRef = useCallback((index: number, el: HTMLElement | null) => {
    if (el) {
      stageRefs.current.set(index, el);
    } else {
      stageRefs.current.delete(index);
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg">
      <StoryHero story={story} />

      {/* Sticky stage tabs */}
      <div className="sticky top-[44px] z-30 bg-bg/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6">
          <StageTabs
            stages={story.stages}
            activeIndex={activeStageIndex}
            onSelect={handleStageSelect}
          />
        </div>
      </div>

      {/* All stages rendered vertically */}
      <div className="max-w-6xl mx-auto px-6">
        {story.stages.map((stage, i) => {
          const hasDiagrams = stage.blocks.some((b) => b.type === "diagram");
          return (
            <section
              key={stage.id}
              ref={(el) => registerStageRef(i, el)}
              data-stage-index={i}
              className="py-12 first:pt-8"
            >
              {/* Stage divider (not on first stage) */}
              {i > 0 && (
                <div className="border-t border-border mb-12" />
              )}

              {/* Stage header + narrative callouts */}
              <div className="max-w-3xl">
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="label-mono px-2.5 py-1 bg-accent-dim text-accent border border-accent/20">
                      {stage.userScale}
                    </span>
                  </div>
                  <h2 className="heading-editorial text-3xl text-text mb-3">{stage.title}</h2>
                  <p className="text-text-muted leading-relaxed">
                    {stage.narrative.setup}
                  </p>
                </div>

                {/* Problem callout */}
                {stage.narrative.problem && (
                  <div className="bg-pink-dim border-l-[3px] border-l-pink p-5 mb-8">
                    <div className="label-mono text-pink mb-2">
                      The Problem
                    </div>
                    <p className="text-[14px] text-text/80 leading-relaxed">
                      {stage.narrative.problem}
                    </p>
                  </div>
                )}

                {/* Resolution teaser */}
                {stage.narrative.resolution && (
                  <div className="bg-green-dim border-l-[3px] border-l-green p-5 mb-8">
                    <div className="label-mono text-green mb-2">
                      The Solution
                    </div>
                    <p className="text-[14px] text-text/80 leading-relaxed">
                      {stage.narrative.resolution}
                    </p>
                  </div>
                )}
              </div>

              {/* Content blocks */}
              {hasDiagrams ? (
                <ScrollytellingLayout
                  blocks={stage.blocks}
                  diagrams={allStageDiagrams[i]}
                  glossaryMap={glossaryMap}
                  stickyTop={STICKY_HEADER_HEIGHT}
                  layout={story.layout || "scrollytelling"}
                />
              ) : (
                <div className="max-w-3xl">
                  <BlockRenderer blocks={stage.blocks} glossaryMap={glossaryMap} />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
