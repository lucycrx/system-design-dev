import type { Metadata } from "next";
import { getAllModules } from "@/lib/content";
import { CurriculumPageClient } from "@/components/ui/CurriculumPageClient";

export const metadata: Metadata = {
  title: "Curriculum",
  description:
    "Structured lessons on system design, from fundamentals to advanced patterns — organized by topic so you can start at the beginning or jump to what you need.",
  alternates: { canonical: "/curriculum" },
};

export default function CurriculumPage() {
  const modules = getAllModules();

  return <CurriculumPageClient modules={modules} />;
}
