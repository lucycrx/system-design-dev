"use client";

import dynamic from "next/dynamic";
import type { Diagram } from "@/types/story";

const InteractiveDiagram = dynamic(
  () => import("./InteractiveDiagram").then((mod) => ({ default: mod.InteractiveDiagram })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[420px] h-[50vh] max-h-[600px] flex items-center justify-center bg-surface border border-border">
        <p className="text-sm text-text-dim">Loading diagram...</p>
      </div>
    ),
  }
);

interface Props {
  diagram: Diagram | null;
  highlightNodes?: string[];
  animateFlow?: string[];
  className?: string;
  onNodeClick?: (nodeId: string | null) => void;
}

export function InteractiveDiagramLoader(props: Props) {
  return <InteractiveDiagram {...props} />;
}
