"use client";

import { useEffect, useRef, useState } from "react";

const ANTI_PATTERNS = [
  "Sessions in Primary DB",
  "No Caching on Read-Heavy Paths",
  "Blobs in Database",
  "No Rate Limiting",
  "No Connection Pooling",
  "Sync-Heavy Operations",
  "No Health Check",
  "Secrets in Source Code",
  "No Indexing Strategy",
  "N+1 Queries",
  "No Error Boundary",
  "No Environment Config",
  "No Service Layer",
  "Single Database Bottleneck",
  "Monolith with No Boundaries",
];

function AntiPatternItem({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-6 flex-shrink-0 px-6">
      <span className="font-mono text-[12px] tracking-[0.12em] uppercase whitespace-nowrap text-white/50">
        {name}
      </span>
      <span className="text-white/20 text-[10px]">&#10022;</span>
    </div>
  );
}

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
      className="bg-text transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <p className="label-mono text-white/30 text-center pt-4 pb-1">
        15 anti-patterns checked
      </p>
      <div className="relative overflow-hidden py-3">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-text to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-text to-transparent z-10 pointer-events-none" />

        {/* Scrolling track — duplicated for seamless loop */}
        <div
          className="flex items-center hover:[animation-play-state:paused]"
          style={{ animation: "marquee 40s linear infinite" }}
        >
          {ANTI_PATTERNS.map((name) => (
            <AntiPatternItem key={name} name={name} />
          ))}
          {ANTI_PATTERNS.map((name) => (
            <AntiPatternItem key={`dup-${name}`} name={name} />
          ))}
        </div>
      </div>
    </div>
  );
}
