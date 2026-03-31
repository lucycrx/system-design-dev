"use client";

import { useEffect, useRef, useState } from "react";
import { SectionNumber } from "./SectionNumber";

const STEPS = [
  {
    number: "1",
    title: "Scans your codebase",
    description:
      "Routes, databases, APIs, auth, caching \u2014 detected automatically.",
  },
  {
    number: "2",
    title: "Generates an interactive map",
    description:
      "Components grouped by category, risks flagged by severity, all in plain English.",
  },
  {
    number: "3",
    title: "Opens in your browser",
    description:
      "One file. Click through components, read risk reports, share with your team.",
  },
];

const INSTALL_LINES = [
  "/plugin marketplace add lucycrx/architecture-review",
  "/plugin install architecture-review@lucycrx-architecture-review",
];

const USAGE_LINE = "/architecture-review";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="font-mono text-[11px] text-[#555] hover:text-[#999] transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

function TerminalBlock({
  visible,
  lines,
  label,
  delay = 0,
}: {
  visible: boolean;
  lines: string[];
  label: string;
  delay?: number;
}) {
  return (
    <div
      className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] text-text-dim uppercase tracking-wider">
          {label}
        </span>
        <CopyButton text={lines.join("\n")} />
      </div>
      <div
        className="relative bg-[#0F1117] border border-[#2A2D35] p-5 sm:p-6 overflow-hidden"
        style={{
          boxShadow:
            "0 0 60px rgba(74, 127, 212, 0.06), 0 0 120px rgba(74, 127, 212, 0.03)",
        }}
      >
        {/* Subtle gradient border overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(74, 127, 212, 0.08), transparent 50%, rgba(29, 122, 66, 0.06))",
          }}
        />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A2D35]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A2D35]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2A2D35]" />
          </div>
          <div className="font-mono text-base sm:text-lg text-[#E8ECF0] tracking-wide space-y-1">
            {lines.map((line, i) => (
              <div key={i}>
                <span className="text-accent/50">$ </span>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InstallSection() {
  const [visible, setVisible] = useState(false);
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="get-started"
      className="max-w-5xl mx-auto px-6 py-16 sm:py-24 scroll-mt-8"
    >
      <div className="flex items-baseline gap-5 mb-10">
        <SectionNumber number="04" />
        <h2 className="heading-editorial text-2xl sm:text-3xl lg:text-[2.25rem] text-text">
          Get Started
        </h2>
      </div>

      <div
        className="max-w-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        {/* Install command */}
        <TerminalBlock
          visible={visible}
          lines={INSTALL_LINES}
          label="Install"
          delay={200}
        />

        <p className="font-mono text-[13px] text-text-muted leading-relaxed mt-3 mb-8">
          Run both commands in Claude Code to add the skill from GitHub.
        </p>

        {/* Usage command */}
        <TerminalBlock
          visible={visible}
          lines={[USAGE_LINE]}
          label="Then run"
          delay={400}
        />

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 mb-10">
          <span className="font-mono text-[11px] text-text-dim">
            Or say: &ldquo;review my architecture&rdquo;
          </span>
          <span className="font-mono text-[11px] text-text-dim">
            Or say: &ldquo;what does my system look like&rdquo;
          </span>
        </div>

        {/* Steps */}
        <div className="space-y-0">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="flex gap-4 py-5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${600 + i * 150}ms`,
                borderTop:
                  i === 0 ? undefined : "1px solid var(--color-border)",
              }}
            >
              <span className="font-mono text-[13px] font-medium text-accent/60 mt-0.5 flex-shrink-0 w-4">
                {step.number}
              </span>
              <div>
                <div className="text-[0.9375rem] font-semibold text-text mb-1">
                  {step.title}
                </div>
                <p className="text-[13px] text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <div className="mt-6 pt-5 border-t border-border">
          <span className="label-mono text-text-dim">
            Runs locally. No code leaves your machine.
          </span>
        </div>
      </div>
    </section>
  );
}
