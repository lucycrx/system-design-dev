import Link from "next/link";
import type { ConceptCategory, GlossaryTerm } from "@/types/story";
import { CATEGORY_BY_ID } from "@/lib/conceptMeta";
import { Shape } from "@/components/ui/Shape";
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
        data-cursor
        className="label-mono text-text-muted hover:text-text transition-colors inline-flex items-center gap-1.5 mb-8"
      >
        <span>&larr;</span> All Concepts
      </Link>

      {/* Hero visual — the one intentional primary moment */}
      <div className="relative h-44 sm:h-56 border border-text/10 bg-surface flex items-center justify-center px-10 py-6 mb-7 overflow-hidden">
        <Shape
          type={category.shape}
          color={category.color}
          size={120}
          className="pointer-events-none absolute"
          style={{ bottom: "-30px", left: "-24px", opacity: 0.12 }}
        />
        <div className="relative w-full max-w-xs h-full">
          <ConceptVisual visual={term.visual} color={category.color} playing />
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center gap-2.5 mb-3">
        <Shape type={category.shape} color={category.color} size={13} />
        <span className="label-mono text-text-muted">{category.label}</span>
      </div>
      <h1 className="heading-hero text-4xl sm:text-5xl text-text mb-4">
        {term.term}
      </h1>
      <p className="text-lg text-text leading-relaxed">{term.shortDefinition}</p>

      {/* Analogy — ink card with shape marker */}
      <div className="bg-surface border-l-2 border-text p-6 sm:p-7 mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Shape type="triangle" color={category.color} size={11} />
          <span className="label-mono text-text">Real-World Analogy</span>
        </div>
        <p className="text-[15px] text-text/85 leading-[1.7]">{term.analogy}</p>
      </div>

      {/* See it in action */}
      {story && (
        <Link
          href={`/stories/${story.slug}?stage=${story.stageId}`}
          data-cursor
          className="group flex items-center justify-between gap-4 border border-text/10 hover:border-text bg-bg px-5 py-4 mt-8 transition-colors duration-300"
        >
          <span>
            <span className="label-mono text-text-muted block mb-1">
              See it in action
            </span>
            <span className="subhead text-text">{story.title}</span>
          </span>
          <span className="text-text text-lg font-mono transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
            &rarr;
          </span>
        </Link>
      )}

      {/* Related concepts */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-text/10">
          <h2 className="label-mono text-text-muted mb-4">Related Concepts</h2>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => {
              const rc = CATEGORY_BY_ID[r.category];
              return (
                <Link
                  key={r.id}
                  href={`/concepts/${r.id}`}
                  data-cursor
                  className="group inline-flex items-center gap-2 border border-text/10 bg-bg px-3 py-2 hover:border-text transition-colors duration-300"
                >
                  <Shape type={rc.shape} color={rc.color} size={10} />
                  <span className="text-[13px] text-text">{r.term}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
