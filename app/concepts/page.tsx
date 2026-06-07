import type { Metadata } from "next";
import { getGlossaryTerms } from "@/lib/content";
import { ConceptsGrid } from "@/components/concepts/ConceptsGrid";

export const metadata: Metadata = {
  title: "Concepts — System Design School",
  description:
    "Browse the building blocks of system design — caching, load balancing, sharding, queues, and more — each explained in plain English with a real-world analogy.",
};

export default function ConceptsPage() {
  const terms = getGlossaryTerms();
  return <ConceptsGrid terms={terms} />;
}
