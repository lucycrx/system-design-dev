"use client";

import { useEffect, useRef, useState } from "react";
import { SectionNumber } from "./SectionNumber";

const PROPS = [
  {
    label: "VISUAL MAP",
    color: "var(--color-green)",
    title: "See every component, connection, and layer in your system.",
    description:
      "Components grouped by function, not file path. Frontend, API, database, cache, external services \u2014 all in one interactive diagram.",
  },
  {
    label: "RISK ANALYSIS",
    color: "var(--color-accent)",
    title: "16 anti-patterns checked automatically.",
    description:
      "Each risk explained in plain English with a real-world analogy and a fix. Severity calibrated to your project\u2019s scale.",
  },
  {
    label: "SHAREABLE ARTIFACT",
    color: "var(--color-blue)",
    title: "One self-contained HTML file.",
    description:
      "Works offline. Drop it in Slack, pull it up in a meeting, send it to your CTO.",
  },
];

function ValuePropItem({
  prop,
  visible,
  delay,
  isFirst,
}: {
  prop: (typeof PROPS)[0];
  visible: boolean;
  delay: number;
  isFirst: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative py-8 pl-6 pr-10 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
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
          backgroundColor: prop.color,
          top: hovered ? "16px" : "28px",
          bottom: hovered ? "16px" : "28px",
          width: hovered ? "4px" : "3px",
        }}
      />

      <span className="label-mono mb-3 block" style={{ color: prop.color }}>
        {prop.label}
      </span>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-text tracking-[-0.01em] mb-2">
            {prop.title}
          </h3>
          <p className="text-[0.9375rem] text-text-muted leading-relaxed">
            {prop.description}
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
      { threshold: 0.15 }
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

      <div className="max-w-2xl space-y-0">
        {PROPS.map((prop, i) => (
          <ValuePropItem
            key={prop.label}
            prop={prop}
            visible={visible}
            delay={i * 120}
            isFirst={i === 0}
          />
        ))}
      </div>
    </section>
  );
}
