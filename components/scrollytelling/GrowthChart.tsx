"use client";

import { useMemo } from "react";
import type { Stage } from "@/types/story";

interface Props {
  stages: Stage[];
  activeStageIndex: number;
}

// Parse "2 users" / "50K returns/day" / "1.5M" / "1,000 users" → number.
// Honors K / M / B magnitude suffixes (the linear parser ignored them, which
// made "50K" read as 50 and broke the whole chart).
function parseUserScale(scale: string): number {
  const m = scale.match(/([\d,.]+)\s*([kKmMbB])?/);
  if (!m) return 0;
  const base = parseFloat(m[1].replace(/,/g, ""));
  if (isNaN(base)) return 0;
  const mult = { k: 1e3, m: 1e6, b: 1e9 }[(m[2] || "").toLowerCase()] ?? 1;
  return base * mult;
}

function formatMag(n: number): string {
  if (n >= 1e9) return `${+(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${+(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${+(n / 1e3).toFixed(1)}K`;
  return String(Math.round(n));
}

// ── Chart geometry (viewBox 440 × 120) ────────────────────────────
const PLOT_TOP = 16;
const BASELINE = 100;
const PLOT_H = BASELINE - PLOT_TOP; // 84
const INNER_LEFT = 52;
const INNER_RIGHT = 414;
const MIN_BAR_H = 2.5; // a visible stub for stages that are tiny next to the max

interface Bar {
  cx: number;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

interface ChartModel {
  bars: Bar[];
  gridYs: { y: number; label: string | null }[];
}

/**
 * Round an axis maximum up to a "nice" number (1/2/5 × 10ⁿ) and pick a tick
 * count that subdivides it into round steps.
 */
function niceAxis(maxV: number): { axisMax: number; ticks: number } {
  const exp = Math.floor(Math.log10(maxV));
  const base = Math.pow(10, exp);
  const lead = maxV / base;
  if (lead <= 1) return { axisMax: 1 * base, ticks: 5 }; // steps of 0.2
  if (lead <= 2) return { axisMax: 2 * base, ticks: 4 }; // steps of 0.5
  if (lead <= 5) return { axisMax: 5 * base, ticks: 5 }; // steps of 1
  return { axisMax: 10 * base, ticks: 5 }; // steps of 2
}

function buildModel(stages: Stage[]): ChartModel {
  const values = stages.map((s) => parseUserScale(s.userScale));
  const maxV = Math.max(...values, 1);
  const { axisMax, ticks } = niceAxis(maxV);

  const slot = (INNER_RIGHT - INNER_LEFT) / stages.length;
  const barW = Math.min(slot * 0.46, 32);

  // Linear height: bar heights are exactly proportional to the user counts,
  // so a 10M bar is twice a 5M bar. A small floor keeps tiny early stages
  // visible as a stub (their exact value is on the label beneath them).
  const heightFor = (v: number) => Math.max((v / axisMax) * PLOT_H, MIN_BAR_H);

  const bars: Bar[] = stages.map((s, i) => {
    const cx = INNER_LEFT + (i + 0.5) * slot;
    const h = heightFor(values[i]);
    return { cx, x: cx - barW / 2, y: BASELINE - h, w: barW, h, label: formatMag(values[i]) };
  });

  // Evenly spaced linear gridlines; label the bottom, top, and midpoint.
  const mid = Math.round(ticks / 2);
  const gridYs = Array.from({ length: ticks + 1 }, (_, i) => {
    const y = BASELINE - (i / ticks) * PLOT_H;
    const labelled = i === 0 || i === ticks || i === mid;
    return { y, label: labelled ? formatMag((i / ticks) * axisMax) : null };
  });

  return { bars, gridYs };
}

export function GrowthChart({ stages, activeStageIndex }: Props) {
  const model = useMemo(() => buildModel(stages), [stages]);

  return (
    <div className="h-[140px] py-3">
      <svg viewBox="0 0 440 120" className="w-full h-full overflow-visible">
        {/* Log gridlines + y labels */}
        {model.gridYs.map((g, i) => (
          <g key={i}>
            <line
              className="stroke-border"
              strokeWidth="0.5"
              strokeDasharray="2 4"
              opacity={g.label ? 0.6 : 0.3}
              x1={INNER_LEFT}
              y1={g.y}
              x2={INNER_RIGHT}
              y2={g.y}
            />
            {g.label && (
              <text
                className="font-mono text-[9px] fill-text-dim"
                x={INNER_LEFT - 8}
                y={g.y + 3}
                textAnchor="end"
              >
                {g.label}
              </text>
            )}
          </g>
        ))}

        {/* Baseline */}
        <line className="stroke-border" strokeWidth="1" x1={INNER_LEFT} y1={BASELINE} x2={INNER_RIGHT} y2={BASELINE} />

        {/* Bars */}
        {model.bars.map((bar, i) => {
          const active = i === activeStageIndex;
          const seen = i <= activeStageIndex;
          return (
            <g key={i}>
              <rect
                x={bar.x}
                y={bar.y}
                width={bar.w}
                height={bar.h}
                rx="1"
                className="transition-all duration-500 ease-out"
                style={{
                  fill: active ? "var(--color-accent)" : "var(--color-text)",
                  opacity: active ? 0.9 : seen ? 0.22 : 0.1,
                }}
              />
              {/* "You are here" marker on the active bar */}
              {active && (
                <circle
                  cx={bar.cx}
                  cy={bar.y}
                  r="3"
                  className="fill-surface stroke-accent transition-all duration-500 ease-out"
                  strokeWidth="1.5"
                />
              )}
              {/* Magnitude label under each bar */}
              <text
                x={bar.cx}
                y={BASELINE + 12}
                textAnchor="middle"
                className="font-mono text-[9px] tracking-wide transition-colors duration-500"
                style={{
                  fill: active ? "var(--color-accent)" : "var(--color-text-dim)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
