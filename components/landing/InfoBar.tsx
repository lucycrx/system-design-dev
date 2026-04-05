"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const STATS = [
  { value: 16, suffix: "", label: "Anti-patterns checked" },
  { value: 5, suffix: " min", label: "Average review time" },
  { value: 1, suffix: "", label: "Self-contained HTML file" },
  { value: 0, suffix: "", label: "Setup required" },
];

function countUp(
  el: HTMLSpanElement,
  target: number,
  suffix: string,
  duration: number
) {
  if (target === 0) {
    el.textContent = "0" + suffix;
    return;
  }
  const start = performance.now();
  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(step);
}

export function InfoBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const counted = useRef(false);

  const startCounting = useCallback(() => {
    if (counted.current || !ref.current) return;
    counted.current = true;
    const valueEls = ref.current.querySelectorAll<HTMLSpanElement>("[data-value]");
    valueEls.forEach((el, i) => {
      const target = Number(el.dataset.value);
      const suffix = el.dataset.suffix || "";
      el.textContent = "0" + suffix;
      setTimeout(() => countUp(el, target, suffix, 1200), i * 100);
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          startCounting();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startCounting]);

  return (
    <div
      ref={ref}
      className="bg-surface border-t border-border py-6 px-6 flex items-center justify-center gap-8 sm:gap-14 overflow-x-auto"
    >
      {STATS.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-8 sm:gap-14">
          {i > 0 && (
            <div
              className="w-px h-10 bg-border flex-shrink-0 transition-opacity duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transitionDelay: `${i * 80 + 60}ms`,
              }}
            />
          )}
          <div
            className="flex flex-col gap-1 whitespace-nowrap transition-all duration-600"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transitionDelay: `${i * 80}ms`,
              transitionTimingFunction: "var(--ease-out-expo)",
            }}
          >
            <span className="label-mono text-text-dim">{stat.label}</span>
            <span
              className="text-[22px] font-bold text-accent tracking-[-0.03em]"
              data-value={stat.value}
              data-suffix={stat.suffix}
            >
              {stat.value + stat.suffix}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
