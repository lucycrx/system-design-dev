import { getAllStories } from "@/lib/content";
import { StoriesPageClient } from "@/components/ui/StoriesPageClient";

export default function StoriesPage() {
  const stories = getAllStories();

  return <StoriesPageClient stories={stories} />;
}
