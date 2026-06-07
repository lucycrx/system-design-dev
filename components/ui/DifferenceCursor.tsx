"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor: a two-tone ring (ink stroke sandwiched by paper halos) plus a
 * center dot, so it stays visible on ANY background — the ink reads on light
 * surfaces, the paper halos read on dark/colored ones. Lags behind the pointer
 * (lerp) and grows over interactive elements. The native cursor is hidden only
 * on fine-pointer (desktop) devices; touch/coarse pointers keep theirs.
 */
export function DifferenceCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = dotRef.current;
    if (!dot) return;

    document.documentElement.classList.add("cursor-none");
    dot.style.opacity = "0";

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let curX = mouseX;
    let curY = mouseY;
    let scale = 1;
    let curScale = 1;
    let raf = 0;
    let seen = false;

    const interactiveSel = "a, button, input, textarea, select, label, [data-cursor]";

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!seen) {
        seen = true;
        curX = mouseX;
        curY = mouseY;
        dot!.style.opacity = "1";
      }
      const overInteractive = !!(e.target as Element | null)?.closest?.(interactiveSel);
      scale = overInteractive ? 2 : 1;
    }

    function onLeave() {
      dot!.style.opacity = "0";
    }
    function onEnter() {
      if (seen) dot!.style.opacity = "1";
    }

    function tick() {
      const ease = reduced ? 1 : 0.18;
      curX += (mouseX - curX) * ease;
      curY += (mouseY - curY) * ease;
      curScale += (scale - curScale) * 0.2;
      dot!.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%) scale(${curScale})`;
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

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 26,
        height: 26,
        borderRadius: "9999px",
        border: "2px solid #1A1A1A",
        // Paper halos on both edges of the ink ring keep it legible on any bg
        boxShadow:
          "0 0 0 1.25px rgba(244,241,234,0.95), inset 0 0 0 1.25px rgba(244,241,234,0.95)",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0,
        willChange: "transform",
        transition: "opacity 200ms ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Center dot — also two-tone for precision on any background */}
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: "9999px",
          backgroundColor: "#1A1A1A",
          boxShadow: "0 0 0 1px rgba(244,241,234,0.95)",
        }}
      />
    </div>
  );
}
