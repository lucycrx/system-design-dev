import type { CSSProperties, ReactNode } from "react";

/**
 * Static, filled-Bauhaus concept icons — one distinct flat SVG per concept.
 * 100% solid fills (no strokes): arrows are bar+triangle, loops are annulus
 * rings with a paper notch, dividers are paper-filled bars. Ink mass uses
 * `currentColor` (driven by `color`); a single accent element uses `accent`.
 * No animation — 40 of these render for free. ConceptCard transitions `color`
 * ink->primary on hover for the reveal.
 */

interface Props {
  id: string;
  color?: string;
  accent?: string;
  className?: string;
}

const PAPER = "#F4F1EA";

// Filled ring (annulus) via evenodd fill — solid, no stroke.
function ring(cx: number, cy: number, R: number, r: number): string {
  return (
    `M${cx - R} ${cy} a${R} ${R} 0 1 0 ${2 * R} 0 a${R} ${R} 0 1 0 ${-2 * R} 0 Z ` +
    `M${cx - r} ${cy} a${r} ${r} 0 1 1 ${2 * r} 0 a${r} ${r} 0 1 1 ${-2 * r} 0 Z`
  );
}

function icon(id: string, a: string): ReactNode {
  const ink = "currentColor";
  switch (id) {
    // ---------- Foundations ----------
    case "client-server":
      return (
        <>
          <circle cx="26" cy="50" r="13" fill={ink} />
          <rect x="60" y="35" width="30" height="30" fill={ink} />
          <rect x="40" y="46" width="20" height="8" fill={a} />
        </>
      );
    case "server":
      return (
        <>
          <rect x="32" y="28" width="36" height="14" fill={a} />
          <rect x="32" y="46" width="36" height="14" fill={ink} />
          <rect x="32" y="64" width="36" height="14" fill={ink} />
          <circle cx="40" cy="53" r="2.4" fill={a} />
          <circle cx="40" cy="71" r="2.4" fill={PAPER} />
        </>
      );
    case "database":
      return (
        <>
          <path d="M26 32 V68 a24 8 0 0 0 48 0 V32 Z" fill={ink} />
          <ellipse cx="50" cy="32" rx="24" ry="8" fill={a} />
        </>
      );
    case "relational-database":
      return (
        <>
          <rect x="18" y="34" width="26" height="32" fill={ink} />
          <rect x="56" y="34" width="26" height="32" fill={ink} />
          <rect x="44" y="46" width="12" height="8" fill={a} />
        </>
      );
    case "persistence":
      return (
        <>
          <rect x="26" y="26" width="48" height="48" fill={ink} />
          <rect x="38" y="38" width="24" height="24" fill={a} />
        </>
      );
    case "state":
      return (
        <>
          <rect x="26" y="26" width="48" height="48" rx="6" fill={ink} />
          <circle cx="50" cy="50" r="9" fill={a} />
        </>
      );
    case "in-memory-store":
      return (
        <>
          <rect x="30" y="34" width="40" height="32" fill={ink} />
          <g fill={ink}>
            <rect x="36" y="27" width="4" height="8" /><rect x="48" y="27" width="4" height="8" /><rect x="60" y="27" width="4" height="8" />
            <rect x="36" y="65" width="4" height="8" /><rect x="48" y="65" width="4" height="8" /><rect x="60" y="65" width="4" height="8" />
          </g>
          <path d="M52 40 L44 52 H51 L48 60 L58 46 H51 Z" fill={a} />
        </>
      );

    // ---------- Performance & Scale ----------
    case "cache":
      return (
        <>
          <rect x="36" y="26" width="36" height="36" fill={ink} />
          <rect x="26" y="44" width="28" height="28" fill={a} />
        </>
      );
    case "cdn":
      return (
        <>
          <circle cx="50" cy="50" r="11" fill={ink} />
          <g fill={a}>
            <rect x="44" y="16" width="12" height="12" /><rect x="70" y="30" width="12" height="12" />
            <rect x="70" y="58" width="12" height="12" /><rect x="44" y="72" width="12" height="12" />
            <rect x="18" y="58" width="12" height="12" /><rect x="18" y="30" width="12" height="12" />
          </g>
        </>
      );
    case "load-balancer":
      return (
        <>
          <rect x="14" y="42" width="16" height="16" fill={a} />
          <polygon points="34,50 58,32 58,68" fill={ink} />
          <g fill={ink}>
            <rect x="70" y="22" width="16" height="12" /><rect x="70" y="44" width="16" height="12" /><rect x="70" y="66" width="16" height="12" />
          </g>
        </>
      );
    case "horizontal-scaling":
      return (
        <>
          <g fill={ink}>
            <rect x="22" y="34" width="16" height="32" /><rect x="42" y="34" width="16" height="32" />
          </g>
          <rect x="62" y="34" width="16" height="32" fill={a} />
        </>
      );
    case "vertical-scaling":
      return (
        <>
          <rect x="38" y="44" width="24" height="34" fill={ink} />
          <rect x="38" y="30" width="24" height="12" fill={a} />
          <polygon points="50,14 60,28 40,28" fill={a} />
        </>
      );
    case "rate-limiting":
      return (
        <>
          <polygon points="24,26 76,26 57,52 57,64 43,64 43,52" fill={ink} />
          <g fill={ink}><circle cx="34" cy="20" r="3.5" /><circle cx="50" cy="20" r="3.5" /><circle cx="66" cy="20" r="3.5" /></g>
          <circle cx="50" cy="78" r="5" fill={a} />
        </>
      );
    case "index":
      return (
        <>
          <g fill={ink}>
            <rect x="22" y="28" width="44" height="7" /><rect x="22" y="42" width="44" height="7" />
            <rect x="22" y="56" width="44" height="7" /><rect x="22" y="70" width="30" height="7" />
          </g>
          <path d="M70 24 H82 V52 L76 45 L70 52 Z" fill={a} />
        </>
      );
    case "pagination":
      return (
        <>
          <g fill={ink}>
            <rect x="18" y="40" width="16" height="20" /><rect x="38" y="40" width="16" height="20" /><rect x="78" y="40" width="8" height="20" />
          </g>
          <rect x="58" y="40" width="16" height="20" fill={a} />
        </>
      );

    // ---------- Data & Consistency ----------
    case "read-replica":
      return (
        <>
          <rect x="22" y="28" width="30" height="30" fill={ink} />
          <rect x="48" y="44" width="30" height="30" fill={a} />
        </>
      );
    case "consistency":
      return (
        <>
          <circle cx="28" cy="50" r="12" fill={ink} />
          <circle cx="72" cy="50" r="12" fill={ink} />
          <g fill={a}><rect x="42" y="44" width="16" height="4" /><rect x="42" y="52" width="16" height="4" /></g>
        </>
      );
    case "eventual-consistency":
      return (
        <>
          <circle cx="28" cy="50" r="12" fill={ink} />
          <circle cx="72" cy="50" r="12" fill={ink} />
          <g fill={a}><rect x="40" y="48" width="6" height="4" /><rect x="49" y="48" width="6" height="4" /></g>
          <polygon points="58,45 64,50 58,55" fill={a} />
        </>
      );
    case "strong-consistency":
      return (
        <>
          <circle cx="28" cy="50" r="12" fill={ink} />
          <circle cx="72" cy="50" r="12" fill={ink} />
          <rect x="40" y="46" width="20" height="8" fill={a} />
        </>
      );
    case "sharding":
      return (
        <>
          <circle cx="50" cy="50" r="27" fill={ink} />
          <path d="M50 50 L50 23 A27 27 0 0 1 73 63 Z" fill={a} />
          <g fill={PAPER}>
            <rect x="48.5" y="23" width="3" height="27" />
            <rect x="48.5" y="23" width="3" height="27" transform="rotate(120 50 50)" />
            <rect x="48.5" y="23" width="3" height="27" transform="rotate(240 50 50)" />
          </g>
        </>
      );
    case "optimistic-locking":
      return (
        <>
          <rect x="26" y="24" width="40" height="52" fill={ink} />
          <path d="M66 24 H82 V44 L74 37 L66 44 Z" fill={a} />
        </>
      );
    case "race-condition":
      return (
        <>
          <g fill={ink}>
            <rect x="14" y="48" width="22" height="4" /><polygon points="36,45 42,50 36,55" />
            <rect x="64" y="48" width="22" height="4" /><polygon points="64,45 58,50 64,55" />
          </g>
          <rect x="45" y="45" width="10" height="10" fill={a} />
        </>
      );

    // ---------- Reliability ----------
    case "failover":
      return (
        <>
          <rect x="20" y="34" width="28" height="28" fill={ink} />
          <g fill={PAPER}>
            <rect x="32" y="36" width="4" height="24" transform="rotate(45 34 48)" />
            <rect x="32" y="36" width="4" height="24" transform="rotate(-45 34 48)" />
          </g>
          <rect x="56" y="40" width="26" height="28" fill={a} />
        </>
      );
    case "redundancy":
      return (
        <>
          <rect x="24" y="24" width="34" height="34" fill={ink} />
          <rect x="44" y="44" width="34" height="34" fill={a} />
        </>
      );
    case "health-check":
      return (
        <>
          <rect x="24" y="24" width="52" height="52" fill={ink} />
          <polygon points="35,50 45,60 65,38 70,43 45,70 30,55" fill={a} />
        </>
      );
    case "monitoring":
      return (
        <>
          <rect x="22" y="26" width="56" height="42" fill={ink} />
          <g fill={a}><rect x="32" y="46" width="7" height="12" /><rect x="44" y="40" width="7" height="18" /><rect x="56" y="34" width="7" height="24" /></g>
          <rect x="40" y="72" width="20" height="5" fill={ink} />
        </>
      );
    case "graceful-degradation":
      return (
        <>
          <g fill={ink}>
            <rect x="20" y="30" width="16" height="46" /><rect x="40" y="44" width="16" height="32" />
          </g>
          <rect x="60" y="58" width="16" height="18" fill={a} />
        </>
      );
    case "circuit-breaker":
      return (
        <>
          <circle cx="24" cy="58" r="6" fill={ink} />
          <circle cx="76" cy="58" r="6" fill={ink} />
          <g fill={ink}><rect x="24" y="56" width="16" height="4" /><rect x="60" y="56" width="16" height="4" /></g>
          <polygon points="38,62 60,32 64,35 42,65" fill={a} />
        </>
      );
    case "disaster-recovery":
      return (
        <>
          <path d={ring(50, 50, 28, 21)} fillRule="evenodd" fill={a} />
          <rect x="50" y="18" width="16" height="16" fill={PAPER} />
          <polygon points="50,16 50,36 66,26" fill={a} />
          <rect x="40" y="42" width="20" height="16" fill={ink} />
        </>
      );
    case "timeout":
      return (
        <>
          <circle cx="50" cy="52" r="26" fill={ink} />
          <path d="M50 52 L50 32 A20 20 0 0 1 67 60 Z" fill={a} />
          <rect x="44" y="16" width="12" height="6" fill={ink} />
        </>
      );
    case "retry":
      return (
        <>
          <path d={ring(50, 50, 26, 19)} fillRule="evenodd" fill={a} />
          <rect x="50" y="18" width="14" height="14" fill={PAPER} />
          <polygon points="50,16 50,34 64,25" fill={a} />
          <circle cx="50" cy="50" r="6" fill={ink} />
        </>
      );

    // ---------- Real-time & Async ----------
    case "polling":
      return (
        <>
          <path d={ring(50, 50, 26, 19)} fillRule="evenodd" fill={ink} />
          <rect x="50" y="18" width="14" height="14" fill={PAPER} />
          <polygon points="50,16 50,34 64,25" fill={ink} />
          <circle cx="50" cy="50" r="6" fill={a} />
        </>
      );
    case "websockets":
      return (
        <>
          <circle cx="22" cy="50" r="10" fill={ink} />
          <circle cx="78" cy="50" r="10" fill={ink} />
          <rect x="36" y="48" width="28" height="4" fill={a} />
          <polygon points="40,42 32,50 40,58" fill={a} />
          <polygon points="60,42 68,50 60,58" fill={a} />
        </>
      );
    case "real-time":
      return (
        <>
          <circle cx="50" cy="50" r="7" fill={ink} />
          <path d={ring(50, 50, 17, 13)} fillRule="evenodd" fill={a} />
          <path d={ring(50, 50, 27, 23)} fillRule="evenodd" fill={a} opacity="0.45" />
        </>
      );
    case "async":
      return (
        <>
          <g fill={ink}><rect x="20" y="36" width="36" height="4" /><polygon points="56,33 64,38 56,43" /></g>
          <g fill={a}><rect x="36" y="60" width="36" height="4" /><polygon points="36,57 28,62 36,67" /></g>
        </>
      );
    case "message-queue":
      return (
        <>
          <g fill={ink}><rect x="16" y="40" width="16" height="20" /><rect x="36" y="40" width="16" height="20" /><rect x="56" y="40" width="16" height="20" /></g>
          <g fill={a}><rect x="76" y="48" width="10" height="4" /><polygon points="84,45 92,50 84,55" /></g>
        </>
      );
    case "event-driven":
      return (
        <>
          <rect x="42" y="42" width="16" height="16" fill={ink} />
          <g fill={a}>
            <rect x="48" y="22" width="4" height="12" /><polygon points="50,14 44,24 56,24" />
            <rect x="66" y="48" width="12" height="4" /><polygon points="86,50 76,44 76,56" />
            <rect x="48" y="66" width="4" height="12" /><polygon points="50,86 44,76 56,76" />
            <rect x="22" y="48" width="12" height="4" /><polygon points="14,50 24,44 24,56" />
          </g>
        </>
      );

    // ---------- Architecture ----------
    case "microservices":
      return (
        <>
          <rect x="26" y="26" width="20" height="20" fill={ink} />
          <rect x="54" y="26" width="20" height="20" fill={ink} />
          <rect x="26" y="54" width="20" height="20" fill={ink} />
          <rect x="54" y="54" width="20" height="20" fill={a} />
        </>
      );
    case "monolith":
      return (
        <>
          <rect x="28" y="22" width="44" height="56" fill={ink} />
          <rect x="38" y="34" width="24" height="8" fill={a} />
        </>
      );
    case "api-gateway":
      return (
        <>
          <g fill={ink}><rect x="14" y="28" width="16" height="9" /><rect x="14" y="46" width="16" height="9" /><rect x="14" y="64" width="16" height="9" /></g>
          <polygon points="34,32 48,46 48,54 34,68" fill={ink} />
          <rect x="48" y="28" width="9" height="44" fill={a} />
          <g fill={ink}><rect x="60" y="48" width="14" height="4" /><polygon points="80,50 72,45 72,55" /></g>
        </>
      );

    // ---------- Networking & APIs ----------
    case "api":
      return (
        <>
          <rect x="30" y="30" width="40" height="40" fill={ink} />
          <rect x="42" y="16" width="6" height="14" fill={a} />
          <rect x="54" y="16" width="6" height="14" fill={a} />
          <rect x="42" y="70" width="6" height="14" fill={a} />
          <rect x="54" y="70" width="6" height="14" fill={a} />
        </>
      );
    case "http":
      return (
        <>
          <g fill={ink}>
            <rect x="24" y="38" width="34" height="6" />
            <polygon points="72,41 58,33 58,49" />
          </g>
          <g fill={a}>
            <rect x="42" y="58" width="34" height="6" />
            <polygon points="28,61 42,53 42,69" />
          </g>
        </>
      );
    case "rest":
      return (
        <>
          <rect x="26" y="30" width="48" height="12" fill={a} />
          <rect x="26" y="46" width="48" height="12" fill={ink} />
          <rect x="26" y="62" width="48" height="12" fill={ink} />
        </>
      );
    case "dns":
      return (
        <>
          <circle cx="42" cy="50" r="22" fill={ink} />
          <rect x="64" y="45" width="22" height="10" fill={a} />
        </>
      );
    case "rpc":
      return (
        <>
          <rect x="16" y="38" width="22" height="24" fill={ink} />
          <rect x="62" y="38" width="22" height="24" fill={ink} />
          <g fill={a}>
            <rect x="40" y="47" width="14" height="6" />
            <polygon points="62,50 52,44 52,56" />
          </g>
        </>
      );
    case "tcp-udp":
      return (
        <>
          <rect x="20" y="38" width="60" height="8" fill={ink} />
          <g fill={a}>
            <rect x="20" y="56" width="14" height="8" />
            <rect x="43" y="56" width="14" height="8" />
            <rect x="66" y="56" width="14" height="8" />
          </g>
        </>
      );
    case "reverse-proxy":
      return (
        <>
          <rect x="50" y="28" width="34" height="44" fill={ink} />
          <rect x="30" y="22" width="10" height="56" fill={a} />
        </>
      );

    // ---------- Data & Consistency (breadth) ----------
    case "nosql":
      return (
        <>
          <circle cx="36" cy="38" r="11" fill={ink} />
          <circle cx="65" cy="44" r="9" fill={ink} />
          <circle cx="48" cy="65" r="13" fill={a} />
        </>
      );
    case "sql-vs-nosql":
      return (
        <>
          <rect x="20" y="30" width="26" height="40" fill={ink} />
          <circle cx="66" cy="40" r="7" fill={a} />
          <circle cx="66" cy="60" r="7" fill={a} />
        </>
      );
    case "acid":
      return (
        <>
          <polygon points="40,26 60,26 60,44 78,74 22,74" fill={ink} />
          <rect x="32" y="60" width="36" height="12" fill={a} />
        </>
      );
    case "base":
      return (
        <>
          <rect x="22" y="58" width="56" height="16" fill={ink} />
          <path d="M22 48 q14 -14 28 0 q14 14 28 0 v6 H22 Z" fill={a} />
        </>
      );
    case "replication":
      return (
        <>
          <rect x="20" y="34" width="24" height="32" fill={ink} />
          <rect x="56" y="34" width="24" height="32" fill={ink} />
          <g fill={a}>
            <rect x="44" y="43" width="12" height="5" />
            <rect x="44" y="53" width="12" height="5" />
          </g>
        </>
      );
    case "denormalization":
      return (
        <>
          <rect x="24" y="28" width="34" height="34" fill={ink} />
          <rect x="42" y="46" width="34" height="34" fill={a} />
        </>
      );
    case "federation":
      return (
        <>
          <circle cx="50" cy="50" r="24" fill={ink} />
          <path d="M50 50 L50 26 A24 24 0 0 1 74 50 Z" fill={a} />
        </>
      );
    case "cap-theorem":
      return (
        <>
          <polygon points="50,24 78,72 22,72" fill={ink} />
          <circle cx="50" cy="26" r="8" fill={a} />
        </>
      );

    // ---------- Core trade-offs ----------
    case "latency-vs-throughput":
      return (
        <>
          <rect x="20" y="44" width="60" height="14" fill={ink} />
          <circle cx="32" cy="51" r="5" fill={a} />
        </>
      );
    case "performance-vs-scalability":
      return (
        <>
          <g fill={ink}>
            <rect x="24" y="54" width="12" height="20" />
            <rect x="44" y="42" width="12" height="32" />
          </g>
          <rect x="64" y="28" width="12" height="46" fill={a} />
        </>
      );
    case "availability-nines":
      return (
        <>
          <g fill={ink}>
            <rect x="22" y="42" width="10" height="16" />
            <rect x="38" y="42" width="10" height="16" />
            <rect x="54" y="42" width="10" height="16" />
          </g>
          <rect x="70" y="42" width="10" height="16" fill={a} />
        </>
      );

    default:
      return (
        <>
          <rect x="28" y="28" width="44" height="44" fill={ink} />
          <circle cx="50" cy="50" r="8" fill={a} />
        </>
      );
  }
}

export function ConceptIcon({ id, color, accent, className }: Props) {
  const style: CSSProperties = {
    color: color ?? "var(--color-text)",
    width: "100%",
    height: "100%",
    display: "block",
    transition: "color 500ms cubic-bezier(0.16,1,0.3,1)",
  };
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="presentation"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={style}
    >
      {icon(id, accent ?? "currentColor")}
    </svg>
  );
}
