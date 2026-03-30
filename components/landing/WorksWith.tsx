"use client";

import { useEffect, useRef, useState } from "react";

const FRAMEWORKS = [
  "Claude Code",
  "Next.js",
  "Django",
  "Rails",
  "Express",
  "and any codebase Claude can read",
];

export function WorksWith() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="max-w-5xl mx-auto px-6 py-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <p className="label-mono text-text-dim mb-5 text-center">Works with</p>
      <div className="flex flex-wrap justify-center gap-2.5">
        {FRAMEWORKS.map((name, i) => (
          <span
            key={name}
            className="font-mono text-[11px] tracking-wide text-text-muted border border-border px-3 py-1.5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(8px)",
              transitionDelay: `${i * 60}ms`,
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
