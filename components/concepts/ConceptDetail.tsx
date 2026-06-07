import Link from "next/link";
import type { ConceptCategory, GlossaryTerm } from "@/types/story";
import { CATEGORY_BY_ID } from "@/lib/conceptMeta";
import { ConceptVisual } from "./ConceptVisual";

interface RelatedConcept {
  id: string;
  term: string;
  category: ConceptCategory;
}

interface Props {
  term: GlossaryTerm;
  related: RelatedConcept[];
  story: { slug: string; title: string; stageId: string } | null;
}

export function ConceptDetail({ term, related, story }: Props) {
  const category = CATEGORY_BY_ID[term.category];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 sm:py-14">
      {/* Back link */}
      <Link
        href="/concepts"
        className="label-mono text-text-dim hover:text-text transition-colors inline-flex items-center gap-1.5 mb-8"
      >
        <span>&larr;</span> All Concepts
      </Link>

      {/* Hero visual */}
      <div
        className="h-44 sm:h-56 border border-border flex items-center justify-center px-10 py-6 mb-7"
        style={{ backgroundColor: `${category.color}0D` }}
      >
        <div className="w-full max-w-xs h-full">
          <ConceptVisual visual={term.visual} color={category.color} playing />
        </div>
      </div>

      {/* Title */}
      <span className="label-mono" style={{ color: category.color }}>
        {category.label}
      </span>
      <h1 className="heading-editorial text-3xl sm:text-4xl text-text mt-2 mb-4">
        {term.term}
      </h1>
      <p className="text-lg text-text leading-relaxed">{term.shortDefinition}</p>

      {/* Analogy callout */}
      <div className="bg-blue-dim border-l-4 border-l-blue border-t border-t-blue/30 p-6 sm:p-7 mt-8">
        <div className="label-mono text-blue mb-3">Real-World Analogy</div>
        <p className="text-[15px] text-text/85 leading-[1.7]">{term.analogy}</p>
      </div>

      {/* See it in action */}
      {story && (
        <Link
          href={`/stories/${story.slug}?stage=${story.stageId}`}
          className="group flex items-center justify-between gap-4 border border-border hover:border-accent bg-surface px-5 py-4 mt-8 transition-colors"
        >
          <span>
            <span className="label-mono text-text-dim block mb-1">
              See it in action
            </span>
            <span className="text-text font-medium group-hover:text-accent transition-colors">
              {story.title}
            </span>
          </span>
          <span className="text-accent text-lg font-mono transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      )}

      {/* Related concepts */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="label-mono text-text-dim mb-4">Related Concepts</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => {
              const rc = CATEGORY_BY_ID[r.category];
              return (
                <Link
                  key={r.id}
                  href={`/concepts/${r.id}`}
                  className="group inline-flex items-center gap-2 border border-border bg-bg px-3 py-2 hover:bg-surface transition-colors"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <span
                    className="w-2 h-2 shrink-0"
                    style={{ backgroundColor: rc.color }}
                  />
                  <span className="text-[13px] text-text group-hover:text-accent transition-colors">
                    {r.term}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
