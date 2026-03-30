"use client";

import { useEffect, useRef, useState } from "react";
import { SectionNumber } from "./SectionNumber";

const QUESTIONS = [
  {
    q: "What do I need to run this?",
    a: "Claude Code. The skill runs inside Claude Code\u2019s environment and uses its tools to scan your codebase. No additional setup or dependencies required.",
  },
  {
    q: "Does my code leave my machine?",
    a: "No. The skill runs locally. It reads your files through Claude Code\u2019s sandbox and generates a local HTML file. Nothing is uploaded or sent externally.",
  },
  {
    q: "What frameworks does it support?",
    a: "Any codebase Claude Code can read. It\u2019s been tested on Next.js, Django, Rails, Express, Flask, FastAPI, Go, and Laravel projects. The skill detects your framework automatically.",
  },
  {
    q: "What if I don\u2019t understand the output?",
    a: "Everything is written in plain English with real-world analogies. Each risk in the report links to a deeper explanation on this site\u2019s Build Stories, where you can learn the concepts at your own pace.",
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

  return (
    <div
      className="border-t border-border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 flex items-start justify-between gap-4 cursor-pointer group"
      >
        <span className="text-[0.9375rem] font-semibold text-text group-hover:text-accent transition-colors duration-200">
          {item.q}
        </span>
        <span className="font-mono text-text-dim text-sm flex-shrink-0 mt-0.5 transition-transform duration-300" style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>
          +
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="text-[0.875rem] text-text-muted leading-relaxed pb-5 max-w-xl">
            {item.a}
          </p>
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
    <section ref={ref} className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <div className="flex items-baseline gap-5 mb-6">
        <SectionNumber number="06" />
        <h2 className="heading-editorial text-2xl sm:text-3xl text-text">
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
