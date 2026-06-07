import type { DiagramNodeType } from "@/types/story";

// Bauhaus: diagrams read as ink line-art. Node types are distinguished by
// their icon + label, not by color; the only primary accents are the
// highlight ring on new/active nodes (handled in SystemNode).
export const typeColors: Record<DiagramNodeType, string> = {
  client: "var(--color-text)",
  server: "var(--color-text)",
  database: "var(--color-text)",
  cache: "var(--color-text)",
  queue: "var(--color-text)",
  "load-balancer": "var(--color-text)",
  cdn: "var(--color-text)",
  "api-gateway": "var(--color-text)",
  auth: "var(--color-text)",
  "external-service": "var(--color-text)",
  "background-job": "var(--color-text)",
  storage: "var(--color-text)",
  agent: "var(--color-text)",
};

export const typeLabels: Record<DiagramNodeType, string> = {
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
