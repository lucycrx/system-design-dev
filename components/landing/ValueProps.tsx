"use client";

import { useEffect, useRef, useState } from "react";
import { SectionNumber } from "./SectionNumber";
import { MiniDiagram } from "./MiniDiagram";

const FEATURES = [
  {
    label: "ONE COMMAND",
    color: "var(--color-accent)",
    title: "Run /architecture-review and walk away.",
    description:
      "Scans your entire codebase in under 5 minutes. No config, no setup, no code reading required.",
  },
  {
    label: "15 ANTI-PATTERNS",
    color: "var(--color-green)",
    title: "Risks flagged before they hit production.",
    description:
      "Each risk explained in plain English with a real-world analogy and a severity rating calibrated to your project\u2019s scale.",
  },
  {
    label: "1 INTERACTIVE HTML",
    color: "var(--color-blue)",
    title: "A shareable map you can click through.",
    description:
      "Components grouped by layer. Click any node to see connections, risks, and plain-English explanations. Works offline.",
  },
];

const PROMPTS = [
  "Click a component to see its connections",
  "Risk badges show severity at a glance",
  "Detail panel explains what each part does",
];

function FeatureItem({
  feature,
  visible,
  delay,
  isFirst,
}: {
  feature: (typeof FEATURES)[0];
  visible: boolean;
  delay: number;
  isFirst: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative py-6 pl-6 pr-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
        borderTop: isFirst ? undefined : "1px solid var(--color-border)",
        paddingLeft: hovered ? "18px" : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover background expansion */}
      <div
        className="absolute inset-0 bg-surface rounded-sm transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left"
        style={{
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
          zIndex: -1,
        }}
      />

      {/* Colored left accent bar */}
      <div
        className="absolute left-0 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] w-[3px] rounded-sm"
        style={{
          backgroundColor: feature.color,
          top: hovered ? "12px" : "20px",
          bottom: hovered ? "12px" : "20px",
          width: hovered ? "4px" : "3px",
        }}
      />

      <span className="label-mono mb-2 block" style={{ color: feature.color }}>
        {feature.label}
      </span>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-text tracking-[-0.01em] mb-1">
            {feature.title}
          </h3>
          <p className="text-[0.875rem] text-text-muted leading-relaxed">
            {feature.description}
          </p>
        </div>
        <span
          className="text-text-dim text-lg mt-1 transition-all duration-300 flex-shrink-0"
          style={{
            transform: hovered ? "translate(4px, -4px)" : "translate(0, 0)",
            color: hovered ? "var(--color-text)" : undefined,
          }}
        >
          &#8599;
        </span>
      </div>
    </div>
  );
}

export function ValueProps() {
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <div className="flex items-baseline gap-5 mb-10">
        <SectionNumber number="01" />
        <h2 className="heading-editorial text-2xl sm:text-3xl lg:text-[2.25rem] text-text">
          One Command. Five Minutes.
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-start">
        {/* Left: feature list */}
        <div className="space-y-0">
          {FEATURES.map((feature, i) => (
            <FeatureItem
              key={feature.label}
              feature={feature}
              visible={visible}
              delay={i * 120}
              isFirst={i === 0}
            />
          ))}
        </div>

        {/* Right: interactive diagram + prompts */}
        <div
          className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transitionDelay: "300ms",
          }}
        >
          <MiniDiagram />

          {/* Interaction prompts */}
          <div className="mt-4 flex flex-col gap-2">
            {PROMPTS.map((prompt, i) => (
              <div
                key={i}
                className="flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(8px)",
                  transitionDelay: `${500 + i * 100}ms`,
                }}
              >
                <span className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                <span className="font-mono text-[11px] text-text-dim">
                  {prompt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
