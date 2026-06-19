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
// Mirrors components/diagrams/NodeIcon.tsx so every node type is legible
// rather than falling back to a blank circle.
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
  cache: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
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
  cdn: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </>
  ),
  "api-gateway": (
    <>
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M3 8h5M3 12h5M3 16h5M16 8h5M16 12h5M16 16h5" />
    </>
  ),
  auth: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12l2 2l4-4" />
    </>
  ),
  "external-service": (
    <path d="M12 22v-5m3-9V2m2 6a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1zM9 8V2" />
  ),
  "background-job": (
    <>
      <rect width="8" height="8" x="3" y="3" rx="2" />
      <path d="M7 11v4a2 2 0 0 0 2 2h4" />
      <rect width="8" height="8" x="13" y="13" rx="2" />
    </>
  ),
  storage: (
    <path d="M10 16h.01m-7.798-4.423a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11zm19.734.436H2.054M6 16h.01" />
  ),
  agent: (
    <>
      <path d="M12 5a3 3 0 1 0-5.997.125a4 4 0 0 0-2.526 5.77a4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M9 13a4.5 4.5 0 0 0 3-4M6.003 5.125A3 3 0 0 0 6.401 6.5m-2.924 4.396a4 4 0 0 1 .585-.396M6 18a4 4 0 0 1-1.967-.516M12 13h4m-4 5h6a2 2 0 0 1 2 2v1M12 8h8m-4 0V5a2 2 0 0 1 2-2" />
      <circle cx="16" cy="13" r=".5" />
      <circle cx="18" cy="3" r=".5" />
      <circle cx="20" cy="21" r=".5" />
      <circle cx="20" cy="8" r=".5" />
    </>
  ),
};

// ── Constants ─────────────────────────────────────────────────────
const ICON_SIZE = 26;
const NODE_H = 44;
const LABEL_GAP = 11; // gap from icon bottom to first label baseline
const LABEL_LINE_H = 10; // line height for wrapped labels

// Logical node widths per type (for edge routing)
const NODE_W: Partial<Record<DiagramNodeType, number>> = {
  server: 55,
  database: 55,
};
const DEFAULT_W = 50;

// Target viewBox width — positions are normalized to fit this space.
const TARGET_VB_WIDTH = 460;
// Diagrams are authored landscape (wide). Stretch the vertical axis more than
// the horizontal one so stacked rows don't collapse into each other.
const V_STRETCH = 1.6;

// Halo that masks lines / other text behind a label so it stays readable
// even when the layout is dense. Paper-colored stroke drawn under the fill.
const HALO: React.CSSProperties = {
  paintOrder: "stroke",
  stroke: "var(--color-bg)",
  strokeWidth: 3.5,
  strokeLinejoin: "round",
};

function nodeW(type: DiagramNodeType) {
  return NODE_W[type] ?? DEFAULT_W;
}

/** Split a label into at most two balanced lines so it doesn't run wide. */
function wrapLabel(label: string): string[] {
  const words = label.split(/\s+/);
  if (words.length < 2 || label.length <= 8) return [label];

  let best: [string, string] = [words[0], words.slice(1).join(" ")];
  let bestScore = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const score = Math.abs(a.length - b.length); // most balanced split wins
    if (score < bestScore) {
      bestScore = score;
      best = [a, b];
    }
  }
  return best;
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

/**
 * Compute the scale factors to normalize diagram positions into the target
 * space. X and Y scale independently so wide layouts get extra vertical room.
 */
function computeLayout(nodes: MergedNode[]) {
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

  const rawWidth = maxX - minX;
  const rawHeight = maxY - minY;
  const pad = 30;

  const usableWidth = TARGET_VB_WIDTH - pad * 2;
  const scaleX = rawWidth > 0 ? usableWidth / rawWidth : 1;
  const scaleY = scaleX * V_STRETCH;

  return {
    scaleX,
    scaleY,
    offsetX: minX,
    offsetY: minY,
    viewBox: {
      x: 0,
      y: 0,
      width: TARGET_VB_WIDTH,
      height: rawHeight * scaleY + pad * 2,
    },
    pad,
  };
}

type Layout = ReturnType<typeof computeLayout>;

