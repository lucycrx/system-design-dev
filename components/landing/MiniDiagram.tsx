"use client";

import { useState } from "react";

interface Component {
  id: string;
  label: string;
  sublabel: string;
  risk?: "critical" | "high" | "medium";
  connections?: { arrow: string; target: string }[];
}

interface CategoryGroup {
  label: string;
  color: string;
  components: Component[];
}

const DEMO_DATA: CategoryGroup[] = [
  {
    label: "API LAYER",
    color: "hsl(215, 25%, 50%)",
    components: [
      {
        id: "api-routes",
        label: "API Routes",
        sublabel: "Next.js App Router",
        connections: [
          { arrow: "\u2192", target: "PostgreSQL" },
          { arrow: "\u2192", target: "Redis" },
        ],
      },
      {
        id: "auth-middleware",
        label: "Auth Middleware",
        sublabel: "NextAuth.js",
        risk: "medium",
        connections: [{ arrow: "\u2192", target: "PostgreSQL" }],
      },
    ],
  },
  {
    label: "EXTERNAL SERVICES",
    color: "hsl(8, 55%, 55%)",
    components: [
      {
        id: "stripe",
        label: "Stripe",
        sublabel: "Payment processing",
      },
      {
        id: "resend",
        label: "Resend",
        sublabel: "Transactional email",
      },
    ],
  },
  {
    label: "STORAGE",
    color: "hsl(145, 35%, 45%)",
    components: [
      {
        id: "postgres",
        label: "PostgreSQL",
        sublabel: "Primary database",
        risk: "high",
        connections: [{ arrow: "\u2190", target: "API Routes" }],
      },
      {
        id: "redis",
        label: "Redis",
        sublabel: "Session cache",
      },
    ],
  },
];

function ConnTag({
  arrow,
  target,
  color,
  index,
}: {
  arrow: string;
  target: string;
  color: string;
  index: number;
}) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wide text-text-dim border border-dashed border-border px-1.5 py-0.5 bg-white">
      <span
        className="w-1 h-1 rounded-full flex-shrink-0"
        style={{
          backgroundColor: color,
          animation: `connPulse 2s ease-in-out infinite`,
          animationDelay: `${index * 0.3}s`,
        }}
      />
      <span className="opacity-50">{arrow}</span>
      <span className="font-medium text-text">{target}</span>
    </span>
  );
}

function CompCard({
  comp,
  catColor,
  selected,
  onSelect,
}: {
  comp: Component;
  catColor: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const riskColors: Record<string, string> = {
    critical: "hsl(4, 65%, 42%)",
    high: "hsl(24, 75%, 45%)",
    medium: "hsl(42, 75%, 42%)",
  };

  return (
    <button
      onClick={onSelect}
      className="w-full text-left border px-2.5 py-2 cursor-pointer transition-all duration-200 outline-none"
      style={{
        borderColor: selected ? catColor : "hsl(40, 8%, 84%)",
        borderLeftWidth: selected ? 3 : 1,
        borderLeftColor: selected ? catColor : undefined,
        borderTopWidth: comp.risk ? 2 : 1,
        borderTopColor: comp.risk ? riskColors[comp.risk] : undefined,
        background: selected
          ? `color-mix(in oklch, ${catColor} 10%, white)`
          : "hsl(48, 10%, 95%)",
      }}
    >
      <div className="text-[13px] font-semibold text-[hsl(0,0%,15%)] leading-tight">
        {comp.label}
      </div>
      <div className="text-[11px] text-[hsl(0,0%,45%)] mt-0.5">
        {comp.sublabel}
      </div>
      {comp.connections && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {comp.connections.map((conn, i) => (
            <ConnTag
              key={conn.target}
              arrow={conn.arrow}
              target={conn.target}
              color={catColor}
              index={i}
            />
          ))}
        </div>
      )}
    </button>
  );
}

