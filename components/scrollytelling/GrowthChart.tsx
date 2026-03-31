"use client";

import { useMemo } from "react";
import type { Stage } from "@/types/story";

interface Props {
  stages: Stage[];
  activeStageIndex: number;
}

// Parse "2 users" / "100 users" / "1,000 users" → number
function parseUserScale(scale: string): number {
  const num = scale.replace(/[^0-9]/g, "");
  return parseInt(num, 10) || 0;
}

function formatMax(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return String(n);
}

/**
 * Chart paths — hand-tuned exponential curves.
 * Y-axis fixed at 0–max. All paths use M C C for smooth CSS d-interpolation.
 * Chart area: x=60–410, y=12 (top) to y=102 (bottom), 90px range.
 *
 * The key insight: all 3 stages must have the SAME path command structure
 * (M + C + C) so the browser can interpolate between them smoothly.
 * Stages that don't extend to the end use collapsed/duplicate control points.
 */
interface ChartFrame {
  line: string;
  area: string;
  areaOp: number;
  proj: string;
  projOp: number;
  dot: [number, number];
  labelPos: [number, number];
  label: string;
}

function buildChartFrames(stages: Stage[]): ChartFrame[] {
  const userCounts = stages.map((s) => parseUserScale(s.userScale));
  const maxUsers = Math.max(...userCounts);
  const toY = (users: number) => Math.round(102 - (users / maxUsers) * 90);

  // Data points spread evenly on x-axis
  const xs = stages.map((_, i) =>
    stages.length <= 1 ? 60 : Math.round(60 + (i / (stages.length - 1)) * 350)
  );
  const ys = userCounts.map(toY);

  // For 3 stages: xs=[60, 235, 410], ys=[102, ~93, 12] (for 2/100/1000)
  // Build hand-tuned exponential paths per stage count

  if (stages.length === 3) {
    const [x0, x1, x2] = xs;
    const [y0, y1, y2] = ys;

    return [
      // Stage 1: flat line at baseline, just a dot
      {
        line: `M${x0},102 C${x0 + 10},102 ${x0 + 25},102 ${x0 + 40},102 C${x0 + 40},102 ${x0 + 40},102 ${x0 + 40},102`,
        area: `M${x0},102 C${x0 + 10},102 ${x0 + 25},102 ${x0 + 40},102 C${x0 + 40},102 ${x0 + 40},102 ${x0 + 40},102 L${x0 + 40},102 L${x0},102 Z`,
        areaOp: 0,
        proj: `M${x0 + 40},102 C${x0 + 40},102 ${x0 + 40},102 ${x0 + 40},102`,
        projOp: 0,
        dot: [x0 + 40, 102],
        labelPos: [x0 + 52, 98],
        label: stages[0].userScale,
      },
      // Stage 2: gentle rise to y1 — mostly flat, slight uptick (exponential is still low)
      {
        line: `M${x0},102 C${x0 + 40},102 ${x1 - 70},102 ${x1 - 15},${y1 + 2} C${x1 - 5},${y1 + 1} ${x1 - 2},${y1} ${x1},${y1}`,
        area: `M${x0},102 C${x0 + 40},102 ${x1 - 70},102 ${x1 - 15},${y1 + 2} C${x1 - 5},${y1 + 1} ${x1 - 2},${y1} ${x1},${y1} L${x1},102 L${x0},102 Z`,
        areaOp: 1,
        proj: `M${x1},${y1} C${x1 + 30},${y1 - 14} ${x2 - 60},${y2 + 36} ${x2},${y2}`,
        projOp: 1,
        dot: [x1, y1],
        labelPos: [x1 + 12, y1 - 6],
        label: stages[1].userScale,
      },
      // Stage 3: full exponential hockey stick — flat then shoots up
      {
        line: `M${x0},102 C${x0 + 40},102 ${x1 - 70},102 ${x1 - 15},${y1 + 2} C${x1 + 25},${y1 - 3} ${x2 - 50},${y2 + 8} ${x2},${y2}`,
        area: `M${x0},102 C${x0 + 40},102 ${x1 - 70},102 ${x1 - 15},${y1 + 2} C${x1 + 25},${y1 - 3} ${x2 - 50},${y2 + 8} ${x2},${y2} L${x2},102 L${x0},102 Z`,
        areaOp: 1,
        proj: `M${x2},${y2} C${x2},${y2} ${x2},${y2} ${x2},${y2}`,
        projOp: 0,
        dot: [x2, y2],
        labelPos: [x2 - 62, y2 - 4],
        label: stages[2].userScale,
      },
    ];
  }

  // Fallback for non-3-stage stories: simple linear dots
  return stages.map((stage, i) => {
    const x = xs[i];
    const y = ys[i];
    return {
      line: `M60,102 C60,102 ${x},102 ${x},${y} C${x},${y} ${x},${y} ${x},${y}`,
      area: `M60,102 C60,102 ${x},102 ${x},${y} C${x},${y} ${x},${y} ${x},${y} L${x},102 L60,102 Z`,
      areaOp: i === 0 ? 0 : 1,
      proj: `M${x},${y} C${x},${y} ${x},${y} ${x},${y}`,
      projOp: 0,
      dot: [x, y] as [number, number],
      labelPos: [x + 12, y - 4] as [number, number],
      label: stage.userScale,
    };
  });
}

