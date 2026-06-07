import type { ConceptCategory, ConceptVisualKey } from "@/types/story";

export type CategoryShape =
  | "circle"
  | "square"
  | "triangle"
  | "half-circle"
  | "quarter-arc";

const RED = "#D62828";
const BLUE = "#1D4E89";
const YELLOW = "#F4C430";

/**
 * Display metadata for each concept category. Under the Bauhaus system, color
 * is sparse: each category gets one flat primary AND a geometric shape marker
 * (honoring the Itten correspondence square→red, circle→blue, triangle→yellow
 * where it reads cleanly). Cards are ink by default and reveal the primary on
 * hover; the shape carries the identity the rest of the time.
 */
export const CONCEPT_CATEGORIES: {
  id: ConceptCategory;
  label: string;
  color: string;
  shape: CategoryShape;
}[] = [
  { id: "foundations", label: "Foundations", color: BLUE, shape: "circle" },
  { id: "performance", label: "Performance & Scale", color: RED, shape: "square" },
  { id: "data", label: "Data & Consistency", color: YELLOW, shape: "triangle" },
  { id: "reliability", label: "Reliability", color: BLUE, shape: "half-circle" },
  { id: "realtime", label: "Real-time & Async", color: RED, shape: "quarter-arc" },
  { id: "architecture", label: "Architecture", color: YELLOW, shape: "circle" },
  { id: "networking", label: "Networking & APIs", color: YELLOW, shape: "quarter-arc" },
];

export const CATEGORY_BY_ID: Record<
  ConceptCategory,
  { label: string; color: string; shape: CategoryShape }
> = Object.fromEntries(
  CONCEPT_CATEGORIES.map((c) => [
    c.id,
    { label: c.label, color: c.color, shape: c.shape },
  ])
) as Record<ConceptCategory, { label: string; color: string; shape: CategoryShape }>;

/**
 * Maps each glossary term id to its category (grouping) and visual motif
 * (the animated card illustration). Kept here as the single source of truth
 * so terms.json stays focused on copy. Merged in by getGlossaryTerms().
 */
export const CONCEPT_META: Record<
  string,
  { category: ConceptCategory; visual: ConceptVisualKey }
> = {
  // Foundations
  "client-server": { category: "foundations", visual: "converge" },
  server: { category: "foundations", visual: "converge" },
  database: { category: "foundations", visual: "grow" },
  "relational-database": { category: "foundations", visual: "grid" },
  persistence: { category: "foundations", visual: "grow" },
  state: { category: "foundations", visual: "grid" },
  "in-memory-store": { category: "foundations", visual: "waves" },

  // Performance & Scale
  cache: { category: "performance", visual: "waves" },
  cdn: { category: "performance", visual: "waves" },
  "load-balancer": { category: "performance", visual: "distribute" },
  "horizontal-scaling": { category: "performance", visual: "distribute" },
  "vertical-scaling": { category: "performance", visual: "grow" },
  "rate-limiting": { category: "performance", visual: "gate" },
  index: { category: "performance", visual: "grid" },
  pagination: { category: "performance", visual: "grid" },

  // Data & Consistency
  consistency: { category: "data", visual: "curve" },
  "eventual-consistency": { category: "data", visual: "curve" },
  "strong-consistency": { category: "data", visual: "curve" },
  "read-replica": { category: "data", visual: "mirror" },
  sharding: { category: "data", visual: "distribute" },
  "optimistic-locking": { category: "data", visual: "gate" },
  "race-condition": { category: "data", visual: "orbit" },

  // Reliability
  failover: { category: "reliability", visual: "mirror" },
  redundancy: { category: "reliability", visual: "mirror" },
  "health-check": { category: "reliability", visual: "pulse" },
  monitoring: { category: "reliability", visual: "pulse" },
  "graceful-degradation": { category: "reliability", visual: "curve" },
  "circuit-breaker": { category: "reliability", visual: "gate" },
  "disaster-recovery": { category: "reliability", visual: "mirror" },
  timeout: { category: "reliability", visual: "gate" },
  retry: { category: "reliability", visual: "flow" },

  // Real-time & Async
  polling: { category: "realtime", visual: "flow" },
  websockets: { category: "realtime", visual: "flow" },
  "real-time": { category: "realtime", visual: "pulse" },
  async: { category: "realtime", visual: "flow" },
  "message-queue": { category: "realtime", visual: "flow" },
  "event-driven": { category: "realtime", visual: "orbit" },

  // Architecture
  microservices: { category: "architecture", visual: "orbit" },
  monolith: { category: "architecture", visual: "split" },
  "api-gateway": { category: "architecture", visual: "converge" },

  // Networking & APIs
  api: { category: "networking", visual: "converge" },
  http: { category: "networking", visual: "flow" },
  rest: { category: "networking", visual: "grid" },
  dns: { category: "networking", visual: "converge" },
  rpc: { category: "networking", visual: "flow" },
  "tcp-udp": { category: "networking", visual: "split" },
  "reverse-proxy": { category: "networking", visual: "gate" },

  // Data & Consistency (breadth)
  nosql: { category: "data", visual: "grow" },
  "sql-vs-nosql": { category: "data", visual: "mirror" },
  acid: { category: "data", visual: "grid" },
  base: { category: "data", visual: "waves" },
  replication: { category: "data", visual: "mirror" },
  denormalization: { category: "data", visual: "grow" },
  federation: { category: "data", visual: "distribute" },
  "cap-theorem": { category: "data", visual: "split" },

  // Core trade-offs
  "latency-vs-throughput": { category: "performance", visual: "pulse" },
  "performance-vs-scalability": { category: "foundations", visual: "grow" },
  "availability-nines": { category: "reliability", visual: "pulse" },
};

/** Fallback for any term missing from CONCEPT_META. */
export const DEFAULT_CONCEPT_META: {
  category: ConceptCategory;
  visual: ConceptVisualKey;
} = { category: "foundations", visual: "curve" };
