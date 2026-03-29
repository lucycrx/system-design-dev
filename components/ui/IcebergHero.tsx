"use client";

import { useEffect, useState } from "react";

export function IcebergHero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <header className="relative w-full overflow-hidden bg-bg">
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-20">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-20">
          <span className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted">
            System Design for Builders
          </span>
          <span className="font-mono text-[11px] text-text-dim tracking-[2px] uppercase">
            Est. 2025
          </span>
        </div>

        {/* Main title */}
        <h1
          className={`text-5xl sm:text-7xl lg:text-[5.5rem] font-bold text-text leading-[1.02] tracking-tight mb-8 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          YOUR APP WORKS.
          <br />
          UNTIL IT DOESN&apos;T.
        </h1>

        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-8 transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-[13px] text-text-muted max-w-md leading-relaxed">
            AI lets you build fast. But the systems underneath — scaling,
            reliability, data flow — that&apos;s what separates software that
            works from software that lasts.
          </p>

          {/* Iceberg placeholder area */}
          <div className="border border-border px-5 py-3 max-w-xs">
            <div className="font-mono text-[10px] tracking-[3px] uppercase text-accent mb-1">
              Interactive stories + structured lessons
            </div>
            <div className="font-mono text-[11px] text-text-muted leading-relaxed">
              For vibecoders, PMs, and founders — not just engineers prepping
              for interviews.
            </div>
          </div>
        </div>

        {/* Thin rule */}
        <div className="mt-16 border-t border-text/10" />
      </div>
    </header>
  );
}
