"use client";

import { useEffect, useRef, useState } from "react";
import { SectionNumber } from "./SectionNumber";

const PERSONAS = [
  {
    label: "PMs",
    color: "var(--color-accent)",
    bg: "var(--color-accent-dim)",
    description:
      "Onboard to a new team without scheduling five 1:1s. Walk into sprint planning knowing the system.",
  },
  {
    label: "Founders",
    color: "var(--color-blue)",
    bg: "var(--color-blue-dim)",
    description:
      "Using AI to build your MVP? See what you\u2019ve actually got before hiring engineers or pitching investors.",
  },
  {
    label: "Vibecoders",
    color: "var(--color-green)",
    bg: "var(--color-green-dim)",
    description:
      "You shipped it and it works. Now understand what\u2019s underneath before it stops working.",
  },
];

function PersonaCard({
  persona,
  visible,
  delay,
}: {
  persona: (typeof PERSONAS)[0];
  visible: boolean;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative border border-border overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? "translateY(-4px)"
            : "translateY(0)"
          : "translateY(32px)",
        transitionDelay: visible ? (hovered ? "0ms" : `${delay}ms`) : `${delay}ms`,
        borderColor: hovered
          ? `color-mix(in srgb, ${persona.color} 35%, var(--color-border))`
          : undefined,
        boxShadow: hovered
          ? "0 12px 40px rgba(0,0,0,0.06)"
          : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Color accent bar */}
      <div
        className="h-[4px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          backgroundColor: persona.color,
          transform: hovered ? "scaleX(1)" : "scaleX(0.25)",
          transformOrigin: "left",
        }}
      />

      {/* Hover tint */}
      <div
        className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
        style={{
          backgroundColor: persona.bg,
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="relative p-6 sm:p-8">
        <span
          className="label-mono mb-4 block"
          style={{ color: persona.color }}
        >
          {persona.label}
        </span>
        <p className="text-[0.9375rem] text-text-muted leading-relaxed">
          {persona.description}
        </p>
      </div>
    </div>
  );
}

export function Personas() {
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
        <SectionNumber number="03" />
        <h2 className="heading-editorial text-xl sm:text-2xl lg:text-[1.75rem] text-text max-w-lg">
          Built for People Who Ship, Not Just Code.
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PERSONAS.map((persona, i) => (
          <PersonaCard
            key={persona.label}
            persona={persona}
            visible={visible}
            delay={i * 100}
          />
        ))}
      </div>
    </section>
  );
}
