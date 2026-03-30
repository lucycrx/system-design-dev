"use client";

import { useEffect, useRef, useState } from "react";
import { SectionNumber } from "./SectionNumber";

const PROPS = [
  {
    label: "VISUAL MAP",
    color: "var(--color-green)",
    title: "See every component, connection, and layer in your system.",
    description:
      "Grouped by what they do, not where they live in the file tree. Frontend, API, database, cache, external services \u2014 all laid out in an interactive diagram you can click through.",
  },
  {
    label: "RISK ANALYSIS",
    color: "var(--color-accent)",
    title: "16 anti-patterns checked automatically.",
    description:
      "Each risk comes with a plain-English explanation, a real-world analogy, and the fix. Severity is calibrated to your project\u2019s scale \u2014 no one tells a side project to add Kafka.",
  },
  {
    label: "SHAREABLE ARTIFACT",
    color: "var(--color-blue)",
    title: "One self-contained HTML file.",
    description:
      "Works offline. Drop it in Slack, pull it up in a meeting, send it to your CTO. No special tools needed to open it.",
  },
];

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
        <SectionNumber number="02" />
        <h2 className="heading-editorial text-2xl sm:text-3xl text-text">
          One Command. Five Minutes.
        </h2>
      </div>

      <div className="max-w-2xl space-y-0">
        {PROPS.map((prop, i) => (
          <div
            key={prop.label}
            className="py-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${i * 120}ms`,
              borderTop: i === 0 ? undefined : "1px solid var(--color-border)",
            }}
          >
            <span
              className="label-mono mb-3 block"
              style={{ color: prop.color }}
            >
              {prop.label}
            </span>
            <h3 className="text-lg font-bold text-text tracking-[-0.01em] mb-2">
              {prop.title}
            </h3>
            <p className="text-[0.9375rem] text-text-muted leading-relaxed">
              {prop.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
