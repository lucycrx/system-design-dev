import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getGlossaryTerms,
  getGlossaryTerm,
  getGlossaryMap,
  getConceptDiagrams,
  getStory,
} from "@/lib/content";
import { ConceptDetail } from "@/components/concepts/ConceptDetail";

export function generateStaticParams() {
  return getGlossaryTerms().map((t) => ({ termId: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ termId: string }>;
}): Promise<Metadata> {
  const { termId } = await params;
  const term = getGlossaryTerm(termId);
  if (!term) return { title: "Concept Not Found" };
  return {
    title: term.term,
    description: term.shortDefinition,
    alternates: { canonical: `/concepts/${term.id}` },
  };
}

export default async function ConceptDetailPage({
  params,
}: {
  params: Promise<{ termId: string }>;
}) {
  const { termId } = await params;
  const term = getGlossaryTerm(termId);
  if (!term) notFound();

  const map = getGlossaryMap();
  const related = term.relatedConcepts
    .map((id) => map[id])
    .filter(Boolean)
    .map((t) => ({ id: t.id, term: t.term, category: t.category }));

  const story = term.firstAppearance
    ? getStory(term.firstAppearance.storyId)
    : null;

  const diagrams = getConceptDiagrams();

  return (
    <ConceptDetail
      term={term}
      related={related}
      glossaryMap={map}
      diagrams={diagrams}
      story={
        story && term.firstAppearance
          ? {
              slug: story.slug,
              title: story.title,
              stageId: term.firstAppearance.stageId,
            }
          : null
      }
    />
  );
}
