"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Diagram, DiagramNodeType } from "@/types/story";
import { SystemNode } from "./SystemNode";
import { AnimatedEdge } from "./AnimatedEdge";
import { DiagramLegend } from "./DiagramLegend";

interface Props {
  diagram: Diagram | null;
  highlightNodes?: string[];
  animateFlow?: string[];
  className?: string;
  onNodeClick?: (nodeId: string | null) => void;
}

const nodeTypes = { system: SystemNode };
const edgeTypes = { animated: AnimatedEdge };
const EMPTY_ARRAY: string[] = [];

function DiagramInner({ diagram, highlightNodes, animateFlow, className = "", onNodeClick }: Props) {
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
        technology: node.technology,
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
          protocol: edge.protocol,
        },
      };
    });

    setIsVisible(false);
    setNodes(newNodes);
    setEdges(newEdges);

    // Fit view after nodes are rendered, then fade in
    const timer = setTimeout(() => {
      const padding = diagram && diagram.nodes.length > 5 ? 0.15 : 0.3;
      fitView({ padding, duration: 300 });
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagramId, highlightKey, animateKey]);

  const onInit = useCallback(() => {
    const padding = nodes.length > 5 ? 0.15 : 0.3;
    fitView({ padding });
    setTimeout(() => setIsVisible(true), 100);
  }, [fitView, nodes.length]);

  const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    onNodeClick?.(node.id);
  }, [onNodeClick]);

  const handlePaneClick = useCallback(() => {
    onNodeClick?.(null);
  }, [onNodeClick]);

  const legendNodeTypes = useMemo(() => {
    if (!diagram) return [];
    const seen = new Set<DiagramNodeType>();
    return diagram.nodes.reduce<DiagramNodeType[]>((acc, node) => {
      if (!seen.has(node.type)) {
        seen.add(node.type);
        acc.push(node.type);
      }
      return acc;
    }, []);
  }, [diagram]);

  const hasDashedEdges = useMemo(() => {
    return diagram?.edges.some((e) => e.style === "dashed") ?? false;
  }, [diagram]);

  if (!diagram) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-sm text-text-dim">Scroll through the story to see the architecture evolve</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className} transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
      {/* Diagram header */}
      {(diagram.title || diagram.description) && (
        <div className="mb-2">
          {diagram.title && (
            <p className="text-[11px] font-mono text-text-dim uppercase tracking-[0.15em]">
              {diagram.title}
            </p>
          )}
          {diagram.description && (
            <p className="text-xs text-text-muted mt-0.5">
              {diagram.description}
            </p>
          )}
        </div>
      )}
      <div className="min-h-[380px] h-[45vh] max-h-[540px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={onInit}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        minZoom={0.5}
        maxZoom={2}
        fitView
        fitViewOptions={{ padding: diagram.nodes.length > 5 ? 0.15 : 0.3 }}
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
        <Controls
          showInteractive={false}
          position="top-right"
          className="!bg-surface !border-border !shadow-none [&>button]:!bg-surface [&>button]:!border-border [&>button]:!text-text-dim [&>button:hover]:!bg-bg"
        />
        <Background color="var(--color-border)" gap={32} size={1} />
      </ReactFlow>
      </div>

      {/* Legend and caption */}
      <DiagramLegend nodeTypes={legendNodeTypes} hasDashedEdges={hasDashedEdges} />
      <div className="mt-1.5 text-center">
        <p className="text-[10px] font-mono text-text-dim uppercase tracking-[0.15em]">
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
