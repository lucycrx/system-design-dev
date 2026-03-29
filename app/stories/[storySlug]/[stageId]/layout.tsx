import { notFound } from "next/navigation";
import { getStory } from "@/lib/content";
import { StoryStageHeader } from "@/components/ui/StoryStageHeader";

interface Props {
  children: React.ReactNode;
  params: Promise<{ storySlug: string }>;
}

export default async function StageLayout({ children, params }: Props) {
  const { storySlug } = await params;
  const story = getStory(storySlug);
  if (!story) notFound();

  const stages = story.stages.map((s) => ({
    id: s.id,
    title: s.title,
    userScale: s.userScale,
    hasDiagrams: s.blocks.some((b) => b.type === "diagram"),
  }));

  return (
    <div className="min-h-screen bg-bg">
      <StoryStageHeader
        storySlug={story.slug}
        storyTitle={story.title}
        stages={stages}
      />
      {children}
    </div>
  );
}
