"use client";

import { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setWidth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[2px] z-50"
      style={{
        width: `${width}%`,
        background:
          "linear-gradient(to right, var(--color-accent), var(--color-green))",
        transition: "width 0.05s linear",
      }}
    />
  );
}
