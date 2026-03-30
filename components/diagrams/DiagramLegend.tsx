import type { DiagramNodeType } from "@/types/story";
import { NodeIcon } from "./NodeIcon";
import { typeColors, typeLabels } from "./diagramConstants";

interface Props {
  nodeTypes: DiagramNodeType[];
  hasDashedEdges?: boolean;
}

export function DiagramLegend({ nodeTypes, hasDashedEdges }: Props) {
  if (nodeTypes.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 pt-2 border-t border-border/50">
      {nodeTypes.map((type) => (
        <div key={type} className="flex items-center gap-1.5">
          <div style={{ color: typeColors[type] }}>
            <NodeIcon type={type} className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-mono text-text-dim">
            {typeLabels[type]}
          </span>
        </div>
      ))}
      {hasDashedEdges && (
        <>
          <div className="w-px h-3 bg-border/50" />
          <div className="flex items-center gap-1.5">
            <svg width="20" height="8" className="flex-shrink-0">
              <line x1="0" y1="4" x2="20" y2="4" stroke="var(--color-text-dim)" strokeWidth="1.5" strokeDasharray="4 3" />
            </svg>
            <span className="text-[10px] font-mono text-text-dim">read / indirect</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="20" height="8" className="flex-shrink-0">
              <line x1="0" y1="4" x2="20" y2="4" stroke="var(--color-border)" strokeWidth="1.5" />
              <polygon points="15,1 20,4 15,7" fill="var(--color-border)" />
            </svg>
            <span className="text-[10px] font-mono text-text-dim">request / write</span>
          </div>
        </>
      )}
    </div>
  );
}
