"use client";

import type { DiagramEdge as DiagramEdgeType, DiagramNode } from "@/types/story";

interface Props {
  edge: DiagramEdgeType;
  fromNode: DiagramNode;
  toNode: DiagramNode;
  isAnimated: boolean;
}

export function DiagramEdge({ edge, fromNode, toNode, isAnimated }: Props) {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;

  // Control point offset for a slight curve
  const cx = (fromNode.x + toNode.x) / 2;
  const cy = (fromNode.y + toNode.y) / 2 - Math.abs(dx) * 0.08;

  const pathD = `M ${fromNode.x} ${fromNode.y} Q ${cx} ${cy} ${toNode.x} ${toNode.y}`;

  // Midpoint for label
  const labelX = cx;
  const labelY = cy - 10;

  const pathId = `edge-${fromNode.id}-${toNode.id}`;

  return (
    <g>
      {/* Edge path */}
      <path
        id={pathId}
        d={pathD}
        className={`fill-none ${edge.style === "dashed" ? "stroke-text-dim" : "stroke-border"} transition-all duration-500`}
        strokeWidth={1.5}
        strokeDasharray={edge.style === "dashed" ? "6 4" : "none"}
        markerEnd="url(#arrowhead)"
      />

      {/* Animated flow dot */}
      {isAnimated && (
        <circle
          r={3}
          className="fill-accent"
        >
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path={pathD}
          />
        </circle>
      )}

      {/* Label */}
      {edge.label && (
        <g transform={`translate(${labelX}, ${labelY})`}>
          <rect
            x={-edge.label.length * 3.2 - 6}
            y={-8}
            width={edge.label.length * 6.4 + 12}
            height={16}
            rx={4}
            className="fill-bg"
          />
          <text
            textAnchor="middle"
            y={4}
            className="fill-text-dim text-[9px] font-mono"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {edge.label}
          </text>
        </g>
      )}
    </g>
  );
}
