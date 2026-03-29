import { getAllStories, getAllModules } from "@/lib/content";
import { HomeContent } from "@/components/ui/HomeContent";
import { IcebergHero } from "@/components/ui/IcebergHero";

export default function CurriculumPage() {
  const stories = getAllStories();
  const modules = getAllModules();

  return (
    <div className="min-h-screen bg-bg">
      <IcebergHero />
      <HomeContent stories={stories} modules={modules} initialTab="curriculum" />
    </div>
  );
}
