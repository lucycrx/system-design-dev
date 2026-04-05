"use client";

import { useEffect, useRef, useState } from "react";
import { SectionNumber } from "./SectionNumber";

const QUESTIONS = [
  {
    q: "What do I need to run this?",
    a: "Claude Code. No other setup or dependencies required.",
  },
  {
    q: "Does my code leave my machine?",
    a: "No. Everything runs locally. Nothing is uploaded or sent externally.",
  },
  {
    q: "What frameworks does it support?",
    a: "Any codebase Claude Code can read. Best support for Next.js, Django, Rails, and Express.",
  },
  {
    q: "What if I don\u2019t understand the output?",
    a: "Everything is in plain English with real-world analogies. Each risk links to a deeper explanation in our Build Stories.",
  },
  {
    q: "Is it free?",
    a: "Yes. The skill is free and open source. You just need a Claude Code subscription.",
  },
];

function FAQItem({
  item,
  visible,
  delay,
}: {
  item: (typeof QUESTIONS)[0];
  visible: boolean;
  delay: number;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative border-t border-border transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover/open background expansion */}
      <div
        className="absolute inset-0 bg-surface rounded-sm transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left"
        style={{
          transform: hovered || open ? "scaleX(1)" : "scaleX(0)",
          zIndex: -1,
        }}
      />

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-sm bg-accent transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "scaleY(1)" : "scaleY(0.3)",
          transformOrigin: "top",
        }}
      />

      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full text-left py-5 flex items-start justify-between gap-4 cursor-pointer group transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: hovered || open ? "translateX(12px)" : "translateX(0)" }}
      >
        <span
          className="text-[0.9375rem] font-semibold transition-colors duration-200"
          style={{ color: open ? "var(--color-accent)" : hovered ? "var(--color-accent)" : "var(--color-text)" }}
        >
          {item.q}
        </span>
        <span
          className="font-mono text-text-dim text-sm flex-shrink-0 mt-0.5 transition-all duration-300"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            color: open ? "var(--color-accent)" : undefined,
          }}
        >
          +
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className="transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(-8px)",
            }}
          >
            <p
              className="text-[0.875rem] text-text-muted leading-relaxed pb-5 max-w-xl"
              style={{ transform: "translateX(12px)" }}
            >
              {item.a}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
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
    <section ref={ref} aria-label="Frequently asked questions" className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <div className="flex items-baseline gap-5 mb-6">
        <SectionNumber number="06" />
        <h2 className="heading-editorial text-2xl sm:text-3xl lg:text-[2.25rem] text-text">
          Questions
        </h2>
      </div>

      <div className="max-w-2xl">
        {QUESTIONS.map((item, i) => (
          <FAQItem key={i} item={item} visible={visible} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}
