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
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-16">
          <span className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted">
            System Design for Builders
          </span>
          <span className="font-mono text-[11px] text-text-dim">
            /25 modules
          </span>
        </div>

        {/* Main title */}
        <h1
          className={`text-5xl sm:text-7xl lg:text-[5.5rem] font-bold text-text leading-[1.02] tracking-tight mb-6 transition-all duration-700 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          WHAT&apos;S BENEATH
          <br />
          YOUR VIBE CODE.
        </h1>

        <p
          className={`font-mono text-[13px] text-text-muted max-w-sm leading-relaxed mb-20 transition-all duration-700 delay-200 ${
            visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          AI lets you build fast. But the systems underneath — scaling,
          reliability, data flow — that&apos;s what separates software that
          works from software that lasts.
        </p>
      </div>

      {/* Iceberg Scene */}
      <div className="relative max-w-6xl mx-auto px-6">
        <div
          className={`relative transition-all duration-1000 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Waterline */}
          <div className="relative">
            {/* Above water annotations */}
            <div className="relative h-[180px] sm:h-[220px]">
              {/* Annotation lines - above water */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
              >
                {/* Connector lines from labels to iceberg tip */}
                <line
                  x1="15%"
                  y1="20%"
                  x2="45%"
                  y2="85%"
                  stroke="var(--color-border)"
                  strokeWidth="1"
                />
                <line
                  x1="50%"
                  y1="10%"
                  x2="50%"
                  y2="85%"
                  stroke="var(--color-border)"
                  strokeWidth="1"
                />
                <line
                  x1="82%"
                  y1="25%"
                  x2="55%"
                  y2="85%"
                  stroke="var(--color-border)"
                  strokeWidth="1"
                />
                {/* Small squares at endpoints */}
                <rect
                  x="44%"
                  y="82%"
                  width="6"
                  height="6"
                  fill="var(--color-text)"
                />
                <rect
                  x="49%"
                  y="82%"
                  width="6"
                  height="6"
                  fill="var(--color-text)"
                />
                <rect
                  x="54%"
                  y="82%"
                  width="6"
                  height="6"
                  fill="var(--color-text)"
                />
              </svg>

              {/* Above water labels */}
              <div className="absolute left-[5%] top-[8%] sm:left-[8%]">
                <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text-muted">
                  Ship fast
                </div>
              </div>
              <div className="absolute left-[38%] top-[0%] sm:left-[42%]">
                <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text">
                  Beautiful UI
                </div>
              </div>
              <div className="absolute right-[8%] top-[14%] sm:right-[12%]">
                <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text-muted">
                  &quot;It works on my machine&quot;
                </div>
              </div>
              <div className="absolute left-[22%] top-[42%]">
                <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text-dim">
                  Prompt &rarr; deploy
                </div>
              </div>
              <div className="absolute right-[20%] top-[48%]">
                <div className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text-dim">
                  MVP in a weekend
                </div>
              </div>
            </div>

            {/* The iceberg tip - above water */}
            <div className="relative flex justify-center">
              <div className="relative">
                {/* Iceberg tip shape */}
                <div
                  className="w-[120px] h-[60px] sm:w-[160px] sm:h-[80px] mx-auto"
                  style={{
                    background:
                      "linear-gradient(180deg, #E8E4DF 0%, #D4CFC8 60%, #C5BFAD 100%)",
                    clipPath: "polygon(30% 0%, 70% 0%, 85% 100%, 15% 100%)",
                  }}
                />
                {/* Vibecode label on the tip */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                  <span className="font-mono text-[10px] tracking-[2px] uppercase text-accent font-medium whitespace-nowrap">
                    [ vibecoding ]
                  </span>
                </div>
              </div>
            </div>

            {/* Water line */}
            <div className="relative h-[3px] bg-gradient-to-r from-transparent via-blue/30 to-transparent my-0">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-[10px] text-blue tracking-widest uppercase">
                waterline
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[10px] text-blue tracking-widest uppercase">
                ~~~
              </div>
            </div>

            {/* Below water - the massive foundation */}
            <div className="relative">
              {/* Iceberg body */}
              <div className="flex justify-center">
                <div
                  className="w-full max-w-[700px] h-[340px] sm:h-[420px] relative"
                  style={{
                    background:
                      "linear-gradient(180deg, #C5BFAD 0%, #8B8573 15%, #6B6558 30%, #4A453B 50%, #3A362E 70%, #2A2722 85%, #1A1A1A 100%)",
                    clipPath:
                      "polygon(18% 0%, 82% 0%, 92% 20%, 95% 40%, 88% 60%, 82% 75%, 70% 88%, 55% 96%, 40% 94%, 28% 85%, 18% 72%, 10% 55%, 8% 38%, 12% 18%)",
                  }}
                >
                  {/* Interior texture lines */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 18px,
                        rgba(255,255,255,0.15) 18px,
                        rgba(255,255,255,0.15) 19px
                      )`,
                    }}
                  />
                </div>
              </div>

              {/* Below water annotations with connector lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
              >
                {/* Left side connectors */}
                <line
                  x1="3%"
                  y1="18%"
                  x2="22%"
                  y2="22%"
                  stroke="var(--color-text-dim)"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <rect
                  x="21.5%"
                  y="21%"
                  width="5"
                  height="5"
                  fill="var(--color-text-dim)"
                  opacity="0.5"
                />

                <line
                  x1="5%"
                  y1="38%"
                  x2="18%"
                  y2="42%"
                  stroke="var(--color-text-dim)"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <rect
                  x="17.5%"
                  y="41%"
                  width="5"
                  height="5"
                  fill="var(--color-text-dim)"
                  opacity="0.5"
                />

                <line
                  x1="3%"
                  y1="60%"
                  x2="20%"
                  y2="58%"
                  stroke="var(--color-text-dim)"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <rect
                  x="19.5%"
                  y="57%"
                  width="5"
                  height="5"
                  fill="var(--color-text-dim)"
                  opacity="0.5"
                />

                <line
                  x1="8%"
                  y1="78%"
                  x2="28%"
                  y2="74%"
                  stroke="var(--color-text-dim)"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <rect
                  x="27.5%"
                  y="73%"
                  width="5"
                  height="5"
                  fill="var(--color-text-dim)"
                  opacity="0.5"
                />

                {/* Right side connectors */}
                <line
                  x1="97%"
                  y1="15%"
                  x2="80%"
                  y2="20%"
                  stroke="var(--color-text-dim)"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <rect
                  x="79%"
                  y="19%"
                  width="5"
                  height="5"
                  fill="var(--color-text-dim)"
                  opacity="0.5"
                />

                <line
                  x1="95%"
                  y1="35%"
                  x2="82%"
                  y2="38%"
                  stroke="var(--color-text-dim)"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <rect
                  x="81.5%"
                  y="37%"
                  width="5"
                  height="5"
                  fill="var(--color-text-dim)"
                  opacity="0.5"
                />

                <line
                  x1="97%"
                  y1="55%"
                  x2="78%"
                  y2="55%"
                  stroke="var(--color-text-dim)"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <rect
                  x="77.5%"
                  y="54%"
                  width="5"
                  height="5"
                  fill="var(--color-text-dim)"
                  opacity="0.5"
                />

                <line
                  x1="92%"
                  y1="72%"
                  x2="72%"
                  y2="72%"
                  stroke="var(--color-text-dim)"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <rect
                  x="71.5%"
                  y="71%"
                  width="5"
                  height="5"
                  fill="var(--color-text-dim)"
                  opacity="0.5"
                />
              </svg>

              {/* Left side labels */}
              <div className="absolute left-[1%] top-[14%] sm:left-[1%]">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text-muted font-medium">
                  01. Caching layers
                </span>
              </div>
              <div className="absolute left-[1%] top-[34%] sm:left-[2%]">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text-muted font-medium">
                  02. Load balancing
                </span>
              </div>
              <div className="absolute left-[1%] top-[56%] sm:left-[1%]">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text-muted font-medium">
                  03. Data modeling
                </span>
              </div>
              <div className="absolute left-[1%] top-[74%] sm:left-[5%]">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text-muted font-medium">
                  04. Replication
                </span>
              </div>

              {/* Right side labels */}
              <div className="absolute right-[1%] top-[11%] sm:right-[1%]">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text-muted font-medium">
                  05. Rate limiting
                </span>
              </div>
              <div className="absolute right-[1%] top-[31%] sm:right-[2%]">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text-muted font-medium">
                  06. Message queues
                </span>
              </div>
              <div className="absolute right-[1%] top-[51%] sm:right-[1%]">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text-muted font-medium">
                  07. Failover
                </span>
              </div>
              <div className="absolute right-[1%] top-[68%] sm:right-[4%]">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-text-muted font-medium">
                  08. Consistency
                </span>
              </div>

              {/* Bottom annotation box */}
              <div className="flex justify-center mt-4 sm:mt-6">
                <div className="border border-border px-5 py-3 bg-surface/80 backdrop-blur-sm max-w-md">
                  <div className="font-mono text-[10px] tracking-[3px] uppercase text-accent mb-1.5">
                    Foundation designed for growth
                  </div>
                  <div className="font-mono text-[11px] text-text-muted leading-relaxed">
                    The 90% you don&apos;t see is what keeps the 10% running.
                    This is what we teach.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-16 sm:h-24" />
      </div>
    </header>
  );
}
