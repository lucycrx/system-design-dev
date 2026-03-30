import type { DiagramNodeType } from "@/types/story";

export const typeColors: Record<DiagramNodeType, string> = {
  client: "var(--color-blue)",
  server: "var(--color-purple)",
  database: "var(--color-green)",
  cache: "var(--color-orange)",
  queue: "var(--color-queue)",
  "load-balancer": "var(--color-blue)",
  cdn: "var(--color-blue)",
  "api-gateway": "var(--color-purple)",
  auth: "var(--color-pink)",
  "external-service": "var(--color-accent)",
  "background-job": "var(--color-queue)",
  storage: "var(--color-sage)",
  agent: "var(--color-purple)",
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
