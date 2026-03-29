"use client";

import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import type { DiagramNodeType } from "@/types/story";

interface SystemNodeData {
  label: string;
  nodeType: DiagramNodeType;
  explanation: string;
  glossaryLink?: string;
  isNew?: boolean;
  isHighlighted?: boolean;
}

const NODE_WIDTH = 140;
const NODE_HEIGHT = 64;

function NodeIcon({ type }: { type: DiagramNodeType }) {
  const iconClass = "w-5 h-5 flex-shrink-0";

  switch (type) {
    case "client":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <line x1="12" y1="16" x2="12" y2="19" />
          <line x1="8" y1="19" x2="16" y2="19" />
        </svg>
      );
    case "server":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="4" y="3" width="16" height="6" rx="1.5" />
          <rect x="4" y="11" width="16" height="6" rx="1.5" />
          <circle cx="7" cy="6" r="1" fill="currentColor" />
          <circle cx="7" cy="14" r="1" fill="currentColor" />
          <line x1="11" y1="6" x2="17" y2="6" />
          <line x1="11" y1="14" x2="17" y2="14" />
        </svg>
      );
    case "database":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" />
          <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" />
        </svg>
      );
    case "cache":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case "queue":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="3" y="8" width="4" height="8" rx="1" />
          <rect x="10" y="8" width="4" height="8" rx="1" />
          <rect x="17" y="8" width="4" height="8" rx="1" />
          <path d="M7 12h3M14 12h3" strokeDasharray="2 1" />
        </svg>
      );
    case "load-balancer":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="5" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="18" r="2.5" />
          <line x1="12" y1="7.5" x2="6" y2="15.5" />
          <line x1="12" y1="7.5" x2="18" y2="15.5" />
        </svg>
      );
    case "cdn":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="4" ry="9" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      );
    case "api-gateway":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="8" y="3" width="8" height="18" rx="2" />
          <path d="M3 8h5M3 12h5M3 16h5M16 8h5M16 12h5M16 16h5" />
        </svg>
      );
    case "auth":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12l2 2l4-4" />
        </svg>
      );
    case "external-service":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22v-5m3-9V2m2 6a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1zM9 8V2" />
        </svg>
      );
    case "background-job":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="8" x="3" y="3" rx="2" />
          <path d="M7 11v4a2 2 0 0 0 2 2h4" />
          <rect width="8" height="8" x="13" y="13" rx="2" />
        </svg>
      );
    case "storage":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 16h.01m-7.798-4.423a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11zm19.734.436H2.054M6 16h.01" />
        </svg>
      );
    case "agent":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5a3 3 0 1 0-5.997.125a4 4 0 0 0-2.526 5.77a4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
          <path d="M9 13a4.5 4.5 0 0 0 3-4M6.003 5.125A3 3 0 0 0 6.401 6.5m-2.924 4.396a4 4 0 0 1 .585-.396M6 18a4 4 0 0 1-1.967-.516M12 13h4m-4 5h6a2 2 0 0 1 2 2v1M12 8h8m-4 0V5a2 2 0 0 1 2-2" />
          <circle cx="16" cy="13" r=".5" />
          <circle cx="18" cy="3" r=".5" />
          <circle cx="20" cy="21" r=".5" />
          <circle cx="20" cy="8" r=".5" />
        </svg>
      );
  }
}

const typeLabels: Record<DiagramNodeType, string> = {
  client: "client",
  server: "server",
  database: "database",
  cache: "cache",
  queue: "queue",
  "load-balancer": "load balancer",
  cdn: "CDN",
  "api-gateway": "API gateway",
  auth: "auth",
  "external-service": "external service",
  "background-job": "background job",
  storage: "storage",
  agent: "agent",
};

function SystemNodeComponent({ data }: { data: SystemNodeData }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const isHighlighted = data.isHighlighted;
  const isNew = data.isNew;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip((prev) => !prev)}
    >
      <Handle type="target" position={Position.Left} className="!bg-border !border-border !w-1.5 !h-1.5 !-left-1" />
      <Handle type="source" position={Position.Right} className="!bg-border !border-border !w-1.5 !h-1.5 !-right-1" />
      <Handle type="target" position={Position.Top} id="top" className="!bg-border !border-border !w-1.5 !h-1.5 !-top-1" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-border !border-border !w-1.5 !h-1.5 !-bottom-1" />

      {/* Highlight ring */}
      {isHighlighted && (
        <div className="absolute -inset-1.5 border-2 border-accent animate-[diagram-pulse_2s_ease-in-out_infinite]" />
      )}

      {/* Node body */}
      <div
        className={`
          flex items-center gap-2.5 px-3 py-2.5
          bg-surface border
          transition-all duration-200 cursor-pointer
          hover:border-text/30
          ${isHighlighted ? "border-accent/50" : "border-border"}
          ${data.nodeType === "cache" ? "border-dashed" : ""}
          ${isNew ? "animate-[diagram-node-enter_500ms_ease-out_both]" : ""}
        `}
        style={{
          width: NODE_WIDTH,
          minHeight: NODE_HEIGHT,
          animationDelay: isNew ? "200ms" : undefined,
        }}
      >
        <div className="text-text-muted">
          <NodeIcon type={data.nodeType} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-medium text-text leading-tight truncate">
            {data.label}
          </span>
          <span className="text-[10px] font-mono text-text-dim leading-tight">
            {typeLabels[data.nodeType]}
          </span>
        </div>
      </div>

      {/* Explanation tooltip */}
      {showTooltip && data.explanation && (
        <div
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 px-3 py-2 bg-text text-bg text-xs pointer-events-none"
        >
          {data.explanation}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-text rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}

export const SystemNode = memo(SystemNodeComponent);
export { NODE_WIDTH, NODE_HEIGHT };
