"use client";

import { useEffect, useState } from "react";
import { MiniDiagram } from "./MiniDiagram";

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

export function ProductHero() {
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
            Architecture Review for Claude Code
          </span>
        </div>

        {/* Two-column: headline left, mini-diagram right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-start">
          <div>
            {/* Main title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-text leading-[1.15] tracking-tight mb-10">
              <span className="block">
                <WordReveal delay={150} visible={phase >= 1}>
                  Understand any codebase.
                </WordReveal>
              </span>
              <span className="block">
                <WordReveal delay={400} visible={phase >= 1}>
                  <span className="relative text-accent">
                    Build to scale.
                    <span
                      className="absolute -bottom-1 left-0 h-[3px] bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left w-full"
                      style={{
                        transform: phase >= 2 ? "scaleX(1)" : "scaleX(0)",
                      }}
                    />
                  </span>
                </WordReveal>
              </span>
            </h1>

            {/* Two-column bottom: subtitle left, annotation right */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 transition-all duration-700"
              style={{
                opacity: phase >= 2 ? 1 : 0,
                transform: phase >= 2 ? "translateY(0)" : "translateY(12px)",
                transitionDelay: "200ms",
              }}
            >
              <div>
                <p className="font-mono text-[13px] text-text-muted leading-relaxed mb-5">
                  Get an interactive architecture map with plain-English
                  explanations and risk analysis. No code reading required.
                </p>
                <a
                  href="#get-started"
                  className="inline-block font-mono text-[12px] font-medium tracking-wide uppercase border border-text bg-text text-bg px-5 py-2.5 hover:bg-transparent hover:text-text transition-colors duration-200"
                >
                  Get Started
                </a>
              </div>

              <div className="border-t border-text/15 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-8">
                <div className="label-mono text-accent mb-2">
                  For PMs, founders, and vibecoders
                </div>
                <div className="font-mono text-[12px] text-text-dim leading-relaxed">
                  See what was built and what might break &mdash; in 5 minutes.
                </div>
              </div>
            </div>
          </div>

          {/* Mini diagram — right side, hidden on mobile */}
          <div
            className="hidden lg:block transition-all duration-1000"
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? "translateY(0)" : "translateY(16px)",
              transitionDelay: "400ms",
            }}
          >
            <MiniDiagram />
          </div>
        </div>

        {/* Animated divider */}
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
