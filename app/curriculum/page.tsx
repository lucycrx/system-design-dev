import { getAllModules } from "@/lib/content";
import { CurriculumPanel } from "@/components/ui/HomeContent";

export default function CurriculumPage() {
  const modules = getAllModules();

  return (
    <main className="max-w-5xl mx-auto px-6 pb-24 pt-10">
      <p className="font-mono text-[12px] text-text-dim mb-10">
        Structured lessons organized by topic. Start from the basics or jump to
        what you need.
      </p>
      <CurriculumPanel modules={modules} />
    </main>
  );
}
