"use client";

import { useEffect, useRef, useState } from "react";
import { SectionNumber } from "./SectionNumber";
import { MiniDiagram } from "./MiniDiagram";

const FILE_TREE = `src/
  app/
    api/
      auth/[...nextauth]/route.ts
      payments/webhook/route.ts
      users/route.ts
    dashboard/page.tsx
    layout.tsx
  lib/
    db.ts
    stripe.ts
    auth.ts
    redis.ts
  middleware.ts
  prisma/schema.prisma
  package.json`;

export function BeforeAfter() {
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
      <div className="flex items-baseline gap-5 mb-8">
        <SectionNumber number="01" />
        <h2 className="heading-editorial text-2xl sm:text-3xl text-text">
          From Code to Clarity
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Before — terminal/file tree */}
        <div
          className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <p className="label-mono text-text-dim mb-3">Your Codebase</p>
          <div className="bg-[#1A1A1A] border border-[#333] p-5 overflow-hidden">
            <pre className="font-mono text-[11px] sm:text-[12px] text-[#888] leading-relaxed whitespace-pre overflow-x-auto">
              {FILE_TREE}
            </pre>
          </div>
        </div>

        {/* After — architecture map */}
        <div
          className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transitionDelay: "150ms",
          }}
        >
          <p className="label-mono text-accent mb-3">Your Architecture Map</p>
          <MiniDiagram />
        </div>
      </div>
    </section>
  );
}