export function GrowthChart({ stages, activeStageIndex }: Props) {
  const frames = useMemo(() => buildChartFrames(stages), [stages]);
  const maxUsers = Math.max(...stages.map((s) => parseUserScale(s.userScale)));
  const c = frames[activeStageIndex] || frames[0];

  return (
    <div className="h-[140px] py-3">
      <svg viewBox="0 0 440 120" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="scrolly-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid */}
        <line className="stroke-border" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" x1="48" y1="25" x2="420" y2="25" />
        <line className="stroke-border" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" x1="48" y1="50" x2="420" y2="50" />
        <line className="stroke-border" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" x1="48" y1="75" x2="420" y2="75" />

        {/* Axes */}
        <line className="stroke-border" strokeWidth="1" x1="48" y1="10" x2="48" y2="102" />
        <line className="stroke-border" strokeWidth="1" x1="48" y1="102" x2="420" y2="102" />
        <text className="font-mono text-[10px] fill-text-dim" x="42" y="106" textAnchor="end">0</text>
        <text className="font-mono text-[10px] fill-text-dim" x="42" y="16" textAnchor="end">{formatMax(maxUsers)}</text>

        {/* Area fill */}
        <path
          d={c.area}
          fill="url(#scrolly-area-grad)"
          className="transition-[d] duration-500 ease-linear"
          style={{ opacity: c.areaOp }}
        />

        {/* Projection */}
        <path
          d={c.proj}
          className="fill-none stroke-text-dim transition-[d,opacity] duration-500 ease-linear"
          strokeWidth="1"
          strokeDasharray="4 3"
          strokeLinecap="round"
          style={{ opacity: c.projOp }}
        />

        {/* Main line */}
        <path
          d={c.line}
          className="fill-none stroke-text transition-[d] duration-500 ease-linear"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Dot */}
        <circle
          r="3.5"
          cx="0"
          cy="0"
          className="fill-surface stroke-text transition-transform duration-500 ease-linear"
          strokeWidth="1.5"
          style={{ transform: `translate(${c.dot[0]}px, ${c.dot[1]}px)` }}
        />

        {/* Label */}
        <text
          x="0"
          y="0"
          className="font-mono text-[10px] tracking-wide fill-text-dim transition-transform duration-500 ease-linear"
          style={{ transform: `translate(${c.labelPos[0]}px, ${c.labelPos[1]}px)` }}
        >
          {c.label}
        </text>
      </svg>
    </div>
  );
}
