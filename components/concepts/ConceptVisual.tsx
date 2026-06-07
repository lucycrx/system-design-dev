import type { CSSProperties } from "react";
import type { ConceptVisualKey } from "@/types/story";

/**
 * Animated, math-curve-loaders-style illustrations for concept cards.
 * Each motif is a self-contained SVG built from transform/opacity/stroke
 * animation so dozens can render cheaply. Motion is gated by the parent via
 * the `playing` prop (-> data-playing), and frozen under prefers-reduced-motion
 * by the rules in globals.css. `color` tints the motif to its category.
 */

interface Props {
  visual: ConceptVisualKey;
  color?: string;
  playing?: boolean;
  className?: string;
}

const VB = "0 0 120 80";

// A smooth sine path sampled across the width, used by the `waves` motif.
function sinePath(yBase: number, amp: number, phase: number): string {
  const pts: string[] = [];
  for (let x = -20; x <= 180; x += 4) {
    const y = yBase + Math.sin((x / 40) * Math.PI * 2 + phase) * amp;
    pts.push(`${x === -20 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ");
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Helper: an animated element style (the data-anim attr enables play-state gating)
function anim(value: string): CSSProperties {
  return { animation: value };
}

function Motif({ visual }: { visual: ConceptVisualKey }) {
  switch (visual) {
    case "waves":
      return (
        <>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={sinePath(28 + i * 13, 6 - i, i * 1.3)}
              {...stroke}
              strokeWidth={2 - i * 0.4}
              opacity={0.85 - i * 0.22}
              data-anim
              style={anim(`cv-slideX ${2.4 + i * 0.6}s linear infinite`)}
            />
          ))}
        </>
      );

    case "distribute": {
      const targets = [18, 40, 62];
      return (
        <>
          {targets.map((ty, i) => (
            <line
              key={i}
              x1={26}
              y1={40}
              x2={94}
              y2={ty}
              {...stroke}
              strokeWidth={1.6}
              strokeDasharray="4 6"
              opacity={0.7}
              data-anim
              style={anim(`cv-dash ${1 + i * 0.25}s linear infinite`)}
            />
          ))}
          <circle cx={26} cy={40} r={6} fill="currentColor" />
          {targets.map((ty, i) => (
            <circle
              key={i}
              cx={94}
              cy={ty}
              r={5}
              fill="currentColor"
              opacity={0.45}
              data-anim
              style={anim(`cv-blink 1.5s ease-in-out ${i * 0.3}s infinite`)}
            />
          ))}
        </>
      );
    }

    case "pulse":
      return (
        <>
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={60}
              cy={40}
              r={26}
              {...stroke}
              strokeWidth={2}
              style={{
                ...anim(`cv-ring 2.4s ease-out ${i * 0.8}s infinite`),
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
              data-anim
            />
          ))}
          <circle cx={60} cy={40} r={6} fill="currentColor" />
        </>
      );

    case "orbit":
      return (
        <>
          <circle cx={60} cy={40} r={6} fill="currentColor" />
          {[
            { r: 18, dur: 5, dir: "cv-spin", op: 0.9 },
            { r: 28, dur: 8, dir: "cv-spin-rev", op: 0.6 },
          ].map((o, i) => (
            <g
              key={i}
              data-anim
              style={{
                ...anim(`${o.dir} ${o.dur}s linear infinite`),
                transformBox: "view-box",
                transformOrigin: "60px 40px",
              }}
            >
              <circle cx={60} cy={40} r={o.r} {...stroke} strokeWidth={1} opacity={0.3} />
              <circle cx={60 + o.r} cy={40} r={4} fill="currentColor" opacity={o.op} />
            </g>
          ))}
        </>
      );

    case "flow":
      return (
        <>
          <line
            x1={10}
            y1={40}
            x2={110}
            y2={40}
            {...stroke}
            strokeWidth={1.6}
            strokeDasharray="3 7"
            opacity={0.5}
            data-anim
            style={anim("cv-dash 0.9s linear infinite")}
          />
          {[0, 1, 2].map((i) => (
            <g
              key={i}
              data-anim
              style={anim(`cv-slideX 1.6s linear ${i * 0.5}s infinite`)}
            >
              <path
                d={`M ${28 + i * 32} 33 L ${36 + i * 32} 40 L ${28 + i * 32} 47`}
                {...stroke}
              />
            </g>
          ))}
        </>
      );

    case "grow":
      return (
        <>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={26 + i * 18}
              y={20}
              width={10}
              height={42}
              rx={1}
              fill="currentColor"
              opacity={0.5 + i * 0.12}
              data-anim
              style={{
                ...anim(`cv-rise ${1.8 + i * 0.2}s ease-in-out ${i * 0.15}s infinite`),
                transformBox: "fill-box",
                transformOrigin: "bottom",
              }}
            />
          ))}
          <line x1={20} y1={63} x2={100} y2={63} {...stroke} strokeWidth={1.5} opacity={0.4} />
        </>
      );

    case "mirror":
      return (
        <>
          <line x1={42} y1={40} x2={78} y2={40} {...stroke} strokeWidth={1.6} strokeDasharray="3 5" opacity={0.5} />
          <rect
            x={16}
            y={26}
            width={26}
            height={28}
            rx={2}
            fill="currentColor"
            data-anim
            style={anim("cv-handoff 2.4s ease-in-out infinite")}
          />
          <rect
            x={78}
            y={26}
            width={26}
            height={28}
            rx={2}
            fill="currentColor"
            data-anim
            style={anim("cv-handoff-rev 2.4s ease-in-out infinite")}
          />
        </>
      );

    case "grid": {
      const cells: { x: number; y: number; i: number }[] = [];
      let i = 0;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          cells.push({ x: 28 + c * 18, y: 22 + r * 18, i: i++ });
        }
      }
      return (
        <>
          {cells.map(({ x, y, i }) => (
            <rect
              key={i}
              x={x}
              y={y}
              width={11}
              height={11}
              rx={1.5}
              fill="currentColor"
              opacity={0.25}
              data-anim
              style={anim(`cv-blink 2.2s ease-in-out ${((x + y) % 60) * 0.03}s infinite`)}
            />
          ))}
        </>
      );
    }

    case "converge": {
      const sources = [
        { x: 14, y: 16 },
        { x: 106, y: 16 },
        { x: 14, y: 64 },
        { x: 106, y: 64 },
      ];
      return (
        <>
          {sources.map((s, i) => (
            <line
              key={i}
              x1={s.x}
              y1={s.y}
              x2={60}
              y2={40}
              {...stroke}
              strokeWidth={1.6}
              strokeDasharray="4 6"
              opacity={0.6}
              data-anim
              style={anim(`cv-dash-in ${1 + i * 0.2}s linear infinite`)}
            />
          ))}
          {sources.map((s, i) => (
            <circle key={`s${i}`} cx={s.x} cy={s.y} r={4} fill="currentColor" opacity={0.5} />
          ))}
          <circle
            cx={60}
            cy={40}
            r={8}
            fill="currentColor"
            data-anim
            style={{
              ...anim("cv-float 1.8s ease-in-out infinite"),
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          />
        </>
      );
    }

    case "gate":
      return (
        <>
          <line x1={10} y1={40} x2={110} y2={40} {...stroke} strokeWidth={1.4} strokeDasharray="3 6" opacity={0.4} />
          <rect
            x={52}
            y={14}
            width={6}
            height={22}
            rx={1}
            fill="currentColor"
            data-anim
            style={anim("cv-gate-rev 1.8s ease-in-out infinite")}
          />
          <rect
            x={62}
            y={44}
            width={6}
            height={22}
            rx={1}
            fill="currentColor"
            data-anim
            style={anim("cv-gate 1.8s ease-in-out infinite")}
          />
          <circle
            cx={60}
            cy={40}
            r={4}
            fill="currentColor"
            data-anim
            style={anim("cv-blink 1.8s ease-in-out infinite")}
          />
        </>
      );

    case "split":
      return (
        <>
          <rect
            x={36}
            y={26}
            width={24}
            height={28}
            rx={2}
            fill="currentColor"
            opacity={0.9}
            data-anim
            style={anim("cv-split-rev 2.6s ease-in-out infinite")}
          />
          <rect
            x={60}
            y={26}
            width={24}
            height={28}
            rx={2}
            fill="currentColor"
            opacity={0.55}
            data-anim
            style={anim("cv-split 2.6s ease-in-out infinite")}
          />
        </>
      );

    case "curve":
    default:
      return (
        <>
          <line x1={14} y1={66} x2={106} y2={66} {...stroke} strokeWidth={1.4} opacity={0.4} />
          <line x1={14} y1={66} x2={14} y2={16} {...stroke} strokeWidth={1.4} opacity={0.4} />
          <path
            d="M 14 64 C 56 62, 84 54, 104 14"
            {...stroke}
            strokeWidth={2.4}
            strokeDasharray={160}
            data-anim
            style={anim("cv-trace 3s ease-in-out infinite")}
          />
        </>
      );
  }
}

export function ConceptVisual({ visual, color, playing = true, className }: Props) {
  return (
    <svg
      viewBox={VB}
      className={`concept-visual ${className ?? ""}`}
      data-playing={playing}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{ color: color ?? "var(--color-accent)", display: "block", width: "100%", height: "100%" }}
    >
      <Motif visual={visual} />
    </svg>
  );
}
