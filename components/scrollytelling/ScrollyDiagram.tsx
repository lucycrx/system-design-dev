"use client";

import { useState, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import type { Diagram, DiagramNode, DiagramEdge, DiagramNodeType } from "@/types/story";
import { typeColors } from "@/components/diagrams/diagramConstants";

interface Props {
  allDiagrams: Record<string, Diagram>;
  activeDiagramId: string | null;
  /** Current stage index for tooltip context */
  stageIndex: number;
}

// ── Icon renderers (SVG children for each node type) ──────────────
const ICONS: Partial<Record<DiagramNodeType, React.ReactNode>> = {
  client: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <line x1="12" y1="16" x2="12" y2="19" />
      <line x1="8" y1="19" x2="16" y2="19" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="3" width="16" height="6" rx="1.5" />
      <rect x="4" y="11" width="16" height="6" rx="1.5" />
      <circle cx="7" cy="6" r="1" fill="currentColor" />
      <circle cx="7" cy="14" r="1" fill="currentColor" />
      <line x1="11" y1="6" x2="17" y2="6" />
      <line x1="11" y1="14" x2="17" y2="14" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" />
      <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" />
    </>
  ),
  cache: (
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  ),
  queue: (
    <>
      <rect x="3" y="8" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="8" rx="1" />
      <rect x="17" y="8" width="4" height="8" rx="1" />
      <path d="M7 12h3M14 12h3" strokeDasharray="2 1" />
    </>
  ),
  "load-balancer": (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <line x1="12" y1="7.5" x2="6" y2="15.5" />
      <line x1="12" y1="7.5" x2="18" y2="15.5" />
    </>
  ),
};

// ── Constants ─────────────────────────────────────────────────────
const ICON_SIZE = 80;
const NODE_H = 110;

// Logical node widths per type (for edge routing)
const NODE_W: Partial<Record<DiagramNodeType, number>> = {
  server: 100,
  database: 100,
};
const DEFAULT_W = 90;

function nodeW(type: DiagramNodeType) {
  return NODE_W[type] ?? DEFAULT_W;
}

// ── Compute merged node set and bounding box ──────────────────────
interface MergedNode {
  id: string;
  type: DiagramNodeType;
  label: string;
  explanation: string;
  positions: Record<string, { x: number; y: number }>; // diagramId → position
}

function mergeAllNodes(diagrams: Record<string, Diagram>) {
  const map = new Map<string, MergedNode>();

  for (const [diagId, diag] of Object.entries(diagrams)) {
    for (const node of diag.nodes) {
      let merged = map.get(node.id);
      if (!merged) {
        merged = {
          id: node.id,
          type: node.type,
          label: node.label,
          explanation: node.explanation,
          positions: {},
        };
        map.set(node.id, merged);
      }
      merged.positions[diagId] = node.position;
      // Use latest explanation
      merged.explanation = node.explanation;
    }
  }

  return Array.from(map.values());
}

function computeViewBox(nodes: MergedNode[], diagrams: Record<string, Diagram>) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const node of nodes) {
    const w = nodeW(node.type);
    for (const pos of Object.values(node.positions)) {
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + w);
      maxY = Math.max(maxY, pos.y + NODE_H);
    }
  }

  const pad = 20;
  return {
    x: minX - pad,
    y: minY - pad,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
  };
}

// ── Edge path computation ─────────────────────────────────────────
// perpOffset shifts the line perpendicular to its direction (for parallel edges)
function edgePath(
  edge: DiagramEdge,
  nodeMap: Map<string, { x: number; y: number; type: DiagramNodeType }>,
  perpOffset: number = 0,
): string {
  const src = nodeMap.get(edge.source);
  const tgt = nodeMap.get(edge.target);
  if (!src || !tgt) return "M0,0 L0,0";

  const sw = nodeW(src.type);
  const tw = nodeW(tgt.type);
  const sCx = src.x + sw / 2;
  const sCy = src.y + NODE_H / 2;
  const tCx = tgt.x + tw / 2;
  const tCy = tgt.y + NODE_H / 2;

  const dx = tCx - sCx;
  const dy = tCy - sCy;

  if (Math.abs(dy) > Math.abs(dx)) {
    // Vertical: offset horizontally
    const down = dy > 0;
    return `M${sCx + perpOffset},${down ? src.y + NODE_H + 1 : src.y - 1} L${tCx + perpOffset},${down ? tgt.y - 1 : tgt.y + NODE_H + 1}`;
  }
  // Horizontal / diagonal: offset vertically
  const right = dx > 0;
  return `M${right ? src.x + sw + 1 : src.x - 1},${sCy + perpOffset} L${right ? tgt.x - 1 : tgt.x + tw + 1},${tCy + perpOffset}`;
}

// ── Tooltip ───────────────────────────────────────────────────────
interface TooltipData {
  text: string;
  x: number;
  top: number;
  bottom: number;
  nearTop: boolean;
}

