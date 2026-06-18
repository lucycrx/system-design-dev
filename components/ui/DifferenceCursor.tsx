"use client";

import { useEffect, useRef } from "react";

/**
 * Hybrid cursor — two independently-tracked layers:
 *   1. a paper fill with mix-blend-difference (the inversion flair), and
 *   2. a non-blended two-tone ring on top (the visibility guarantee).
 * They must be separate top-level fixed elements: nesting the blended layer
 * inside a transformed wrapper would isolate the blend and kill the effect, so
 * the same transform is applied to both each frame. The ring (ink stroke +
 * paper halos) stays legible on any background even where the blended fill
 * inverts to a low-contrast color. Lerp follow, grows over interactive
 * elements; hidden on coarse pointers; reduced-motion snaps instead of lags.
 */
export function DifferenceCursor() {
  const fillRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fill = fillRef.current;
    const ring = ringRef.current;
    if (!fill || !ring) return;

    document.documentElement.classList.add("cursor-none");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let scale = 1;
    let curScale = 1;
    let raf = 0;
    let seen = false;

    const interactiveSel = "a, button, input, textarea, select, label, [data-cursor]";

    function setOpacity(v: string) {
      fill!.style.opacity = v;
      ring!.style.opacity = v;
    }

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!seen) {
        seen = true;
        curX = mouseX;
        curY = mouseY;
        setOpacity("1");
      }
      const overInteractive = !!(e.target as Element | null)?.closest?.(interactiveSel);
      scale = overInteractive ? 2 : 1;
      // Restart the follow loop if it idled itself to a stop.
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function onLeave() {
      setOpacity("0");
    }
    function onEnter() {
      if (seen) setOpacity("1");
    }

    function tick() {
      const ease = reduced ? 1 : 0.45;
      curX += (mouseX - curX) * ease;
      curY += (mouseY - curY) * ease;
      curScale += (scale - curScale) * 0.35;
      const t = `translate(${curX}px, ${curY}px) translate(-50%, -50%) scale(${curScale})`;
      fill!.style.transform = t;
      ring!.style.transform = t;
      // Stop the loop once the cursor has caught up. Leaving the blended fill
      // re-compositing the backdrop every frame while idle is the real cost;
      // onMove restarts the loop on the next movement.
      const settled =
        Math.abs(mouseX - curX) < 0.1 &&
        Math.abs(mouseY - curY) < 0.1 &&
        Math.abs(scale - curScale) < 0.01;
      if (settled) {
        curX = mouseX;
        curY = mouseY;
        curScale = scale;
        fill!.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%) scale(${curScale})`;
        ring!.style.transform = fill!.style.transform;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  const base = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    borderRadius: "9999px",
    pointerEvents: "none" as const,
    opacity: 0,
    willChange: "transform",
    transition: "opacity 200ms ease",
  };

  return (
    <>
      {/* Layer 1 — blended fill: inverts against whatever is behind it */}
      <div
        ref={fillRef}
        aria-hidden="true"
        style={{
          ...base,
          width: 22,
          height: 22,
          backgroundColor: "#F4F1EA",
          mixBlendMode: "difference",
          zIndex: 9998,
        }}
      />
      {/* Layer 2 — non-blended two-tone ring: always visible */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          ...base,
          width: 30,
          height: 30,
          border: "1.5px solid #1A1A1A",
          boxShadow:
            "0 0 0 1px rgba(244,241,234,0.9), inset 0 0 0 1px rgba(244,241,234,0.9)",
          zIndex: 9999,
        }}
      />
    </>
  );
}
