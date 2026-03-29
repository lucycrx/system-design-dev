"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { StoryProgressBar } from "./StoryProgressBar";

interface StageInfo {
  id: string;
  title: string;
  userScale: string;
  hasDiagrams: boolean;
}

interface Props {
  storySlug: string;
  storyTitle: string;
  stages: StageInfo[];
}

export function StoryStageHeader({ storySlug, storyTitle, stages }: Props) {
  const params = useParams();
  const stageId = params.stageId as string;

  const stageIndex = stages.findIndex((s) => s.id === stageId);
  const stage = stages[stageIndex];
  if (!stage) return null;

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border">
      <div
        className={`mx-auto px-6 py-3 flex items-center justify-between ${
          stage.hasDiagrams ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        <Link
          href={`/stories/${storySlug}`}
          className="text-sm text-text-muted hover:text-text transition-colors flex items-center gap-2"
        >
          <span>&larr;</span>
          <span className="hidden sm:inline">{storyTitle}</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <span className="text-xs font-mono text-text-dim">
          {stage.userScale}
        </span>
      </div>
      <div
        className={`mx-auto px-6 pb-3 ${
          stage.hasDiagrams ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        <StoryProgressBar
          currentStage={stageIndex + 1}
          totalStages={stages.length}
          stageTitle={stage.title}
        />
      </div>
    </header>
  );
}
