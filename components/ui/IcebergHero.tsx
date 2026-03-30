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
  return (
    <div
      className="absolute inset-0 pointer-events-none transition-opacity duration-1000 delay-700"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <svg
        className="absolute top-0 right-0 w-[50%] h-full"
        preserveAspectRatio="none"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vertical lines */}
        {[100, 200, 300].map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="0"
            x2={x}
            y2="400"
            stroke="var(--color-border)"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            opacity="0.5"
          />
        ))}
        {/* Horizontal lines */}
        {[80, 160, 240, 320].map((y) => (
          <line
            key={`h-${y}`}
            x1="0"
            y1={y}
            x2="400"
            y2={y}
            stroke="var(--color-border)"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            opacity="0.5"
          />
        ))}
        {/* Accent node */}
        <rect
          x="196"
          y="156"
          width="8"
          height="8"
          fill="var(--color-accent)"
          opacity="0.6"
        />
        <rect
          x="296"
          y="236"
          width="8"
          height="8"
          fill="var(--color-blue)"
          opacity="0.5"
        />
      </svg>
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
