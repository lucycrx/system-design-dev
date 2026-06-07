import type { Story } from "@/types/story";
import { Shape, type ShapeType } from "@/components/ui/Shape";

const RED = "#D62828";
const BLUE = "#1D4E89";
const YELLOW = "#F4C430";

const difficultyMarker: Record<Story["difficulty"], { shape: ShapeType; color: string }> = {
  beginner: { shape: "circle", color: BLUE },
  intermediate: { shape: "square", color: YELLOW },
  advanced: { shape: "triangle", color: RED },
};

export function StoryHero({ story }: { story: Story }) {
  const marker = difficultyMarker[story.difficulty];

  return (
    <div className="relative max-w-6xl mx-auto px-6 py-16 overflow-hidden">
      <Shape
        type={marker.shape}
        color={marker.color}
        size={300}
        className="pointer-events-none absolute"
        style={{ top: "-70px", right: "-70px", opacity: 0.9 }}
      />
      {/* Story header */}
      <div className="relative mb-14 max-w-3xl">
        <div className="flex items-center gap-3 mb-5">
          <span className="label-mono inline-flex items-center gap-2 px-2.5 py-1 border border-text/15 text-text">
            <Shape type={marker.shape} color={marker.color} size={10} />
            {story.difficulty}
          </span>
          <span className="label-mono text-text-muted">
            ~{story.estimatedMinutes} min
          </span>
        </div>
        <h1 className="heading-hero text-4xl sm:text-5xl lg:text-6xl text-text mb-4">
          {story.title}
        </h1>
        <p className="subhead text-lg sm:text-xl text-text-muted leading-relaxed">
          {story.subtitle}
        </p>
        <p className="text-base text-text-muted leading-relaxed mt-5 max-w-2xl">
          {story.description}
        </p>
      </div>

      {/* Concepts you'll learn */}
      <div className="relative max-w-3xl">
        <h2 className="label-mono text-text-muted mb-4">
          Concepts You&apos;ll Learn
        </h2>
        <div className="flex flex-wrap gap-2">
          {story.concepts.map((concept) => (
            <span
              key={concept}
              className="label-mono px-3 py-1.5 bg-surface border border-text/10 text-text-muted"
            >
              {concept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
