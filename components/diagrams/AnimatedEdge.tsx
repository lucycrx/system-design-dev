"use client";

import { memo } from "react";
import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

interface AnimatedEdgeData {
  animated?: boolean;
  edgeStyle?: "solid" | "dashed";
  protocol?: string;
}

function AnimatedEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  data,
}: EdgeProps & { data?: AnimatedEdgeData }) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const isDashed = data?.edgeStyle === "dashed";
  const isAnimated = data?.animated;
  const protocol = data?.protocol;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: isDashed ? "var(--color-text-dim)" : "var(--color-border)",
          strokeWidth: 1.5,
          strokeDasharray: isDashed ? "6 4" : undefined,
        }}
        markerEnd="url(#arrowhead)"
      />

      {/* Animated flow dot */}
      {isAnimated && (
        <circle r={3} fill="var(--color-accent)">
          <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      {/* Label */}
      {label && (
        <foreignObject
          x={labelX - 60}
          y={labelY - 14}
          width={120}
          height={28}
          className="pointer-events-none overflow-visible"
        >
          <div className="flex items-center justify-center h-full">
            <span className="px-1.5 py-0.5 text-[11px] font-mono text-text-dim bg-bg rounded whitespace-nowrap">
              {label as string}
              {protocol && <span className="text-text-dim/50"> ({protocol})</span>}
            </span>
          </div>
        </foreignObject>
      )}
    </>
  );
}

export const AnimatedEdge = memo(AnimatedEdgeComponent);
