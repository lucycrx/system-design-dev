"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Block, Diagram, DiagramBlock as DiagramBlockType, GlossaryTerm, Stage } from "@/types/story";
import { InteractiveDiagramLoader } from "@/components/diagrams/InteractiveDiagramLoader";
import { TextBlock } from "@/components/blocks/TextBlock";
import { CalloutBlock } from "@/components/blocks/CalloutBlock";
import { CheckpointBlock } from "@/components/blocks/CheckpointBlock";
import { ChallengeBlock } from "@/components/blocks/ChallengeBlock";
import { RevealBlock } from "@/components/blocks/RevealBlock";
import { FlipCounter } from "./FlipCounter";
import { GrowthChart } from "./GrowthChart";
import { ScrollyDiagram } from "./ScrollyDiagram";

interface Props {
  blocks: Block[];
  diagrams: Record<string, Diagram>;
  glossaryMap: Record<string, GlossaryTerm>;
  stickyTop?: number;
  layout?: "inline" | "scrollytelling";
}

/** Cross-stage scrollytelling: all stages share one sticky panel */
interface CrossStageProps {
  stages: Stage[];
  allDiagrams: Record<string, Diagram>;
  glossaryMap: Record<string, GlossaryTerm>;
  stickyTop?: number;
}

export function CrossStageScrollytelling({
  stages,
  allDiagrams,
  glossaryMap,
  stickyTop = 96,
}: CrossStageProps) {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [activeDiagramId, setActiveDiagramId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const stageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Set initial diagram
  useEffect(() => {
    const firstDiag = stages[0]?.blocks.find(
      (b): b is DiagramBlockType => b.type === "diagram"
    );
    if (firstDiag) setActiveDiagramId(firstDiag.diagramId);
  }, [stages]);

  // IntersectionObserver to track which stage section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-scrolly-stage"));
            if (!isNaN(idx)) {
              setActiveStageIndex(idx);
              // Find the diagram for this stage
              const diagBlock = stages[idx]?.blocks.find(
                (b): b is DiagramBlockType => b.type === "diagram"
              );
              if (diagBlock) setActiveDiagramId(diagBlock.diagramId);
            }
          }
        }
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold: 0.1,
      }
    );

    stageRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [stages]);

  const registerRef = useCallback((idx: number, el: HTMLDivElement | null) => {
    if (el) stageRefs.current.set(idx, el);
    else stageRefs.current.delete(idx);
  }, []);

  // Parse stage number and user scale for flip counter
  const activeStage = stages[activeStageIndex];
  const stageNum = String(activeStageIndex + 1);
  const userScale = activeStage?.userScale || "";

  return (
    <div className="flex flex-col lg:flex-row lg:gap-12">
      {/* Left panel — scrollable narrative (all stages) */}
      <div className="lg:w-[60%] space-y-0">
        {stages.map((stage, stageIdx) => (
          <div
            key={stage.id}
            ref={(el) => registerRef(stageIdx, el)}
            data-scrolly-stage={stageIdx}
            className="py-8 first:pt-0"
          >
            {stageIdx > 0 && <div className="border-t border-border mb-8" />}
            <div className="space-y-6">
              {stage.blocks.map((block, blockIdx) => {
                if (block.type === "diagram") {
                  // Diagram trigger marker (desktop: hidden, mobile: show inline)
                  const diagramBlock = block as DiagramBlockType;
                  const diagram = allDiagrams[diagramBlock.diagramId];
                  return (
                    <div key={blockIdx}>
                      {/* Mobile inline fallback */}
                      <div className="lg:hidden bg-surface border border-border p-6">
                        {diagram ? (
                          <InteractiveDiagramLoader
                            diagram={diagram}
                            highlightNodes={diagramBlock.highlightNodes}
                            animateFlow={diagramBlock.animateFlow}
                          />
                        ) : (
                          <div className="h-48 flex items-center justify-center">
                            <p className="text-sm text-text-dim">Diagram: {diagramBlock.diagramId}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={blockIdx}>
                    {renderBlock(block, glossaryMap, selectedNodeId)}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Right panel — sticky diagram (desktop only) */}
      <div className="hidden lg:block lg:w-[40%]">
        <div className="sticky flex flex-col" style={{ top: stickyTop, height: `calc(100vh - ${stickyTop + 48}px)` }}>
          {/* Stage header with flip counter */}
          <div className="flex items-center gap-2 pb-3">
            <span className="label-mono text-text-dim">Stage</span>
            <FlipCounter value={stageNum} />
            <span className="label-mono text-text-dim" style={{ marginLeft: -2 }}>:</span>
            <FlipCounter value={userScale.replace(/\s*users?\s*/i, "").trim()} />
            <span className="label-mono text-text-dim">Users</span>
          </div>

          {/* Growth chart */}
          <GrowthChart stages={stages} activeStageIndex={activeStageIndex} />

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Architecture header */}
          <div className="flex items-center gap-2 pt-3 pb-1">
            <span className="label-mono text-text-dim">System Architecture</span>
          </div>

          {/* Diagram */}
          <ScrollyDiagram
            allDiagrams={allDiagrams}
            activeDiagramId={activeDiagramId}
            stageIndex={activeStageIndex}
          />
        </div>
      </div>
    </div>
  );
}

/** Original per-stage layout (unchanged) */
export function ScrollytellingLayout({ blocks, diagrams, glossaryMap, stickyTop = 96, layout = "scrollytelling" }: Props) {
  const [activeDiagramId, setActiveDiagramId] = useState<string | null>(null);
  const [activeHighlightNodes, setActiveHighlightNodes] = useState<string[]>([]);
  const [activeAnimateFlow, setActiveAnimateFlow] = useState<string[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const diagramRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Set initial diagram to the first one found
  useEffect(() => {
    const firstDiagram = blocks.find((b): b is DiagramBlockType => b.type === "diagram");
    if (firstDiagram) {
      setActiveDiagramId(firstDiagram.diagramId);
      setActiveHighlightNodes(firstDiagram.highlightNodes || []);
      setActiveAnimateFlow(firstDiagram.animateFlow || []);
    }
  }, [blocks]);

  const registerRef = useCallback((diagramId: string, el: HTMLDivElement | null) => {
    if (el) {
      diagramRefs.current.set(diagramId, el);
    } else {
      diagramRefs.current.delete(diagramId);
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const diagramId = entry.target.getAttribute("data-diagram-id");
            if (diagramId) {
              setActiveDiagramId(diagramId);
              // Find the block to get highlight/animate data
              const block = blocks.find(
                (b): b is DiagramBlockType => b.type === "diagram" && b.diagramId === diagramId
              );
              if (block) {
                setActiveHighlightNodes(block.highlightNodes || []);
                setActiveAnimateFlow(block.animateFlow || []);
              }
            }
          }
        }
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.1,
      }
    );

    // Observe all registered diagram trigger elements
    diagramRefs.current.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [blocks]);

  const activeDiagram = activeDiagramId ? diagrams[activeDiagramId] || null : null;

  // Inline layout: single column, diagrams break out wider than prose
  if (layout === "inline") {
    return (
      <div className="flex flex-col gap-10">
        {blocks.map((block, i) => {
          if (block.type === "diagram") {
            const diagramBlock = block as DiagramBlockType;
            const diagram = diagrams[diagramBlock.diagramId];
            return (
              <div key={i} className="max-w-5xl bg-surface border border-border p-6 sm:p-8">
                {diagram ? (
                  <InteractiveDiagramLoader
                    diagram={diagram}
                    highlightNodes={diagramBlock.highlightNodes}
                    animateFlow={diagramBlock.animateFlow}
                    onNodeClick={setSelectedNodeId}
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center">
                    <p className="text-sm text-text-dim">Diagram: {diagramBlock.diagramId}</p>
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={i} className="max-w-3xl">
              {renderBlock(block, glossaryMap, selectedNodeId)}
            </div>
          );
        })}
      </div>
    );
  }

  // Scrollytelling layout: two-panel with sticky diagram
  return (
    <div className="flex flex-col lg:flex-row lg:gap-8">
      {/* Left panel — scrollable narrative */}
      <div className="lg:w-[50%] space-y-8">
        {blocks.map((block, i) => {
          if (block.type === "diagram") {
            const diagramBlock = block as DiagramBlockType;
            const diagram = diagrams[diagramBlock.diagramId];
            return (
              <div key={i}>
                {/* Scroll trigger for desktop */}
                <div
                  ref={(el) => registerRef(diagramBlock.diagramId, el)}
                  data-diagram-id={diagramBlock.diagramId}
                  className="hidden lg:block py-4 border-l-2 border-accent/30 pl-4"
                >
                  {diagramBlock.caption && (
                    <p className="text-xs text-accent font-medium">
                      {diagramBlock.caption}
                    </p>
                  )}
                  <p className="text-[10px] text-text-dim font-mono mt-1">
                    See diagram &rarr;
                  </p>
                </div>
                {/* Inline diagram for mobile */}
                <div className="lg:hidden bg-surface border border-border p-6">
                  {diagram ? (
                    <>
                      <InteractiveDiagramLoader
                        diagram={diagram}
                        highlightNodes={diagramBlock.highlightNodes}
                        animateFlow={diagramBlock.animateFlow}
                      />
                      {diagramBlock.caption && (
                        <p className="text-xs text-text-muted text-center italic mt-2">
                          {diagramBlock.caption}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="h-48 flex items-center justify-center">
                      <p className="text-sm text-text-dim">Diagram: {diagramBlock.diagramId}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={i}>
              {renderBlock(block, glossaryMap, selectedNodeId)}
            </div>
          );
        })}
      </div>

      {/* Right panel — sticky diagram (desktop only) */}
      <div className="hidden lg:block lg:w-[50%]">
        <div className="sticky" style={{ top: stickyTop }}>
          <div className="bg-surface border border-border p-6">
            <InteractiveDiagramLoader
              diagram={activeDiagram}
              highlightNodes={activeHighlightNodes}
              animateFlow={activeAnimateFlow}
              onNodeClick={setSelectedNodeId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function renderBlock(block: Block, glossaryMap: Record<string, GlossaryTerm>, selectedNodeId: string | null) {
  switch (block.type) {
    case "text":
      return <TextBlock block={block} glossaryMap={glossaryMap} selectedNodeId={selectedNodeId} />;
    case "callout":
      return <CalloutBlock block={block} />;
    case "checkpoint":
      return <CheckpointBlock block={block} />;
    case "challenge":
      return <ChallengeBlock block={block} />;
    case "reveal":
      return <RevealBlock block={block} />;
    default:
      return null;
  }
}
