"use client";

import { useEffect, useRef, useState } from "react";
import type { Diagram } from "@/types/story";
import { DiagramNodeShape } from "./DiagramNodeShape";
import { DiagramEdge } from "./DiagramEdge";

interface Props {
  diagram: Diagram | null;
  highlightNodes?: string[];
  animateFlow?: string[];
  className?: string;
}

export function SystemDiagram({ diagram, highlightNodes = [], animateFlow = [], className = "" }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const prevDiagramId = useRef<string | null>(null);

  useEffect(() => {
    if (!diagram) return;
    if (diagram.id !== prevDiagramId.current) {
      setIsVisible(false);
      const timer = setTimeout(() => setIsVisible(true), 50);
      prevDiagramId.current = diagram.id;
      return () => clearTimeout(timer);
    }
  }, [diagram]);

  // Also set visible on mount
  useEffect(() => {
    if (diagram) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!diagram) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-sm text-text-dim">Scroll through the story to see the architecture evolve</p>
      </div>
    );
  }

  const highlightSet = new Set(highlightNodes);

  // Build animated edges set from animateFlow path
  const animatedEdges = new Set<string>();
  if (animateFlow.length > 1) {
    for (let i = 0; i < animateFlow.length - 1; i++) {
      animatedEdges.add(`${animateFlow[i]}-${animateFlow[i + 1]}`);
    }
  }
  // Also include edges marked as animated in the diagram data
  for (const edge of diagram.edges) {
    if (edge.animated) {
      animatedEdges.add(`${edge.from}-${edge.to}`);
    }
  }

  const nodeMap = new Map(diagram.nodes.map((n) => [n.id, n]));

  // Add padding around the viewBox
  const pad = 80;

  return (
    <div className={`w-full ${className}`}>
      <svg
        viewBox={`${-pad} ${-pad / 2} ${diagram.width + pad * 2} ${diagram.height + pad}`}
        className={`w-full h-auto transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              className="fill-border"
            />
          </marker>
        </defs>

        {/* Edges (render behind nodes) */}
        {diagram.edges.map((edge) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;
          return (
            <DiagramEdge
              key={`${edge.from}-${edge.to}`}
              edge={edge}
              fromNode={from}
              toNode={to}
              isAnimated={animatedEdges.has(`${edge.from}-${edge.to}`)}
            />
          );
        })}

        {/* Nodes */}
        {diagram.nodes.map((node) => (
          <DiagramNodeShape
            key={node.id}
            node={node}
            isHighlighted={highlightSet.has(node.id)}
            isNew={!!node.isNew}
          />
        ))}
      </svg>

      {/* Caption area for diagram info */}
      <div className="mt-3 text-center">
        <p className="text-[10px] font-mono text-text-dim uppercase tracking-wider">
          {diagram.nodes.length} components
        </p>
      </div>
    </div>
  );
}
