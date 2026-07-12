import type { Metadata } from "next";
import { getAllStories } from "@/lib/content";
import { StoriesPageClient } from "@/components/ui/StoriesPageClient";

export const metadata: Metadata = {
  title: "Build Stories",
  description:
    "Follow a real product from first deploy to production crisis. Each stage introduces a system design concept exactly when the story demands it.",
  alternates: { canonical: "/stories" },
};

export default function StoriesPage() {
  const stories = getAllStories();

  return <StoriesPageClient stories={stories} />;
}
