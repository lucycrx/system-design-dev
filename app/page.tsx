import Link from "next/link";
import { getAllStories, getAllModules } from "@/lib/content";
import { IcebergHero } from "@/components/ui/IcebergHero";
import { PathCards } from "@/components/ui/PathCards";

export default function HomePage() {
  const stories = getAllStories();
  const modules = getAllModules();

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-bg">
      <IcebergHero />

      {/* Two learning paths */}
      <section className="max-w-5xl mx-auto px-6 pb-24 pt-10">
        <p className="label-mono text-text-muted mb-10">Choose your path</p>

        <PathCards
          storyCount={stories.length}
          moduleCount={modules.length}
          lessonCount={totalLessons}
        />
      </section>
    </div>
  );
}
