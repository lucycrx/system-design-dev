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
      <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        {/* Top label */}
        <div className="mb-12">
          <span className="label-mono text-text-muted">
            System Design for Builders
          </span>
        </div>

        {/* Main title */}
        <h1
          className={`text-5xl sm:text-7xl lg:text-[5.5rem] font-bold text-text leading-[1.02] tracking-tight mb-10 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          YOUR APP WORKS.
          <br />
          UNTIL IT DOESN&apos;T.
        </h1>

        {/* Two-column bottom: subtitle left, annotation right */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-16 transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-[13px] text-text-muted leading-relaxed">
            AI lets you build fast. But the systems underneath — scaling,
            reliability, data flow — that&apos;s what separates software that
            works from software that lasts.
          </p>

          <div className="border-t border-text/15 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-8">
            <div className="label-mono text-accent mb-2">
              Interactive stories + structured lessons
            </div>
            <div className="font-mono text-[12px] text-text-dim leading-relaxed">
              For vibecoders, PMs, and founders — not just engineers prepping
              for interviews.
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 border-t border-border" />
      </div>
    </header>
  );
}
