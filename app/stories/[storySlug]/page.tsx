import { notFound } from "next/navigation";
import { getStory } from "@/lib/content";
import Link from "next/link";

interface Props {
  params: Promise<{ storySlug: string }>;
}

export default async function StoryOverviewPage({ params }: Props) {
  const { storySlug } = await params;
  const story = getStory(storySlug);
  if (!story) notFound();

  const difficultyColors = {
    beginner: "text-green bg-green-dim border-green/20",
    intermediate: "text-orange bg-orange-dim border-orange/20",
    advanced: "text-pink bg-pink-dim border-pink/20",
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="text-sm text-text-muted hover:text-text transition-colors flex items-center gap-2"
          >
            <span>&larr;</span> All Stories
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Story header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${difficultyColors[story.difficulty]}`}
            >
              {story.difficulty}
            </span>
            <span className="text-xs text-text-dim font-mono">
              ~{story.estimatedMinutes} min
            </span>
          </div>
          <h1 className="text-4xl font-bold text-text mb-2">{story.title}</h1>
          <p className="text-xl text-text-muted font-light">
            {story.subtitle}
          </p>
          <p className="text-[15px] text-text-dim leading-relaxed mt-4 max-w-2xl">
            {story.description}
          </p>
        </div>

        {/* Concepts you'll learn */}
        <div className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-dim mb-3">
            Concepts You&apos;ll Learn
          </h2>
          <div className="flex flex-wrap gap-2">
            {story.concepts.map((concept) => (
              <span
                key={concept}
                className="text-xs px-3 py-1.5 rounded-full bg-surface border border-border text-text-muted font-mono"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Stage list */}
        <div className="mb-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-text-dim mb-4">
            The Journey ({story.stages.length} stages)
          </h2>
          <div className="space-y-3">
            {story.stages.map((stage, i) => (
              <Link
                key={stage.id}
                href={`/stories/${story.slug}/${stage.id}`}
                className="group block bg-surface border border-border rounded-xl p-5 hover:border-accent/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-dim border border-accent/20 flex items-center justify-center text-accent text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[15px] font-semibold text-text group-hover:text-accent transition-colors">
                        {stage.title}
                      </h3>
                      <span className="text-xs font-mono text-text-dim bg-bg px-2 py-0.5 rounded">
                        {stage.userScale}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted line-clamp-2">
                      {stage.narrative.setup}
                    </p>
                    {stage.narrative.problem && (
                      <p className="text-xs text-pink mt-1.5">
                        {stage.narrative.problem.slice(0, 80)}...
                      </p>
                    )}
                  </div>
                  <span className="text-text-dim group-hover:text-accent transition-colors text-lg">
                    &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Start button */}
        <Link
          href={`/stories/${story.slug}/${story.stages[0].id}`}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full font-bold text-base hover:opacity-90 transition-opacity"
        >
          Start This Story &rarr;
        </Link>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const { getAllStories } = await import("@/lib/content");
  return getAllStories().map((s) => ({ storySlug: s.slug }));
}