function CategoryGroupCard({
  group,
  selectedId,
  onSelect,
}: {
  group: CategoryGroup;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="border relative bg-white p-2.5"
      style={{ borderColor: "hsl(40, 8%, 84%)" }}
    >
      <span
        className="absolute -top-2 left-2.5 font-mono text-[10px] font-medium tracking-[0.14em] uppercase px-1.5 bg-white z-[1]"
        style={{ color: group.color }}
      >
        {group.label}
      </span>
      <div className="flex flex-col gap-1.5 mt-1">
        {group.components.map((comp) => (
          <CompCard
            key={comp.id}
            comp={comp}
            catColor={group.color}
            selected={selectedId === comp.id}
            onSelect={() => onSelect(comp.id)}
          />
        ))}
      </div>
    </div>
  );
}

function DetailTooltip({
  comp,
  catColor,
}: {
  comp: Component;
  catColor: string;
}) {
  return (
    <div
      className="border bg-white p-3 animate-[fade-up_0.2s_ease-out]"
      style={{ borderColor: "hsl(40, 8%, 84%)" }}
    >
      <div
        className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase mb-1"
        style={{ color: catColor }}
      >
        Selected
      </div>
      <div className="text-[14px] font-semibold text-text mb-0.5">
        {comp.label}
      </div>
      <div className="text-[12px] text-text-dim">{comp.sublabel}</div>
      {comp.risk && (
        <div className="mt-2 pt-2 border-t border-border/60">
          <span
            className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase px-1.5 py-0.5 border"
            style={{
              color:
                comp.risk === "critical"
                  ? "hsl(4, 65%, 42%)"
                  : comp.risk === "high"
                    ? "hsl(24, 75%, 45%)"
                    : "hsl(42, 75%, 42%)",
              borderColor:
                comp.risk === "critical"
                  ? "hsl(4, 65%, 42%)"
                  : comp.risk === "high"
                    ? "hsl(24, 75%, 45%)"
                    : "hsl(42, 75%, 42%)",
              backgroundColor:
                comp.risk === "critical"
                  ? "hsl(4, 65%, 95%)"
                  : comp.risk === "high"
                    ? "hsl(24, 75%, 95%)"
                    : "hsl(42, 75%, 94%)",
            }}
          >
            {comp.risk}
          </span>
        </div>
      )}
    </div>
  );
}

export function MiniDiagram({ className = "" }: { className?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedComp = selectedId
    ? DEMO_DATA.flatMap((g) => g.components).find((c) => c.id === selectedId)
    : null;
  const selectedGroup = selectedId
    ? DEMO_DATA.find((g) => g.components.some((c) => c.id === selectedId))
    : null;

  return (
    <div className={className}>
      <div
        className="border p-4 sm:p-5"
        style={{
          background: "hsl(48, 10%, 95%)",
          borderColor: "hsl(40, 8%, 84%)",
        }}
      >
        {/* Diagram header */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase text-text-dim">
            Architecture Map
          </span>
          <div className="flex gap-1.5">
            <span className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase px-1.5 py-0.5 border" style={{ color: "hsl(24, 75%, 45%)", borderColor: "hsl(24, 75%, 45%)", background: "hsl(24, 75%, 95%)" }}>
              1 HIGH
            </span>
            <span className="font-mono text-[10px] font-medium tracking-[0.14em] uppercase px-1.5 py-0.5 border" style={{ color: "hsl(42, 75%, 42%)", borderColor: "hsl(42, 75%, 42%)", background: "hsl(42, 75%, 94%)" }}>
              1 MEDIUM
            </span>
          </div>
        </div>

        {/* Diagram grid */}
        <div className="flex gap-2.5">
          <div className="flex-1 flex flex-col gap-2.5 min-w-0">
            {/* Top row: API + External */}
            <div className="flex gap-2.5">
              <div className="flex-1">
                <CategoryGroupCard
                  group={DEMO_DATA[0]}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
              <div className="flex-1">
                <CategoryGroupCard
                  group={DEMO_DATA[1]}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
            </div>
            {/* Bottom row: Storage */}
            <CategoryGroupCard
              group={DEMO_DATA[2]}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          {/* Detail panel */}
          {selectedComp && selectedGroup && (
            <div className="w-40 flex-shrink-0 hidden sm:block">
              <DetailTooltip comp={selectedComp} catColor={selectedGroup.color} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
