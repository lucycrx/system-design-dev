import Link from "next/link";

interface Props {
  storySlug: string;
  prevStage?: { id: string; title: string };
  nextStage?: { id: string; title: string };
}

export function StageNavigation({ storySlug, prevStage, nextStage }: Props) {
  return (
    <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
      {prevStage ? (
        <Link
          href={`/stories/${storySlug}/${prevStage.id}`}
          className="group flex items-center gap-3 text-text-muted hover:text-text transition-colors"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">
            &larr;
          </span>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-text-dim">
              Previous
            </div>
            <div className="text-sm font-medium">{prevStage.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {nextStage ? (
        <Link
          href={`/stories/${storySlug}/${nextStage.id}`}
          className="group flex items-center gap-3 text-right text-text-muted hover:text-accent transition-colors"
        >
          <div>
            <div className="text-[11px] uppercase tracking-wider text-text-dim">
              Next
            </div>
            <div className="text-sm font-medium">{nextStage.title}</div>
          </div>
          <span className="text-lg group-hover:translate-x-1 transition-transform">
            &rarr;
          </span>
        </Link>
      ) : (
        <Link
          href={`/stories/${storySlug}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Complete Story
        </Link>
      )}
    </div>
  );
}
