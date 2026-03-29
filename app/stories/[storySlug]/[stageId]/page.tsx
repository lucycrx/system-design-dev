import { notFound } from "next/navigation";
import { getStory, getGlossaryMap, getDiagramsForStage } from "@/lib/content";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { ScrollytellingLayout } from "@/components/scrollytelling/ScrollytellingLayout";
import { StageNavigation } from "@/components/ui/StageNavigation";

interface Props {
  params: Promise<{ storySlug: string; stageId: string }>;
}

export default async function StagePage({ params }: Props) {
  const { storySlug, stageId } = await params;
  const story = getStory(storySlug);
  if (!story) notFound();

  const stageIndex = story.stages.findIndex((s) => s.id === stageId);
  if (stageIndex === -1) notFound();

  const stage = story.stages[stageIndex];
  const glossaryMap = getGlossaryMap();
  const hasDiagrams = stage.blocks.some((b) => b.type === "diagram");
  const diagrams = hasDiagrams
    ? getDiagramsForStage(storySlug, stage.blocks)
    : {};

  const prevStage = stageIndex > 0 ? story.stages[stageIndex - 1] : undefined;
  const nextStage =
    stageIndex < story.stages.length - 1
      ? story.stages[stageIndex + 1]
      : undefined;

  return (
      <main className={`mx-auto px-6 py-8 ${hasDiagrams ? "max-w-6xl" : "max-w-3xl"}`}>
        <div>
          {/* Stage header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-accent-dim text-accent border border-accent/20">
                {stage.userScale}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-text mb-3">{stage.title}</h1>
            <p className="text-text-muted leading-relaxed">
              {stage.narrative.setup}
            </p>
          </div>

          {/* Problem callout (if this stage has one) */}
          {stage.narrative.problem && (
            <div className="bg-pink-dim border-l-[3px] border-l-pink rounded-r-xl p-5 mb-8">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-pink mb-2">
                The Problem
              </div>
              <p className="text-[14px] text-text/80 leading-relaxed">
                {stage.narrative.problem}
              </p>
            </div>
          )}

          {/* Resolution teaser */}
          {stage.narrative.resolution && (
            <div className="bg-green-dim border-l-[3px] border-l-green rounded-r-xl p-5 mb-8">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-green mb-2">
                The Solution
              </div>
              <p className="text-[14px] text-text/80 leading-relaxed">
                {stage.narrative.resolution}
              </p>
            </div>
          )}
        </div>

        {/* Content blocks */}
        {hasDiagrams ? (
          <ScrollytellingLayout
            blocks={stage.blocks}
            diagrams={diagrams}
            glossaryMap={glossaryMap}
          />
        ) : (
          <BlockRenderer blocks={stage.blocks} glossaryMap={glossaryMap} />
        )}

        {/* Navigation */}
        <StageNavigation
          storySlug={story.slug}
          prevStage={prevStage}
          nextStage={nextStage}
        />
      </main>
  );
}

export async function generateStaticParams() {
  const { getAllStories } = await import("@/lib/content");
  const stories = getAllStories();
  const params: { storySlug: string; stageId: string }[] = [];
  for (const story of stories) {
    for (const stage of story.stages) {
      params.push({ storySlug: story.slug, stageId: stage.id });
    }
  }
  return params;
}
