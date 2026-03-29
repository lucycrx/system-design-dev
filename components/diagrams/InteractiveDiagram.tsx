"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Diagram } from "@/types/story";
import { SystemNode } from "./SystemNode";
import { AnimatedEdge } from "./AnimatedEdge";

interface Props {
  diagram: Diagram | null;
  highlightNodes?: string[];
  animateFlow?: string[];
  className?: string;
}

const nodeTypes = { system: SystemNode };
const edgeTypes = { animated: AnimatedEdge };
const EMPTY_ARRAY: string[] = [];

function DiagramInner({ diagram, highlightNodes, animateFlow, className = "" }: Props) {
  const stableHighlight = highlightNodes ?? EMPTY_ARRAY;
  const stableAnimate = animateFlow ?? EMPTY_ARRAY;

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();
  const [isVisible, setIsVisible] = useState(false);

  // Stable string keys to avoid re-running effect on new array references
  const highlightKey = stableHighlight.join(",");
  const animateKey = stableAnimate.join(",");
  const diagramId = diagram?.id ?? null;

  // Update nodes/edges when diagram changes
  useEffect(() => {
    if (!diagram) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const highlightSet = new Set(stableHighlight);
    const animatedFromFlow = new Set<string>();
    if (stableAnimate.length > 1) {
      for (let i = 0; i < stableAnimate.length - 1; i++) {
        animatedFromFlow.add(`${stableAnimate[i]}-${stableAnimate[i + 1]}`);
      }
    }

    const newNodes: Node[] = diagram.nodes.map((node) => ({
      id: node.id,
      type: "system",
      position: node.position,
      data: {
        label: node.label,
        nodeType: node.type,
        explanation: node.explanation,
        glossaryLink: node.glossaryLink,
        isNew: node.isNew,
        isHighlighted: highlightSet.has(node.id),
      },
    }));

    const newEdges: Edge[] = diagram.edges.map((edge) => {
      const flowKey = `${edge.source}-${edge.target}`;
      const isAnimated = edge.animated || animatedFromFlow.has(flowKey);
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "animated",
        label: edge.label,
        data: {
          animated: isAnimated,
          edgeStyle: edge.style || "solid",
        },
      };
    });

    setIsVisible(false);
    setNodes(newNodes);
    setEdges(newEdges);

    // Fit view after nodes are rendered, then fade in
    const timer = setTimeout(() => {
      fitView({ padding: 0.3, duration: 300 });
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagramId, highlightKey, animateKey]);

  const onInit = useCallback(() => {
    fitView({ padding: 0.3 });
    setTimeout(() => setIsVisible(true), 100);
  }, [fitView]);

  if (!diagram) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-sm text-text-dim">Scroll through the story to see the architecture evolve</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className} transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`} style={{ height: 360 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        minZoom={0.5}
        maxZoom={2}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Arrow marker definition */}
        <svg>
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
                fill="var(--color-border)"
              />
            </marker>
          </defs>
        </svg>
        <Background color="var(--color-border)" gap={32} size={1} />
      </ReactFlow>

      {/* Caption */}
      <div className="mt-2 text-center">
        <p className="text-[10px] font-mono text-text-dim uppercase tracking-wider">
          {diagram.nodes.length} components -- zoom and pan to explore
        </p>
      </div>
    </div>
  );
}

export function InteractiveDiagram(props: Props) {
  return (
    <ReactFlowProvider>
      <DiagramInner {...props} />
    </ReactFlowProvider>
  );
}
