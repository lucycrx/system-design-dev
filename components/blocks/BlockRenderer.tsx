import type { Block, GlossaryTerm } from "@/types/story";
import { TextBlock } from "./TextBlock";
import { CalloutBlock } from "./CalloutBlock";
import { CheckpointBlock } from "./CheckpointBlock";
import { ChallengeBlock } from "./ChallengeBlock";
import { RevealBlock } from "./RevealBlock";
import { DiagramBlock } from "./DiagramBlock";
import { TradeoffBlock } from "./TradeoffBlock";

interface Props {
  blocks: Block[];
  glossaryMap: Record<string, GlossaryTerm>;
}

export function BlockRenderer({ blocks, glossaryMap }: Props) {
  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "text":
            return <TextBlock key={i} block={block} glossaryMap={glossaryMap} />;
          case "callout":
            return <CalloutBlock key={i} block={block} />;
          case "checkpoint":
            return <CheckpointBlock key={i} block={block} />;
          case "challenge":
            return <ChallengeBlock key={i} block={block} />;
          case "reveal":
            return <RevealBlock key={i} block={block} />;
          case "diagram":
            return <DiagramBlock key={i} block={block} />;
          case "tradeoff":
            return <TradeoffBlock key={i} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
