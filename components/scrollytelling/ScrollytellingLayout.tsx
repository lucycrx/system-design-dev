"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Block, Diagram, DiagramBlock as DiagramBlockType, GlossaryTerm } from "@/types/story";
import { InteractiveDiagramLoader } from "@/components/diagrams/InteractiveDiagramLoader";
import { TextBlock } from "@/components/blocks/TextBlock";
import { CalloutBlock } from "@/components/blocks/CalloutBlock";
import { CheckpointBlock } from "@/components/blocks/CheckpointBlock";
import { ChallengeBlock } from "@/components/blocks/ChallengeBlock";
import { RevealBlock } from "@/components/blocks/RevealBlock";

interface Props {
  blocks: Block[];
  diagrams: Record<string, Diagram>;
  glossaryMap: Record<string, GlossaryTerm>;
  stickyTop?: number;
}

export function ScrollytellingLayout({ blocks, diagrams, glossaryMap, stickyTop = 96 }: Props) {
  const [activeDiagramId, setActiveDiagramId] = useState<string | null>(null);
  const [activeHighlightNodes, setActiveHighlightNodes] = useState<string[]>([]);
  const [activeAnimateFlow, setActiveAnimateFlow] = useState<string[]>([]);
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

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8">
      {/* Left panel — scrollable narrative */}
      <div className="lg:w-[55%] space-y-8">
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
                <div className="lg:hidden bg-surface  border border-border p-6">
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
              {renderBlock(block, glossaryMap)}
            </div>
          );
        })}
      </div>

      {/* Right panel — sticky diagram (desktop only) */}
      <div className="hidden lg:block lg:w-[45%]">
        <div className="sticky" style={{ top: stickyTop }}>
          <div className="bg-surface  border border-border p-6 shadow-sm">
            <InteractiveDiagramLoader
              diagram={activeDiagram}
              highlightNodes={activeHighlightNodes}
              animateFlow={activeAnimateFlow}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function renderBlock(block: Block, glossaryMap: Record<string, GlossaryTerm>) {
  switch (block.type) {
    case "text":
      return <TextBlock block={block} glossaryMap={glossaryMap} />;
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
