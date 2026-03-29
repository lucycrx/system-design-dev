import type { DiagramBlock as DiagramBlockType } from "@/types/story";

interface Props {
  block: DiagramBlockType;
}

export function DiagramBlock({ block }: Props) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-8 flex flex-col items-center gap-4">
      <div className="w-full h-48 flex items-center justify-center border border-dashed border-border rounded-xl bg-bg">
        <div className="text-center">
          <p className="text-sm text-text-muted">
            Interactive diagram coming soon
          </p>
          <p className="text-xs text-text-dim font-mono mt-1">
            {block.diagramId}
          </p>
        </div>
      </div>
      {block.caption && (
        <p className="text-xs text-text-muted text-center italic">
          {block.caption}
        </p>
      )}
    </div>
  );
}
