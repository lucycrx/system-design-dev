"use client";

import { useEffect, useState } from "react";
import { CanvasWaveBackground } from "./CanvasWaveBackground";

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
        className="inline-block transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
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
      {/* Canvas wave background */}
      <div
        className="absolute inset-0 transition-opacity duration-[1500ms]"
        style={{ opacity: phase >= 2 ? 1 : 0 }}
      >
        <CanvasWaveBackground />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-14 sm:pt-16 pb-8">
        {/* Top label */}
        <div
          className="mb-8 transition-all duration-500"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <span className="label-mono text-text-muted">
            Architecture Review for Claude Code
          </span>
        </div>

        {/* Main title — dramatic scale with weight contrast */}
        <h1 className="heading-hero text-[2.75rem] sm:text-[3.5rem] lg:text-[4.25rem] text-text mb-8 max-w-3xl">
          <span className="block font-light">
            <WordReveal delay={150} visible={phase >= 1}>
              <span className="text-stroke-accent">Understand</span> any codebase.
            </WordReveal>
          </span>
          <span className="block">
            <WordReveal delay={400} visible={phase >= 1}>
              <span className="relative text-accent font-extrabold">
                Build to scale.
                <span
                  className="absolute -bottom-1.5 left-0 h-[5px] bg-accent rounded-sm transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] origin-left w-full"
                  style={{
                    transform: phase >= 2 ? "scaleX(1)" : "scaleX(0)",
                  }}
                />
              </span>
            </WordReveal>
          </span>
        </h1>

        {/* Subtitle + annotation */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 max-w-2xl transition-all duration-700"
          style={{
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "200ms",
          }}
        >
          <div>
            <p className="font-mono text-[13px] text-text-muted leading-relaxed mb-6">
              Get an interactive architecture map with plain-English
              explanations and risk analysis. No code reading required.
            </p>
            <a
              href="#get-started"
              className="inline-block font-mono text-[12px] font-medium tracking-wide uppercase bg-text text-bg px-6 py-3 hover:bg-accent hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_8px_32px_var(--color-accent-glow)]"
            >
              Get Started
            </a>
          </div>

          <div className="border-t border-text/15 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-accent/20 sm:pl-8">
            <div className="label-mono text-accent mb-2">
              For PMs, founders, and vibecoders
            </div>
            <div className="font-mono text-[12px] text-text-dim leading-relaxed">
              See what was built and what might break &mdash; in 5 minutes.
            </div>
          </div>
        </div>

        {/* Animated divider */}
        <div className="mt-6 overflow-hidden">
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
