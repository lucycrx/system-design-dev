import type {
  ConceptSection as ConceptSectionType,
  ConceptSectionHeading,
  Diagram,
  GlossaryTerm,
} from "@/types/story";
import { Shape, type ShapeType } from "@/components/ui/Shape";
import { TextBlock } from "@/components/blocks/TextBlock";
import { CalloutBlock } from "@/components/blocks/CalloutBlock";
import { RevealBlock } from "@/components/blocks/RevealBlock";
import { CheckpointBlock } from "@/components/blocks/CheckpointBlock";
import { InteractiveDiagram } from "@/components/diagrams/InteractiveDiagram";

const RED = "#D62828";
const BLUE = "#1D4E89";
const YELLOW = "#F4C430";

const SECTION_META: Record<
  ConceptSectionHeading,
  { label: string; shape: ShapeType; color: string }
> = {
  "how-it-works": { label: "How it works", shape: "triangle", color: RED },
  "why-it-matters": { label: "Why it matters", shape: "square", color: YELLOW },
  "trade-offs": { label: "Trade-offs", shape: "half-circle", color: RED },
  "how-it-connects": { label: "How it connects", shape: "circle", color: BLUE },
  "in-practice": { label: "In practice", shape: "quarter-arc", color: BLUE },
};

interface Props {
  section: ConceptSectionType;
  glossaryMap: Record<string, GlossaryTerm>;
  diagrams: Record<string, Diagram>;
}

export function ConceptSection({ section, glossaryMap, diagrams }: Props) {
  const meta = SECTION_META[section.heading];

  return (
    <section className="border-l-2 border-l-text pl-5 py-1 mt-10">
      <div className="flex items-center gap-2 mb-4">
        <Shape type={meta.shape} color={meta.color} size={11} />
        <span className="label-mono text-text">{meta.label}</span>
      </div>
      <div className="space-y-6">
        {section.blocks.map((block, i) => {
          switch (block.type) {
            case "text":
              return (
                <TextBlock key={i} block={block} glossaryMap={glossaryMap} />
              );
            case "callout":
              return <CalloutBlock key={i} block={block} />;
            case "reveal":
              return <RevealBlock key={i} block={block} />;
            case "checkpoint":
              return <CheckpointBlock key={i} block={block} />;
            case "diagram": {
              const diagram = diagrams[block.diagramId] ?? null;
              if (!diagram) return null;
              return (
                <figure key={i} className="bg-surface border border-border p-4">
                  <InteractiveDiagram
                    diagram={diagram}
                    highlightNodes={block.highlightNodes}
                    animateFlow={block.animateFlow}
                  />
                  {block.caption && (
                    <figcaption className="mt-2 text-xs text-text-muted text-center italic">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            default:
              return null;
          }
        })}
      </div>
    </section>
  );
}
