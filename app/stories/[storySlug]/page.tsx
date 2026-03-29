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

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Story header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <span
              className={`text-[0.6875rem] font-semibold px-3 py-1 rounded-full border ${difficultyColors[story.difficulty]}`}
            >
              {story.difficulty}
            </span>
            <span className="text-[0.6875rem] text-text-dim font-mono">
              ~{story.estimatedMinutes} min
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-4 leading-[1.08] tracking-[-0.02em]">{story.title}</h1>
          <p className="text-lg sm:text-xl text-text-muted font-light leading-relaxed">
            {story.subtitle}
          </p>
          <p className="text-base text-text-dim leading-relaxed mt-5 max-w-2xl">
            {story.description}
          </p>
        </div>

        {/* Concepts you'll learn */}
        <div className="mb-14">
          <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-text-dim mb-4">
            Concepts You&apos;ll Learn
          </h2>
          <div className="flex flex-wrap gap-2">
            {story.concepts.map((concept) => (
              <span
                key={concept}
                className="text-[0.6875rem] px-3 py-1.5 rounded-full bg-surface border border-border text-text-muted font-mono"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Stage list */}
        <div className="mb-14">
          <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-text-dim mb-6">
            The Journey ({story.stages.length} stages)
          </h2>
          <div className="space-y-0 relative">
            {/* Vertical connector line */}
            <div className="absolute left-[23px] top-6 bottom-6 w-px bg-border" />
            {story.stages.map((stage, i) => (
              <Link
                key={stage.id}
                href={`/stories/${story.slug}/${stage.id}`}
                className="group relative block bg-surface border border-border rounded-xl p-6 hover:border-accent/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-out mb-3 animate-[fade-up_0.4s_ease-out_both]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-5">
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-xl bg-accent-dim border border-accent/20 flex items-center justify-center text-accent text-lg font-bold font-mono">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-lg font-semibold text-text group-hover:text-accent transition-colors tracking-[-0.01em]">
                        {stage.title}
                      </h3>
                      <span className="text-[0.6875rem] font-mono text-text-dim bg-bg px-2 py-0.5 rounded border border-border/60">
                        {stage.userScale}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                      {stage.narrative.setup}
                    </p>
                    {stage.narrative.problem && (
                      <p className="text-sm text-pink mt-2 font-medium leading-relaxed">
                        {stage.narrative.problem.slice(0, 100)}...
                      </p>
                    )}
                  </div>
                  <span className="text-text-dim group-hover:text-accent group-hover:translate-x-1 transition-all text-lg mt-2">
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
          className="inline-flex items-center gap-3 px-12 py-5 bg-accent text-white rounded-full font-bold text-lg hover:shadow-xl hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 ease-out"
        >
          Start This Story <span className="text-xl">&rarr;</span>
        </Link>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const { getAllStories } = await import("@/lib/content");
  return getAllStories().map((s) => ({ storySlug: s.slug }));
}
