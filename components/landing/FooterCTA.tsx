"use client";

import { useEffect, useRef, useState } from "react";

export function FooterCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="px-6 py-20 sm:py-28 flex flex-col sm:flex-row items-center justify-between gap-10 max-w-5xl mx-auto"
    >
      <h2
        className="heading-hero text-3xl sm:text-4xl lg:text-5xl text-white max-w-lg transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transitionTimingFunction: "var(--ease-out-expo)",
        }}
      >
        Ready to{" "}
        <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.5)", color: "transparent" }}>
          understand
        </span>{" "}
        your codebase?
      </h2>
      <a
        href="#get-started"
        className="relative overflow-hidden flex-shrink-0 px-8 py-4 bg-bg text-text font-medium text-sm rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0)"
            : "translateY(24px)",
          transitionDelay: "150ms",
          transitionTimingFunction: "var(--ease-out-expo)",
          transitionProperty: "opacity, transform, box-shadow",
        }}
      >
        Get started &rarr;
      </a>
    </div>
  );
}
