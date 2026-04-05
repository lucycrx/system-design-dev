"use client";

import { useEffect, useRef, useState } from "react";

export function ScrollProgressBar() {
  const [width, setWidth] = useState(0);
  const rafRef = useRef<number>(0);
  const ticking = useRef(false);

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      ticking.current = false;
    }

    function onScroll() {
      if (!ticking.current) {
        rafRef.current = requestAnimationFrame(update);
        ticking.current = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
      className="fixed top-0 left-0 h-[2px] z-50"
      style={{
        width: `${width}%`,
        background:
          "linear-gradient(to right, var(--color-accent), var(--color-green))",
        willChange: "width",
      }}
    />
  );
}
