import { getAllModules } from "@/lib/content";
import { CurriculumPanel } from "@/components/ui/HomeContent";

export default function CurriculumPage() {
  const modules = getAllModules();

  return (
    <main className="max-w-5xl mx-auto px-6 pb-24 pt-10">
      <CurriculumPanel modules={modules} />
    </main>
  );
}
