"use client";

import { memo, useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number; below: boolean } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  const updateTooltipPos = useCallback(() => {
    if (!nodeRef.current) return;
    const rect = nodeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const showBelow = rect.top < 100;
    const y = showBelow ? rect.bottom + 8 : rect.top - 8;
    setTooltipPos({ x: centerX, y, below: showBelow });
  }, []);

  useEffect(() => {
    if (showTooltip) {
      updateTooltipPos();
    } else {
      setTooltipPos(null);
    }
  }, [showTooltip, updateTooltipPos]);

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

      {/* Explanation tooltip — portalled to body to avoid ReactFlow overflow clipping */}
      {showTooltip && data.explanation && tooltipPos && createPortal(
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.below ? tooltipPos.y : undefined,
            bottom: tooltipPos.below ? undefined : `${window.innerHeight - tooltipPos.y}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="w-56 px-3 py-2 bg-text text-bg text-xs">
            {data.explanation}
            {/* Arrow pointing toward the node */}
            <div className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-text rotate-45 ${
              tooltipPos.below ? "-top-1" : "top-full -mt-1"
            }`} />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export const SystemNode = memo(SystemNodeComponent);
export { NODE_WIDTH, NODE_HEIGHT };
