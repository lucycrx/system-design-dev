"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export type ShapeType =
  | "circle"
  | "square"
  | "triangle"
  | "half-circle"
  | "quarter-arc";

/**
 * Flat, single-fill Bauhaus primitive. Rules: one fill, no outline, no
 * gradient, no shadow. Used as section markers, bullet glyphs, and oversized
 * background motifs. `color` defaults to ink; pass a primary for accents.
 */
export function Shape({
  type,
  color = "var(--color-text)",
  size = 16,
  className,
  style,
}: {
  type: ShapeType;
  color?: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    className,
    style,
    "aria-hidden": true as const,
    role: "presentation" as const,
  };

  switch (type) {
    case "circle":
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="50" fill={color} />
        </svg>
      );
    case "square":
      return (
        <svg {...common}>
          <rect x="0" y="0" width="100" height="100" fill={color} />
        </svg>
      );
    case "triangle":
      return (
        <svg {...common}>
          <path d="M50 0 L100 100 L0 100 Z" fill={color} />
        </svg>
      );
    case "half-circle":
      return (
        <svg {...common}>
          <path d="M0 50 A50 50 0 0 1 100 50 Z" fill={color} />
        </svg>
      );
    case "quarter-arc":
      return (
        <svg {...common}>
          <path d="M0 100 L0 0 A100 100 0 0 1 100 100 Z" fill={color} />
        </svg>
      );
  }
}

/**
 * Parallax wrapper — translates its children vertically at a fraction of the
 * scroll rate so background shapes drift slower than content (depth). Frozen
 * under prefers-reduced-motion.
 */
export function ShapeDrift({
  speed = 0.25,
  className,
  style,
  children,
}: {
  speed?: number;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    function update() {
      raf = 0;
      el!.style.transform = `translate3d(0, ${window.scrollY * -speed}px, 0)`;
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ willChange: "transform", ...style }}
    >
      {children}
    </div>
  );
}