/** Transform a raw diagram position into normalized coordinates */
function normalizePos(x: number, y: number, layout: Layout) {
  return {
    x: (x - layout.offsetX) * layout.scaleX + layout.pad,
    y: (y - layout.offsetY) * layout.scaleY + layout.pad,
  };
}

// ── Edge path computation ─────────────────────────────────────────
function edgeEndpoints(
  edge: DiagramEdge,
  nodeMap: Map<string, { x: number; y: number; type: DiagramNodeType }>,
) {
  const src = nodeMap.get(edge.source);
  const tgt = nodeMap.get(edge.target);
  if (!src || !tgt) return null;

  const sw = nodeW(src.type);
  const tw = nodeW(tgt.type);
  const sCx = src.x + sw / 2;
  const sCy = src.y + NODE_H / 2;
  const tCx = tgt.x + tw / 2;
  const tCy = tgt.y + NODE_H / 2;

  const dx = tCx - sCx;
  const dy = tCy - sCy;

  let p1: { x: number; y: number };
  let p2: { x: number; y: number };
  if (Math.abs(dy) > Math.abs(dx)) {
    const down = dy > 0;
    p1 = { x: sCx, y: down ? src.y + NODE_H + 1 : src.y - 1 };
    p2 = { x: tCx, y: down ? tgt.y - 1 : tgt.y + NODE_H + 1 };
  } else {
    const right = dx > 0;
    p1 = { x: right ? src.x + sw + 1 : src.x - 1, y: sCy };
    p2 = { x: right ? tgt.x - 1 : tgt.x + tw + 1, y: tCy };
  }
  return { p1, p2 };
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
export function ScrollyDiagram({ allDiagrams, activeDiagramId }: Props) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const mergedNodes = useMemo(() => mergeAllNodes(allDiagrams), [allDiagrams]);
  const layout = useMemo(() => computeLayout(mergedNodes), [mergedNodes]);

  // Collect all edges across all diagrams
  const allEdges = useMemo(() => {
    const edgeMap = new Map<string, { edge: DiagramEdge; diagrams: Set<string> }>();
    for (const [diagId, diag] of Object.entries(allDiagrams)) {
      for (const edge of diag.edges) {
        const existing = edgeMap.get(edge.id);
        if (existing) {
          existing.diagrams.add(diagId);
          existing.edge = edge;
        } else {
          edgeMap.set(edge.id, { edge, diagrams: new Set([diagId]) });
        }
      }
    }
    return Array.from(edgeMap.values());
  }, [allDiagrams]);

  // Current diagram
  const activeDiagram = activeDiagramId ? allDiagrams[activeDiagramId] : null;

  // Per-stage label lookup so the same node id can read differently per stage
  // (e.g. "Tax App" in stage 1, "App Server" later).
  const activeLabels = useMemo(() => {
    const m = new Map<string, string>();
    activeDiagram?.nodes.forEach((n) => m.set(n.id, n.label));
    return m;
  }, [activeDiagram]);

  // Build a position map for the active diagram (normalized to target viewBox)
  const activeNodeMap = useMemo(() => {
    const map = new Map<string, { x: number; y: number; type: DiagramNodeType }>();
    if (!activeDiagram) return map;
    for (const node of activeDiagram.nodes) {
      const pos = normalizePos(node.position.x, node.position.y, layout);
      map.set(node.id, { x: pos.x, y: pos.y, type: node.type });
    }
    // For nodes not in active diagram, fall back to their first known position
    // (rendered invisible, but kept so morph transitions have a target).
    for (const merged of mergedNodes) {
      if (!map.has(merged.id)) {
        const fallback = Object.values(merged.positions)[0];
        if (fallback) {
          const pos = normalizePos(fallback.x, fallback.y, layout);
          map.set(merged.id, { x: pos.x, y: pos.y, type: merged.type });
        }
      }
    }
    return map;
  }, [activeDiagram, mergedNodes, layout]);

  const activeEdgeIds = useMemo(() => {
    if (!activeDiagram) return new Set<string>();
    return new Set(activeDiagram.edges.map((e) => e.id));
  }, [activeDiagram]);

  const activeNodeIds = useMemo(() => {
    if (!activeDiagram) return new Set<string>();
    return new Set(activeDiagram.nodes.map((n) => n.id));
  }, [activeDiagram]);

  // Which perpendicular side each edge's label sits on. Bidirectional pairs
  // (two edges between the same node pair) get pushed to opposite sides so
  // their labels never stack.
  const edgeLabelSide = useMemo(() => {
    const side = new Map<string, number>();
    const seen = new Map<string, number>();
    activeDiagram?.edges.forEach((e) => {
      const key = [e.source, e.target].sort().join("|");
      const count = seen.get(key) ?? 0;
      side.set(e.id, count % 2 === 0 ? 1 : -1);
      seen.set(key, count + 1);
    });
    return side;
  }, [activeDiagram]);

  const handleEnter = useCallback((e: React.MouseEvent, node: MergedNode) => {
    if (!node.explanation) return;
    const rect = (e.currentTarget as SVGGElement).getBoundingClientRect();
    setTooltip({
      text: node.explanation,
      x: rect.left + rect.width / 2,
      top: rect.top,
      bottom: rect.bottom,
      nearTop: rect.top < 120,
    });
  }, []);

  const handleLeave = useCallback(() => setTooltip(null), []);

  return (
    <div className="flex-1 relative min-h-0">
      <svg
        viewBox={`${layout.viewBox.x} ${layout.viewBox.y} ${layout.viewBox.width} ${layout.viewBox.height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker id="scrolly-arrow" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" className="fill-border" />
          </marker>
        </defs>

        {/* Edges */}
        {allEdges.map(({ edge }) => {
          const visible = activeEdgeIds.has(edge.id);
          const activeEdge = activeDiagram?.edges.find((e) => e.id === edge.id);
          const isDashed =
            activeEdge?.style === "dashed" || (!activeEdge && edge.style === "dashed");

          const ends = edgeEndpoints(edge, activeNodeMap);
          const d = ends ? `M${ends.p1.x},${ends.p1.y} L${ends.p2.x},${ends.p2.y}` : "M0,0 L0,0";

          // Edge label, offset perpendicular to the line so it clears the
          // line itself and (for bidirectional pairs) its counterpart.
          const activeLabel = activeEdge?.label || "";
          let labelX = 0, labelY = 0;
          if (activeLabel && ends) {
            const mx = (ends.p1.x + ends.p2.x) / 2;
            const my = (ends.p1.y + ends.p2.y) / 2;
            const ex = ends.p2.x - ends.p1.x;
            const ey = ends.p2.y - ends.p1.y;
            const len = Math.hypot(ex, ey) || 1;
            // perpendicular unit vector, biased upward for near-horizontal edges
            let px = -ey / len;
            let py = ex / len;
            if (py > 0) { px = -px; py = -py; }
            const side = edgeLabelSide.get(edge.id) ?? 1;
            const off = 9 * side;
            labelX = mx + px * off;
            labelY = my + py * off - 1;
          }

          return (
            <g key={edge.id}>
              <path
                d={d}
                className="fill-none stroke-border transition-[d,opacity] duration-500 ease-linear"
                strokeWidth="1.2"
                markerEnd="url(#scrolly-arrow)"
                style={{
                  opacity: visible ? 1 : 0,
                  strokeDasharray: isDashed ? "5 4" : undefined,
                }}
              />
              {activeLabel && (
                <text
                  className="font-mono uppercase fill-accent transition-opacity duration-500 ease-linear"
                  style={{
                    fontSize: 7.5,
                    letterSpacing: "0.04em",
                    opacity: visible ? 1 : 0,
                    ...HALO,
                  }}
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                >
                  {activeLabel}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {mergedNodes.map((node) => {
          const pos = activeNodeMap.get(node.id);
          if (!pos) return null;
          const visible = activeNodeIds.has(node.id);
          const w = nodeW(node.type);
          const color = typeColors[node.type] || "var(--color-text-dim)";
          const label = activeLabels.get(node.id) ?? node.label;
          const lines = wrapLabel(label);

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

              {/* Label (wrapped to at most two balanced lines, with a halo) */}
              <text
                x={w / 2}
                y={ICON_SIZE + LABEL_GAP}
                className="font-mono font-medium uppercase fill-text-dim"
                style={{ fontSize: 9, letterSpacing: "0.07em", ...HALO }}
                textAnchor="middle"
              >
                {lines.map((ln, i) => (
                  <tspan key={i} x={w / 2} dy={i === 0 ? 0 : LABEL_LINE_H}>
                    {ln}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>

      <Tooltip tooltip={tooltip} />
    </div>
  );
}
