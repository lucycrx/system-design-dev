import type { Story } from "@/types/story";

const difficultyColors = {
  beginner: "text-green bg-green-dim border-green/20",
  intermediate: "text-orange bg-orange-dim border-orange/20",
  advanced: "text-pink bg-pink-dim border-pink/20",
};

export function StoryHero({ story }: { story: Story }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
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
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-4 leading-[1.08] tracking-[-0.02em]">
          {story.title}
        </h1>
        <p className="text-lg sm:text-xl text-text-muted font-light leading-relaxed">
          {story.subtitle}
        </p>
        <p className="text-base text-text-dim leading-relaxed mt-5 max-w-2xl">
          {story.description}
        </p>
      </div>

      {/* Concepts you'll learn */}
      <div>
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
    </div>
  );
}
