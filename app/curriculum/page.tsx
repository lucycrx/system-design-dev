import { getAllModules } from "@/lib/content";
import { CurriculumPageClient } from "@/components/ui/CurriculumPageClient";

export default function CurriculumPage() {
  const modules = getAllModules();

  return <CurriculumPageClient modules={modules} />;
}
