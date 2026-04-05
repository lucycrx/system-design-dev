"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SectionNumber } from "./SectionNumber";

export function ExampleOutput() {
  const [visible, setVisible] = useState(false);
  const [inputHovered, setInputHovered] = useState(false);
  const [outputHovered, setOutputHovered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} aria-label="Example output" className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <div className="flex items-baseline gap-5 mb-4">
        <SectionNumber number="02" />
        <h2 className="heading-editorial text-2xl sm:text-3xl lg:text-[2.25rem] text-text">
          See It in Action
        </h2>
      </div>
      <p className="font-mono text-[13px] text-text-muted leading-relaxed mb-10 max-w-lg">
        A real architecture review of an open-source repo. Click through
        components, read risk reports, explore the interactive map.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-start">
        {/* Before — GitHub repo */}
        <div
          className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
          }}
        >
          <p className="label-mono text-text-dim mb-3">Input</p>
          <a
            href="https://github.com/facebookresearch/Hyperagents"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative bg-terminal-bg border border-terminal-border p-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group overflow-hidden"
            style={{
              borderColor: inputHovered ? "var(--color-accent)" : "var(--color-terminal-border)",
              transform: inputHovered ? "translateY(-2px)" : "translateY(0)",
              boxShadow: inputHovered
                ? "0 12px 40px rgba(0,0,0,0.15)"
                : "none",
            }}
            onMouseEnter={() => setInputHovered(true)}
            onMouseLeave={() => setInputHovered(false)}
          >
            {/* Top accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] bg-text-dim transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left"
              style={{
                transform: inputHovered ? "scaleX(1)" : "scaleX(0)",
              }}
            />

            <div className="flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-text-dim"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="font-mono text-[12px] text-text-dim group-hover:text-accent/70 transition-colors">
                facebookresearch/Hyperagents
              </span>
              <span
                className="font-mono text-[11px] text-text-dim ml-auto transition-all duration-300"
                style={{
                  transform: inputHovered
                    ? "translate(3px, -3px)"
                    : "translate(0, 0)",
                }}
              >
                &nearr;
              </span>
            </div>
            <pre className="font-mono text-[11px] sm:text-[12px] text-text-dim leading-relaxed whitespace-pre overflow-x-auto">{`hyperagents/
  agents/
    base_agent.py
    hyperagent.py
    tool_agent.py
  tools/
    browser.py
    code_tools.py
  configs/
  benchmarks/`}</pre>
          </a>
        </div>

        {/* Arrow */}
        <div
          className="hidden md:flex items-center justify-center self-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-8px)",
            transitionDelay: "300ms",
          }}
        >
          <span className="font-mono text-[20px] text-accent font-bold">
            &rarr;
          </span>
        </div>

        {/* After — interactive preview */}
        <div
          className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transitionDelay: "200ms",
          }}
        >
          <p className="label-mono text-accent mb-3">Output</p>
          <Link
            href="/demo"
            className="block relative border overflow-hidden group transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              borderColor: outputHovered
                ? `color-mix(in srgb, var(--color-accent) 50%, var(--color-border))`
                : "var(--color-border)",
              transform: outputHovered ? "translateY(-2px)" : "translateY(0)",
              boxShadow: outputHovered
                ? "0 12px 40px rgba(74, 127, 212, 0.1)"
                : "none",
            }}
            onMouseEnter={() => setOutputHovered(true)}
            onMouseLeave={() => setOutputHovered(false)}
          >
            {/* Top accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] z-10 bg-accent transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left"
              style={{
                transform: outputHovered ? "scaleX(1)" : "scaleX(0)",
              }}
            />

            {/* Live iframe preview — non-interactive */}
            <div className="h-[280px] sm:h-[320px] overflow-hidden pointer-events-none">
              <iframe
                src="/examples/hyperagents.html"
                className="w-full border-0 origin-top-left"
                style={{
                  height: "900px",
                  transform: "scale(0.45)",
                  transformOrigin: "top left",
                  width: "222%",
                }}
                tabIndex={-1}
                loading="lazy"
                title="Architecture Review Preview"
              />
            </div>
            {/* Fade overlay with CTA */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent flex items-end justify-center pb-4">
              <span className="font-mono text-[12px] font-medium tracking-wide uppercase text-accent group-hover:text-text transition-colors">
                Explore full output &rarr;
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
