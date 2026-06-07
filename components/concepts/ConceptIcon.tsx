import type { CSSProperties, ReactNode } from "react";

/**
 * Static, filled-Bauhaus concept icons — one distinct flat SVG per concept.
 * Ink mass uses `currentColor` (driven by `color`); a single accent element
 * uses `accent`. No animation: 40 of these render for free. In the grid,
 * ConceptCard transitions `color` ink->primary on hover for the reveal feel.
 */

interface Props {
  id: string;
  /** Ink mass color (via currentColor). Defaults to ink. */
  color?: string;
  /** Single accent element color. Defaults to currentColor (monochrome). */
  accent?: string;
  className?: string;
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
          <circle cx="40" cy="71" r="2.4" fill="#F4F1EA" />
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
          <g stroke={ink} strokeWidth="3">
            <line x1="38" y1="34" x2="38" y2="26" />
            <line x1="50" y1="34" x2="50" y2="26" />
            <line x1="62" y1="34" x2="62" y2="26" />
            <line x1="38" y1="74" x2="38" y2="66" />
            <line x1="50" y1="74" x2="50" y2="66" />
            <line x1="62" y1="74" x2="62" y2="66" />
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
          <g stroke={ink} strokeWidth="2.5">
            <line x1="50" y1="50" x2="50" y2="24" /><line x1="50" y1="50" x2="73" y2="37" />
            <line x1="50" y1="50" x2="73" y2="63" /><line x1="50" y1="50" x2="50" y2="76" />
            <line x1="50" y1="50" x2="27" y2="63" /><line x1="50" y1="50" x2="27" y2="37" />
          </g>
          <circle cx="50" cy="50" r="9" fill={ink} />
          <g fill={a}>
            <rect x="44" y="18" width="12" height="12" /><rect x="69" y="31" width="11" height="11" />
            <rect x="69" y="58" width="11" height="11" /><rect x="44" y="70" width="12" height="12" />
            <rect x="20" y="58" width="11" height="11" /><rect x="20" y="31" width="11" height="11" />
          </g>
        </>
      );
    case "load-balancer":
      return (
        <>
          <path d="M22 50 L70 28 M22 50 L70 50 M22 50 L70 72" stroke={ink} strokeWidth="2.5" fill="none" />
          <rect x="14" y="42" width="16" height="16" fill={a} />
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
          <path d="M50 14 L60 28 H40 Z" fill={a} />
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
          <path d="M40 50 H60" stroke={a} strokeWidth="4" strokeDasharray="5 4" />
          <path d="M55 45 L60 50 L55 55" fill="none" stroke={a} strokeWidth="4" />
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
          <g stroke="#F4F1EA" strokeWidth="3">
            <line x1="50" y1="50" x2="50" y2="23" /><line x1="50" y1="50" x2="73" y2="63" /><line x1="50" y1="50" x2="27" y2="63" />
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
          <path d="M14 50 H40 M33 44 L40 50 L33 56" stroke={ink} strokeWidth="3.5" fill="none" />
          <path d="M86 50 H60 M67 44 L60 50 L67 56" stroke={ink} strokeWidth="3.5" fill="none" />
          <rect x="44" y="44" width="12" height="12" fill={a} />
        </>
      );

    // ---------- Reliability ----------
    case "failover":
      return (
        <>
          <rect x="20" y="34" width="28" height="28" fill={ink} />
          <g stroke="#F4F1EA" strokeWidth="3"><line x1="26" y1="40" x2="42" y2="56" /><line x1="42" y1="40" x2="26" y2="56" /></g>
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
          <rect x="22" y="28" width="56" height="44" fill="none" stroke={ink} strokeWidth="3" />
          <path d="M28 50 H40 L46 36 L54 64 L60 50 H72" fill="none" stroke={a} strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" />
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
          <line x1="24" y1="58" x2="40" y2="58" stroke={ink} strokeWidth="3.5" />
          <line x1="60" y1="58" x2="76" y2="58" stroke={ink} strokeWidth="3.5" />
          <line x1="40" y1="58" x2="64" y2="30" stroke={a} strokeWidth="3.5" />
        </>
      );
    case "disaster-recovery":
      return (
        <>
          <rect x="34" y="38" width="32" height="32" fill={ink} />
          <path d="M30 38 A22 22 0 1 1 32 58" fill="none" stroke={a} strokeWidth="3.5" />
          <path d="M24 50 L30 38 L37 47" fill="none" stroke={a} strokeWidth="3.5" strokeLinejoin="round" />
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
          <path d="M72 50 A22 22 0 1 1 64 33" fill="none" stroke={ink} strokeWidth="4" />
          <path d="M54 28 L66 31 L62 43" fill="none" stroke={a} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="50" cy="50" r="6" fill={a} />
        </>
      );

    // ---------- Real-time & Async ----------
    case "polling":
      return (
        <>
          <circle cx="50" cy="52" r="22" fill="none" stroke={ink} strokeWidth="4" />
          <path d="M50 52 V38 M50 52 H62" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          <path d="M70 30 L74 42 L62 40" fill={a} />
        </>
      );
    case "websockets":
      return (
        <>
          <circle cx="22" cy="50" r="10" fill={ink} />
          <circle cx="78" cy="50" r="10" fill={ink} />
          <rect x="34" y="46" width="32" height="8" fill={a} />
          <path d="M40 38 L32 50 L40 62 M60 38 L68 50 L60 62" fill="none" stroke={a} strokeWidth="3.5" />
        </>
      );
    case "real-time":
      return (
        <>
          <circle cx="50" cy="50" r="7" fill={ink} />
          <circle cx="50" cy="50" r="17" fill="none" stroke={a} strokeWidth="3.5" />
          <circle cx="50" cy="50" r="27" fill="none" stroke={a} strokeWidth="3.5" opacity="0.5" />
        </>
      );
    case "async":
      return (
        <>
          <path d="M20 38 H64 M57 32 L64 38 L57 44" stroke={ink} strokeWidth="3.5" fill="none" />
          <path d="M36 62 H80 M43 56 L36 62 L43 68" stroke={a} strokeWidth="3.5" fill="none" />
        </>
      );
    case "message-queue":
      return (
        <>
          <g fill={ink}><rect x="16" y="40" width="16" height="20" /><rect x="36" y="40" width="16" height="20" /><rect x="56" y="40" width="16" height="20" /></g>
          <path d="M76 50 L88 50 M83 45 L88 50 L83 55" fill="none" stroke={a} strokeWidth="3.5" />
        </>
      );
    case "event-driven":
      return (
        <>
          <rect x="40" y="40" width="20" height="20" fill={ink} />
          <g stroke={a} strokeWidth="3.5" fill="none">
            <path d="M50 36 V20 M45 26 L50 20 L55 26" />
            <path d="M64 50 H80 M74 45 L80 50 L74 55" />
            <path d="M50 64 V80 M45 74 L50 80 L55 74" />
            <path d="M36 50 H20 M26 45 L20 50 L26 55" />
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
          <path d="M30 32 L48 50 M30 50 L48 50 M30 68 L48 50" stroke={ink} strokeWidth="2.5" fill="none" />
          <rect x="48" y="28" width="9" height="44" fill={a} />
          <path d="M57 50 L72 50 M67 45 L72 50 L67 55" stroke={ink} strokeWidth="2.5" fill="none" />
        </>
      );

    default:
      // Fallback: a simple filled square with an accent dot.
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
