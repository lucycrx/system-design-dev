"use client";

import { useEffect, useState } from "react";

function WordReveal({
  children,
  delay,
  visible,
}: {
  children: React.ReactNode;
  delay: number;
  visible: boolean;
}) {
  return (
    <span className="inline-block overflow-hidden">
      <span
        className="inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: visible ? "translateY(0)" : "translateY(110%)",
          opacity: visible ? 1 : 0,
          transitionDelay: `${delay}ms`,
        }}
      >
        {children}
      </span>
    </span>
  );
}

function GridPattern({ visible }: { visible: boolean }) {
  // Architectural blueprint grid — spans full width, staggered reveal
  const vLines = [80, 160, 240, 320, 400, 480, 560, 640, 720];
  const hLines = [60, 120, 180, 240, 300, 360];

  // All nodes pushed to the right third — clear of hero text
  const nodes: { x: number; y: number; color: string; size: number }[] = [
    { x: 560, y: 80, color: "var(--color-accent)", size: 10 },
    { x: 640, y: 180, color: "var(--color-blue)", size: 8 },
    { x: 720, y: 60, color: "var(--color-green)", size: 8 },
    { x: 720, y: 300, color: "var(--color-accent)", size: 6 },
    { x: 640, y: 300, color: "var(--color-blue)", size: 10 },
    { x: 560, y: 240, color: "var(--color-orange)", size: 6 },
  ];

  // Connector lines between nodes — right-side cluster
  const connectors = [
    { x1: 565, y1: 85, x2: 640, y2: 180 },
    { x1: 645, y1: 180, x2: 720, y2: 65 },
    { x1: 565, y1: 240, x2: 640, y2: 300 },
    { x1: 645, y1: 300, x2: 720, y2: 300 },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <svg
        className="absolute top-0 left-0 w-full h-full transition-opacity duration-1200"
        style={{
          opacity: visible ? 1 : 0,
          transitionDelay: "600ms",
          transitionDuration: "1200ms",
        }}
        preserveAspectRatio="xMaxYMid slice"
        viewBox="0 0 800 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Grid lines — solid, more visible */}
        {vLines.map((x, i) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="400"
            stroke="var(--color-border)"
            strokeWidth={x === 320 || x === 480 ? "1" : "0.5"}
            opacity={x === 320 || x === 480 ? "0.7" : "0.4"}
          />
        ))}
        {hLines.map((y) => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="800"
            y2={y}
            stroke="var(--color-border)"
            strokeWidth={y === 180 ? "1" : "0.5"}
            opacity={y === 180 ? "0.7" : "0.4"}
          />
        ))}

        {/* Connector lines between nodes — dashed, colored */}
        {connectors.map((c, i) => (
          <line
            key={`conn-${i}`}
            x1={c.x1}
            y1={c.y1}
            x2={c.x2}
            y2={c.y2}
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeDasharray="3 6"
            opacity="0.25"
          />
        ))}

        {/* Accent nodes at intersections */}
        {nodes.map((n, i) => (
          <g key={`node-${i}`}>
            {/* Outer ring */}
            <rect
              x={n.x - n.size}
              y={n.y - n.size}
              width={n.size * 2}
              height={n.size * 2}
              fill="none"
              stroke={n.color}
              strokeWidth="1"
              opacity="0.3"
            />
            {/* Inner fill */}
            <rect
              x={n.x - n.size / 2}
              y={n.y - n.size / 2}
              width={n.size}
              height={n.size}
              fill={n.color}
              opacity="0.7"
            />
          </g>
        ))}

        {/* Crosshair marks at right-side intersections */}
        {[
          { x: 560, y: 180 },
          { x: 720, y: 180 },
          { x: 640, y: 120 },
        ].map((p, i) => (
          <g key={`cross-${i}`} opacity="0.3">
            <line
              x1={p.x - 6}
              y1={p.y}
              x2={p.x + 6}
              y2={p.y}
              stroke="var(--color-text)"
              strokeWidth="1"
            />
            <line
              x1={p.x}
              y1={p.y - 6}
              x2={p.x}
              y2={p.y + 6}
              stroke="var(--color-text)"
              strokeWidth="1"
            />
          </g>
        ))}
      </svg>

      {/* Fade-out gradient so grid doesn't compete with text */}
      <div
        className="absolute inset-0 transition-opacity duration-1200"
        style={{
          background:
            "linear-gradient(to right, var(--color-bg) 35%, color-mix(in srgb, var(--color-bg) 85%, transparent) 55%, transparent 75%, transparent 92%, var(--color-bg) 100%)",
          opacity: visible ? 1 : 0,
          transitionDelay: "600ms",
        }}
      />
    </div>
  );
}

export function IcebergHero() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <header className="relative w-full overflow-hidden bg-bg">
      <GridPattern visible={phase >= 1} />

      <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16">
        {/* Top label */}
        <div
          className="mb-12 transition-all duration-500"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <span className="label-mono text-text-muted">
            System Design for Builders
          </span>
        </div>

        {/* Main title — word-by-word reveal */}
        <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold text-text leading-[1.02] tracking-tight mb-10">
          <span className="block">
            <WordReveal delay={150} visible={phase >= 1}>
              YOUR
            </WordReveal>{" "}
            <WordReveal delay={250} visible={phase >= 1}>
              APP
            </WordReveal>{" "}
            <WordReveal delay={350} visible={phase >= 1}>
              WORKS.
            </WordReveal>
          </span>
          <span className="block">
            <WordReveal delay={500} visible={phase >= 1}>
              UNTIL
            </WordReveal>{" "}
            <WordReveal delay={600} visible={phase >= 1}>
              IT
            </WordReveal>{" "}
            <WordReveal delay={700} visible={phase >= 1}>
              <span className="relative">
                DOESN&apos;T.
                {/* Accent underline that draws in */}
                <span
                  className="absolute -bottom-2 left-0 h-[3px] bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left w-full"
                  style={{
                    transform:
                      phase >= 2 ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </span>
            </WordReveal>
          </span>
        </h1>

        {/* Two-column bottom: subtitle left, annotation right */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 transition-all duration-700 delay-200"
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
            transitionDelay: "200ms",
          }}
        >
          <p className="font-mono text-[13px] text-text-muted leading-relaxed">
            AI lets you build fast. But the systems underneath — scaling,
            reliability, data flow — that&apos;s what separates software that
            works from software that lasts.
          </p>

          <div className="border-t border-text/15 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-8">
            <div className="label-mono text-accent mb-2">
              Interactive stories + structured lessons
            </div>
            <div className="font-mono text-[12px] text-text-dim leading-relaxed">
              For vibecoders, PMs, and founders — not just engineers prepping
              for interviews.
            </div>
          </div>
        </div>

        {/* Animated divider — draws from left */}
        <div className="mt-14 overflow-hidden">
          <div
            className="border-t border-border transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left"
            style={{
              transform: phase >= 2 ? "scaleX(1)" : "scaleX(0)",
              transitionDelay: "400ms",
            }}
          />
        </div>
      </div>
    </header>
  );
}
