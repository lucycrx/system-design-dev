import { getAllStories } from "@/lib/content";
import { StoriesPanel } from "@/components/ui/HomeContent";

export default function StoriesPage() {
  const stories = getAllStories();

  return (
    <main className="max-w-5xl mx-auto px-6 pb-24 pt-10">
      <StoriesPanel stories={stories} />
    </main>
  );
}
