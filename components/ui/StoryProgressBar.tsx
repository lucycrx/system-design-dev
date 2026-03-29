interface Props {
  currentStage: number;
  totalStages: number;
  stageTitle: string;
}

export function StoryProgressBar({
  currentStage,
  totalStages,
  stageTitle,
}: Props) {
  const progress = ((currentStage) / totalStages) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-muted font-mono">
          Stage {currentStage} of {totalStages}
        </span>
        <span className="text-xs text-text-dim">{stageTitle}</span>
      </div>
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
