"use client";

import { useEffect, useRef, useState } from "react";
import { SectionNumber } from "./SectionNumber";

const STEPS = [
  {
    number: "1",
    title: "Skill scans your codebase",
    description:
      "Discovers routes, databases, API integrations, auth patterns, caching layers, and more.",
  },
  {
    number: "2",
    title: "Generates interactive HTML",
    description:
      "Components grouped by category, risks flagged by severity, everything explained in plain English.",
  },
  {
    number: "3",
    title: "Opens in your browser",
    description:
      "One self-contained file. Click through components, read risk reports, share with your team.",
  },
];

function TypingCommand({ visible }: { visible: boolean }) {
  const [charCount, setCharCount] = useState(0);
  const command = "/architecture-review";

  useEffect(() => {
    if (!visible) return;
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        setCharCount((c) => {
          if (c >= command.length) {
            clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, 60);
      return () => clearInterval(interval);
    }, 400);
    return () => clearTimeout(start);
  }, [visible]);

  return (
    <div className="bg-[#1A1A1A] border border-[#333] p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-full bg-[#444]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#444]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#444]" />
      </div>
      <div className="font-mono text-lg sm:text-xl text-[#E0E0E0] tracking-wide">
        <span className="text-[#666]">$ </span>
        {command.slice(0, charCount)}
        <span
          className="inline-block w-[2px] h-[1.2em] bg-[#E0E0E0] ml-0.5 align-middle"
          style={{
            animation:
              charCount >= command.length
                ? "blink 1s step-end infinite"
                : "none",
            opacity: charCount >= command.length ? undefined : 1,
          }}
        />
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
    <section ref={ref} className="max-w-5xl mx-auto px-6 py-16 sm:py-24">
      <div className="flex items-baseline gap-5 mb-10">
        <SectionNumber number="04" />
        <h2 className="heading-editorial text-2xl sm:text-3xl text-text">
          Get Started
        </h2>
      </div>

      <div
        className="max-w-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {/* Command block */}
        <TypingCommand visible={visible} />

        <p className="font-mono text-[13px] text-text-muted leading-relaxed mt-4 mb-2">
          Run this in Claude Code. The skill scans your codebase and opens an
          interactive architecture map in your browser.
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-10">
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
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${600 + i * 150}ms`,
                borderTop:
                  i === 0 ? undefined : "1px solid var(--color-border)",
              }}
            >
              <span className="font-mono text-[13px] font-medium text-text-dim mt-0.5 flex-shrink-0 w-4">
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
