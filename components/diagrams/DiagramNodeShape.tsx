"use client";

import type { DiagramNode } from "@/types/story";

interface Props {
  node: DiagramNode;
  isHighlighted: boolean;
  isNew: boolean;
}

const NODE_WIDTH = 110;
const NODE_HEIGHT = 56;

function ClientShape() {
  return (
    <>
      {/* Monitor */}
      <rect
        x={-NODE_WIDTH / 2}
        y={-NODE_HEIGHT / 2}
        width={NODE_WIDTH}
        height={NODE_HEIGHT - 14}
        rx={6}
        className="fill-surface stroke-border"
        strokeWidth={1.5}
      />
      {/* Stand */}
      <line
        x1={0}
        y1={NODE_HEIGHT / 2 - 14}
        x2={0}
        y2={NODE_HEIGHT / 2 - 6}
        className="stroke-border"
        strokeWidth={1.5}
      />
      <line
        x1={-14}
        y1={NODE_HEIGHT / 2 - 6}
        x2={14}
        y2={NODE_HEIGHT / 2 - 6}
        className="stroke-border"
        strokeWidth={1.5}
      />
    </>
  );
}

function ServerShape() {
  return (
    <rect
      x={-NODE_WIDTH / 2}
      y={-NODE_HEIGHT / 2}
      width={NODE_WIDTH}
      height={NODE_HEIGHT}
      rx={8}
      className="fill-surface stroke-border"
      strokeWidth={1.5}
    />
  );
}

function DatabaseShape() {
  const w = NODE_WIDTH;
  const h = NODE_HEIGHT;
  const ry = 10;
  return (
    <>
      {/* Body */}
      <rect
        x={-w / 2}
        y={-h / 2 + ry}
        width={w}
        height={h - ry}
        className="fill-surface stroke-border"
        strokeWidth={1.5}
      />
      {/* Top ellipse */}
      <ellipse
        cx={0}
        cy={-h / 2 + ry}
        rx={w / 2}
        ry={ry}
        className="fill-surface stroke-border"
        strokeWidth={1.5}
      />
      {/* Bottom ellipse (just the bottom arc) */}
      <path
        d={`M ${-w / 2} ${h / 2} A ${w / 2} ${ry} 0 0 0 ${w / 2} ${h / 2}`}
        className="fill-surface stroke-border"
        strokeWidth={1.5}
      />
    </>
  );
}

function CacheShape() {
  return (
    <rect
      x={-NODE_WIDTH / 2}
      y={-NODE_HEIGHT / 2}
      width={NODE_WIDTH}
      height={NODE_HEIGHT}
      rx={8}
      className="fill-surface stroke-border"
      strokeWidth={1.5}
      strokeDasharray="6 3"
    />
  );
}

function LoadBalancerShape() {
  const s = NODE_HEIGHT / 2;
  return (
    <polygon
      points={`0,${-s} ${s},0 0,${s} ${-s},0`}
      className="fill-surface stroke-border"
      strokeWidth={1.5}
    />
  );
}

function DefaultShape() {
  return (
    <rect
      x={-NODE_WIDTH / 2}
      y={-NODE_HEIGHT / 2}
      width={NODE_WIDTH}
      height={NODE_HEIGHT}
      rx={8}
      className="fill-surface stroke-border"
      strokeWidth={1.5}
    />
  );
}

const shapeMap: Record<string, () => React.ReactElement> = {
  client: ClientShape,
  server: ServerShape,
  database: DatabaseShape,
  cache: CacheShape,
  "load-balancer": LoadBalancerShape,
  queue: DefaultShape,
  cdn: DefaultShape,
  "api-gateway": DefaultShape,
};

export function DiagramNodeShape({ node, isHighlighted, isNew }: Props) {
  const ShapeComponent = shapeMap[node.type] || DefaultShape;

  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      className={`transition-all duration-500 ease-out ${isNew ? "animate-[diagram-node-enter_500ms_ease-out_both]" : ""}`}
      style={isNew ? { animationDelay: "200ms" } : undefined}
    >
      {/* Highlight ring */}
      {isHighlighted && (
        <rect
          x={-NODE_WIDTH / 2 - 4}
          y={-NODE_HEIGHT / 2 - 4}
          width={NODE_WIDTH + 8}
          height={NODE_HEIGHT + 8}
          rx={12}
          className="fill-none stroke-accent animate-[diagram-pulse_2s_ease-in-out_infinite]"
          strokeWidth={2}
        />
      )}

      <ShapeComponent />

      {/* Label */}
      <text
        y={2}
        textAnchor="middle"
        className="fill-text text-[11px] font-sans font-medium"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {node.label}
      </text>

      {/* Type indicator */}
      <text
        y={16}
        textAnchor="middle"
        className="fill-text-dim text-[9px] font-mono"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {node.type}
      </text>
    </g>
  );
}

export { NODE_WIDTH, NODE_HEIGHT };