function Tooltip({ tooltip }: { tooltip: TooltipData | null }) {
  if (!tooltip || typeof document === "undefined") return null;

  const style: React.CSSProperties = tooltip.nearTop
    ? { left: tooltip.x, top: tooltip.bottom + 10, transform: "translateX(-50%)" }
    : { left: tooltip.x, top: tooltip.top - 10, transform: "translate(-50%, -100%)" };

  return ReactDOM.createPortal(
    <div className="fixed z-[9999] pointer-events-none" style={style}>
      <div className="bg-text text-bg text-xs leading-relaxed px-3 py-2 w-52 relative">
        {tooltip.text}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-text rotate-45 ${
            tooltip.nearTop ? "-top-1" : "bottom-0 -mb-1"
          }`}
        />
      </div>
    </div>,
    document.body
  );
}

// ── Main component ────────────────────────────────────────────────
export function ScrollyDiagram({ allDiagrams, activeDiagramId, stageIndex }: Props) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const mergedNodes = useMemo(() => mergeAllNodes(allDiagrams), [allDiagrams]);
  const viewBox = useMemo(() => computeViewBox(mergedNodes, allDiagrams), [mergedNodes, allDiagrams]);

  // Collect all edges across all diagrams
  const allEdges = useMemo(() => {
    const edgeMap = new Map<string, { edge: DiagramEdge; diagrams: Set<string> }>();
    for (const [diagId, diag] of Object.entries(allDiagrams)) {
      for (const edge of diag.edges) {
        const existing = edgeMap.get(edge.id);
        if (existing) {
          existing.diagrams.add(diagId);
          // Update edge data to latest
          existing.edge = edge;
        } else {
          edgeMap.set(edge.id, { edge, diagrams: new Set([diagId]) });
        }
      }
    }
    return Array.from(edgeMap.values());
  }, [allDiagrams]);

  // Current diagram's node positions
  const activeDiagram = activeDiagramId ? allDiagrams[activeDiagramId] : null;

  // Build a position map for the active diagram
  const activeNodeMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number; type: DiagramNodeType }>();
    if (!activeDiagram) return map;
    for (const node of activeDiagram.nodes) {
      map.set(node.id, { x: node.position.x, y: node.position.y, type: node.type });
    }
    // For nodes not in active diagram, use their nearest known position
    for (const merged of mergedNodes) {
      if (!map.has(merged.id)) {
        const fallback = Object.values(merged.positions)[0];
        if (fallback) map.set(merged.id, { ...fallback, type: merged.type });
      }
    }
    return map;
  }, [activeDiagram, mergedNodes]);

  // Active diagram's edge set
  const activeEdgeIds = useMemo(() => {
    if (!activeDiagram) return new Set<string>();
    return new Set(activeDiagram.edges.map((e) => e.id));
  }, [activeDiagram]);

  // Active diagram's node set
  const activeNodeIds = useMemo(() => {
    if (!activeDiagram) return new Set<string>();
    return new Set(activeDiagram.nodes.map((n) => n.id));
  }, [activeDiagram]);

  const handleEnter = useCallback(
    (e: React.MouseEvent, node: MergedNode) => {
      if (!node.explanation) return;
      const rect = (e.currentTarget as SVGGElement).getBoundingClientRect();
      setTooltip({
        text: node.explanation,
        x: rect.left + rect.width / 2,
        top: rect.top,
        bottom: rect.bottom,
        nearTop: rect.top < 120,
      });
    },
    []
  );

  const handleLeave = useCallback(() => setTooltip(null), []);

  return (
    <div className="flex-1 relative">
      <svg
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className="w-full h-full overflow-visible"
      >
        <defs>
          <marker id="scrolly-arrow" markerWidth="6" markerHeight="5" refX="6" refY="2.5" orient="auto">
            <polygon points="0 0, 6 2.5, 0 5" className="fill-border" />
          </marker>
        </defs>

        {/* Edges — bidirectional pairs get parallel offset lines (like the prototype) */}
        {allEdges.map(({ edge }) => {
          const visible = activeEdgeIds.has(edge.id);
          const isDashed = edge.style === "dashed";

          // Check if there's a reverse edge (bidirectional pair)
          const hasReverse = allEdges.some(
            ({ edge: other }) =>
              other.id !== edge.id &&
              other.source === edge.target &&
              other.target === edge.source
          );
          // Offset bidirectional edges: one left/up, one right/down
          const perpOff = hasReverse
            ? (edge.source < edge.target ? -12 : 12)
            : 0;

          const d = edgePath(edge, activeNodeMap, perpOff);
          return (
            <path
              key={edge.id}
              d={d}
              className="fill-none stroke-border transition-[d,opacity] duration-500 ease-linear"
              strokeWidth="1"
              markerEnd="url(#scrolly-arrow)"
              style={{
                opacity: visible ? 1 : 0,
                strokeDasharray: isDashed ? "5 4" : undefined,
              }}
            />
          );
        })}

        {/* Nodes */}
        {mergedNodes.map((node) => {
          const pos = activeNodeMap.get(node.id);
          if (!pos) return null;
          const visible = activeNodeIds.has(node.id);
          const w = nodeW(node.type);
          const color = typeColors[node.type] || "var(--color-text-dim)";

          return (
            <g
              key={node.id}
              className="transition-[transform,opacity] duration-500 ease-linear cursor-pointer group"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                opacity: visible ? 1 : 0,
              }}
              onMouseEnter={(e) => handleEnter(e, node)}
              onMouseLeave={handleLeave}
            >
              {/* Invisible hit area */}
              <rect x={-4} y={-2} width={w + 8} height={NODE_H + 4} fill="transparent" />

              {/* Icon */}
              <svg
                x={(w - ICON_SIZE) / 2}
                y={0}
                width={ICON_SIZE}
                height={ICON_SIZE}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-opacity duration-150 group-hover:opacity-70"
                style={{ color }}
              >
                {ICONS[node.type] || <circle cx="12" cy="12" r="8" />}
              </svg>

              {/* Label */}
              <text
                x={w / 2}
                y={ICON_SIZE + 22}
                className="font-mono font-medium uppercase fill-text-dim"
                style={{ fontSize: 22, letterSpacing: "0.12em" }}
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <Tooltip tooltip={tooltip} />
    </div>
  );
}
