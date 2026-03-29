import { getAllStories } from "@/lib/content";
import { StoriesPanel } from "@/components/ui/HomeContent";

export default function StoriesPage() {
  const stories = getAllStories();

  return (
    <main className="max-w-5xl mx-auto px-6 pb-24 pt-10">
      <p className="font-mono text-[12px] text-text-dim mb-10">
        Follow a product as it grows from MVP to production scale. Each story
        introduces system design concepts as they become necessary.
      </p>
      <StoriesPanel stories={stories} />
    </main>
  );
}
