import type { ConceptCategory, ConceptVisualKey } from "@/types/story";

/**
 * Display metadata for each concept category. Drives the filter chips on
 * /concepts and the category tag on each card. Colors reference the semantic
 * tokens defined in app/globals.css.
 */
export const CONCEPT_CATEGORIES: {
  id: ConceptCategory;
  label: string;
  color: string;
}[] = [
  { id: "foundations", label: "Foundations", color: "var(--color-accent)" },
  { id: "performance", label: "Performance & Scale", color: "var(--color-green)" },
  { id: "data", label: "Data & Consistency", color: "var(--color-purple)" },
  { id: "reliability", label: "Reliability", color: "var(--color-orange)" },
  { id: "realtime", label: "Real-time & Async", color: "var(--color-queue)" },
  { id: "architecture", label: "Architecture", color: "var(--color-blue)" },
];

export const CATEGORY_BY_ID: Record<ConceptCategory, { label: string; color: string }> =
  Object.fromEntries(
    CONCEPT_CATEGORIES.map((c) => [c.id, { label: c.label, color: c.color }])
  ) as Record<ConceptCategory, { label: string; color: string }>;

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
};

/** Fallback for any term missing from CONCEPT_META. */
export const DEFAULT_CONCEPT_META: {
  category: ConceptCategory;
  visual: ConceptVisualKey;
} = { category: "foundations", visual: "curve" };
