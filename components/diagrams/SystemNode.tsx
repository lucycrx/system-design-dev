"use client";

import { memo, useRef, useState, useEffect } from "react";
import { Handle, Position } from "@xyflow/react";
import type { DiagramNodeType } from "@/types/story";
import { NodeIcon } from "./NodeIcon";
import { typeColors, typeLabels } from "./diagramConstants";

interface SystemNodeData {
  label: string;
  nodeType: DiagramNodeType;
  explanation: string;
  glossaryLink?: string;
  isNew?: boolean;
  isHighlighted?: boolean;
  technology?: string;
}

const NODE_WIDTH = 180;
const NODE_HEIGHT = 76;

function SystemNodeComponent({ data }: { data: SystemNodeData }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipBelow, setTooltipBelow] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  // Check if tooltip would be clipped at the top of the ReactFlow container
  useEffect(() => {
    if (showTooltip && nodeRef.current) {
      const nodeRect = nodeRef.current.getBoundingClientRect();
      // If less than 80px above the node to the viewport top, show below
      setTooltipBelow(nodeRect.top < 80);
    }
  }, [showTooltip]);

  const isHighlighted = data.isHighlighted;
  const isNew = data.isNew;

  return (
    <div
      ref={nodeRef}
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip((prev) => !prev)}
    >
      <Handle type="target" position={Position.Left} className="!bg-border !border-border !w-1.5 !h-1.5 !-left-1" />
      <Handle type="source" position={Position.Right} className="!bg-border !border-border !w-1.5 !h-1.5 !-right-1" />
      <Handle type="target" position={Position.Top} id="top" className="!bg-border !border-border !w-1.5 !h-1.5 !-top-1" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-border !border-border !w-1.5 !h-1.5 !-bottom-1" />

      {/* Highlight ring */}
      {isHighlighted && (
        <div className="absolute -inset-1.5 border-2 border-accent animate-[diagram-pulse_2s_ease-in-out_infinite]" />
      )}

      {/* Node body */}
      <div
        className={`
          flex items-center gap-2.5 px-3 py-2.5
          bg-surface border
          transition-all duration-200 cursor-pointer
          hover:border-text/30
          ${isHighlighted ? "border-accent/50" : "border-border"}
          ${data.nodeType === "cache" ? "border-dashed" : ""}
          ${isNew ? "animate-[diagram-node-enter_500ms_ease-out_both]" : ""}
        `}
        style={{
          width: NODE_WIDTH,
          minHeight: NODE_HEIGHT,
          animationDelay: isNew ? "200ms" : undefined,
        }}
      >
        <div style={{ color: typeColors[data.nodeType] }}>
          <NodeIcon type={data.nodeType} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-text leading-tight truncate">
            {data.label}
          </span>
          <span className="text-[11px] font-mono text-text-dim leading-tight">
            {typeLabels[data.nodeType]}
          </span>
          {data.technology && (
            <span className="text-[9px] font-mono text-text-dim/60 leading-tight">
              {data.technology}
            </span>
          )}
        </div>
      </div>

      {/* Explanation tooltip */}
      {showTooltip && data.explanation && (
        <div
          className={`absolute z-50 left-1/2 -translate-x-1/2 w-56 px-3 py-2 bg-text text-bg text-xs pointer-events-none ${
            tooltipBelow ? "top-full mt-2" : "bottom-full mb-2"
          }`}
        >
          {data.explanation}
          {/* Arrow pointing toward the node */}
          <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-text rotate-45 ${
            tooltipBelow ? "-top-1" : "top-full -mt-1"
          }`} />
        </div>
      )}
    </div>
  );
}

export const SystemNode = memo(SystemNodeComponent);
export { NODE_WIDTH, NODE_HEIGHT };
