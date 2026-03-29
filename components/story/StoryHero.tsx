import type { Story } from "@/types/story";

const difficultyColors = {
  beginner: "bg-green text-bg",
  intermediate: "bg-orange text-bg",
  advanced: "bg-accent text-bg",
};

export function StoryHero({ story }: { story: Story }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Story header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-5">
          <span
            className={`label-mono px-2.5 py-1 ${difficultyColors[story.difficulty]}`}
          >
            {story.difficulty}
          </span>
          <span className="label-mono text-text-dim">
            ~{story.estimatedMinutes} min
          </span>
        </div>
        <h1 className="heading-editorial text-4xl sm:text-5xl lg:text-6xl text-text mb-4">
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
        <h2 className="label-mono text-text-dim mb-4">
          Concepts You&apos;ll Learn
        </h2>
        <div className="flex flex-wrap gap-2">
          {story.concepts.map((concept) => (
            <span
              key={concept}
              className="label-mono px-3 py-1.5 bg-surface border border-border text-text-muted"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
