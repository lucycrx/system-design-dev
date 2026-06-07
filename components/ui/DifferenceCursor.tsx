"use client";

import { useEffect, useRef } from "react";

/**
 * Bauhaus difference cursor: a 32px paper-colored circle that lags behind the
 * pointer (lerp), scales 2.5x over interactive elements, and inverts against
 * color blocks via mix-blend-mode: difference. The native cursor is hidden
 * only on fine-pointer (desktop) devices; touch/coarse pointers keep theirs.
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
      scale = overInteractive ? 2.5 : 1;
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
        width: 32,
        height: 32,
        borderRadius: "9999px",
        backgroundColor: "#F4F1EA",
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0,
        willChange: "transform",
        transition: "opacity 200ms ease",
      }}
    />
  );
}
