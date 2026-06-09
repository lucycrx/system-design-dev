"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { conceptIconShapes } from "./ConceptIcon";

/**
 * Animated concept icon: a grid of ink particles, clipped to the icon's own
 * silhouette, scatters in and resolves into the crisp solid Bauhaus icon, then
 * rests. Built generically from the shared `conceptIconShapes` geometry, so it
 * works for any concept with no per-icon art. Plays once, on scroll into view.
 *
 * Used only on the landing page (opt-in via ConceptCard's `animate`); the
 * /concepts grid keeps the static ConceptIcon. Motion + timing live in
 * globals.css under `.concept-scatter`; prefers-reduced-motion shows the solid
 * icon instantly.
 */

interface Props {
  id: string;
  color?: string;
  accent?: string;
  className?: string;
}

// Particle field over the 0..100 viewBox. Identical for every icon (only the
// clip differs), so compute it once. Each dot carries its scatter offset and a
// distance-based stagger delay for the ripple.
const STEP = 7.6; // grid spacing — sparser = smoother on small icons
const SPREAD = 30; // scatter travel distance
const STAGGER = 7; // ms per unit of distance from centre
const CAP = 440; // max stagger delay
const R = 4.4; // dot radius

const DOTS: { cx: number; cy: number; ox: number; oy: number; delay: number }[] =
  (() => {
    const out: { cx: number; cy: number; ox: number; oy: number; delay: number }[] = [];
    for (let y = 4; y <= 96; y += STEP) {
      for (let x = 4; x <= 96; x += STEP) {
        const dx = x - 50;
        const dy = y - 50;
        const dist = Math.hypot(dx, dy);
        const norm = Math.abs(dx) + Math.abs(dy) + 1e-3;
        out.push({
          cx: x,
          cy: y,
          ox: (dx / norm) * SPREAD,
          oy: (dy / norm) * SPREAD,
          delay: Math.min(dist * STAGGER, CAP),
        });
      }
    }
    return out;
  })();

export function ConceptIconScatter({ id, color, accent, className }: Props) {
  const rawId = useId().replace(/:/g, "");
  const clipId = `cs-${rawId}-clip`;
  const ref = useRef<SVGSVGElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shapes = conceptIconShapes(id, accent ?? "currentColor");

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      className={`concept-scatter ${revealed ? "is-revealed" : ""} ${className ?? ""}`}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{
        color: color ?? "var(--color-text)",
        width: "100%",
        height: "100%",
        display: "block",
        transition: "color 500ms cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <defs>
        <clipPath id={clipId}>{shapes}</clipPath>
      </defs>

      {/* particles — fade out as the solid takes over */}
      <g className="cs-dots" clipPath={`url(#${clipId})`} fill="currentColor">
        {DOTS.map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={R}
            className="cs-dot"
            style={
              {
                "--ox": `${d.ox.toFixed(1)}px`,
                "--oy": `${d.oy.toFixed(1)}px`,
                "--delay": `${d.delay.toFixed(0)}ms`,
              } as CSSProperties
            }
          />
        ))}
      </g>

      {/* the crisp final icon */}
      <g className="cs-solid">{shapes}</g>
    </svg>
  );
}
