import { useCallback, useMemo, useRef, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type Node,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowInstance,
} from "@xyflow/react";
import { ArrowRightLeft, Cpu, Eye, RotateCcw } from "lucide-react";
import "@xyflow/react/dist/style.css";

import EditPanel from "./EditPanel";
import NodePalette from "./NodePalette";
import ProcessNode from "./ProcessNode";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  WORKSPACE_STAGES,
  type CanvasView,
  type NodeType,
  type ProcessNodeData,
} from "@/types/process";

const nodeTypes: NodeTypes = {
  processNode: ProcessNode,
};

type LayoutPreset = {
  xStart: number;
  yStart: number;
  xGap: number;
  yGap: number;
  componentGap: number;
};

const DEFAULT_LAYOUT: LayoutPreset = {
  xStart: 80,
  yStart: 80,
  xGap: 260,
  yGap: 140,
  componentGap: 180,
};

const COMPARE_ORDER_LAYOUT: LayoutPreset = {
  xStart: 64,
  yStart: 72,
  xGap: 220,
  yGap: 122,
  componentGap: 136,
};

const COMPARE_GRID_LAYOUT: LayoutPreset = {
  xStart: 72,
  yStart: 80,
  xGap: 238,
  yGap: 168,
  componentGap: 0,
};

const COMPARE_GRID_COLUMNS = 4;

type EditorStage = keyof typeof WORKSPACE_STAGES;

interface ProcessCanvasProps {
  initialProcessName: string;
  initialNodes: Node[];
  initialEdges: Edge[];
}

interface FlowSurfaceProps {
  title: string;
  subtitle?: string;
  nodes: Node[];
  edges: Edge[];
  viewMode: CanvasView;
  interactive: boolean;
  fitViewPadding?: number;
  frameClassName?: string;
  canvasClassName?: string;
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onConnect?: OnConnect;
  onNodeClick?: (_event: unknown, node: Node) => void;
  onPaneClick?: () => void;
  onInit?: (instance: ReactFlowInstance) => void;
}

const sortIdsByPosition = (ids: string[], nodeMap: Map<string, Node>) =>
  [...ids].sort((left, right) => {
    const leftNode = nodeMap.get(left);
    const rightNode = nodeMap.get(right);

    if (!leftNode || !rightNode) return left.localeCompare(right);

    if (leftNode.position.y !== rightNode.position.y) {
      return leftNode.position.y - rightNode.position.y;
    }

    return leftNode.position.x - rightNode.position.x;
  });

const sortNodesByFlow = (nodes: Node[]) =>
  [...nodes].sort((left, right) => {
    if (left.position.x !== right.position.x) {
      return left.position.x - right.position.x;
    }

    if (left.position.y !== right.position.y) {
      return left.position.y - right.position.y;
    }

    return left.id.localeCompare(right.id);
  });

const getAutoLayoutedNodes = (nodes: Node[], edges: Edge[], preset: LayoutPreset = DEFAULT_LAYOUT) => {
  if (nodes.length === 0) return nodes;

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const undirected = new Map<string, Set<string>>();
  const incoming = new Map<string, Set<string>>();
  const outgoing = new Map<string, Set<string>>();

  for (const node of nodes) {
    undirected.set(node.id, new Set());
    incoming.set(node.id, new Set());
    outgoing.set(node.id, new Set());
  }

  for (const edge of edges) {
    if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) continue;

    undirected.get(edge.source)?.add(edge.target);
    undirected.get(edge.target)?.add(edge.source);
    incoming.get(edge.target)?.add(edge.source);
    outgoing.get(edge.source)?.add(edge.target);
  }

  const unvisited = new Set(nodes.map((node) => node.id));
  const positions = new Map<string, { x: number; y: number }>();
  let currentBaseY = preset.yStart;

  while (unvisited.size > 0) {
    const rootCandidate =
      sortIdsByPosition([...unvisited], nodeMap).find((id) => (incoming.get(id)?.size ?? 0) === 0) ??
      sortIdsByPosition([...unvisited], nodeMap)[0];

    const componentQueue = [rootCandidate];
    const componentIds: string[] = [];
    unvisited.delete(rootCandidate);

    while (componentQueue.length > 0) {
      const currentId = componentQueue.shift();

      if (!currentId) continue;

      componentIds.push(currentId);

      for (const nextId of undirected.get(currentId) ?? []) {
        if (!unvisited.has(nextId)) continue;

        unvisited.delete(nextId);
        componentQueue.push(nextId);
      }
    }

    const componentSet = new Set(componentIds);
    const indegree = new Map<string, number>();
    const depth = new Map<string, number>();

    for (const id of componentIds) {
      const indegreeValue = [...(incoming.get(id) ?? [])].filter((parent) => componentSet.has(parent)).length;
      indegree.set(id, indegreeValue);
      if (indegreeValue === 0) {
        depth.set(id, 0);
      }
    }

    const depthQueue = sortIdsByPosition(
      componentIds.filter((id) => (indegree.get(id) ?? 0) === 0),
      nodeMap,
    );

    while (depthQueue.length > 0) {
      const currentId = depthQueue.shift();

      if (!currentId) continue;

      const currentDepth = depth.get(currentId) ?? 0;

      for (const nextId of outgoing.get(currentId) ?? []) {
        if (!componentSet.has(nextId)) continue;

        depth.set(nextId, Math.max(depth.get(nextId) ?? 0, currentDepth + 1));
        indegree.set(nextId, (indegree.get(nextId) ?? 1) - 1);

        if ((indegree.get(nextId) ?? 0) <= 0) {
          depthQueue.push(nextId);
        }
      }
    }

    let fallbackDepth = Math.max(...depth.values(), 0);
    for (const id of sortIdsByPosition(componentIds, nodeMap)) {
      if (!depth.has(id)) {
        fallbackDepth += 1;
        depth.set(id, fallbackDepth);
      }
    }

    const columns = new Map<number, string[]>();
    for (const id of componentIds) {
      const column = depth.get(id) ?? 0;
      columns.set(column, [...(columns.get(column) ?? []), id]);
    }

    const maxColumnSize = Math.max(...[...columns.values()].map((columnIds) => columnIds.length), 1);
    const componentHeight = (maxColumnSize - 1) * preset.yGap;

    for (const [column, ids] of [...columns.entries()].sort((left, right) => left[0] - right[0])) {
      const sortedIds = sortIdsByPosition(ids, nodeMap);
      const columnHeight = (sortedIds.length - 1) * preset.yGap;
      const columnStartY = currentBaseY + (componentHeight - columnHeight) / 2;

      sortedIds.forEach((id, index) => {
        positions.set(id, {
          x: preset.xStart + column * preset.xGap,
          y: columnStartY + index * preset.yGap,
        });
      });
    }

    currentBaseY += componentHeight + preset.componentGap;
  }

  return nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) ?? node.position,
  }));
};

const getCompareLayoutedNodes = (nodes: Node[], edges: Edge[]) => {
  const orderedNodes = sortNodesByFlow(
    getAutoLayoutedNodes(nodes, edges, COMPARE_ORDER_LAYOUT),
  );

  return orderedNodes.map((node, index) => {
    const column = index % COMPARE_GRID_COLUMNS;
    const row = Math.floor(index / COMPARE_GRID_COLUMNS);

    return {
      ...node,
      position: {
        x: COMPARE_GRID_LAYOUT.xStart + column * COMPARE_GRID_LAYOUT.xGap,
        y: COMPARE_GRID_LAYOUT.yStart + row * COMPARE_GRID_LAYOUT.yGap,
      },
    };
  });
};

const FlowSurface = ({
  title,
  subtitle,
  nodes,
  edges,
  viewMode,
  interactive,
  fitViewPadding = 0.18,
  frameClassName,
  canvasClassName,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onInit,
}: FlowSurfaceProps) => {
  const displayNodes = nodes.map((node) => ({
    ...node,
    data: { ...node.data, viewMode },
  }));

  return (
    <div
      className={cn(
        "flex h-full min-h-[520px] flex-col overflow-hidden rounded-[24px] border border-border/70 bg-white shadow-sm",
        frameClassName,
      )}
    >
      <div className="border-b border-border/70 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">{title}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className={cn("flow-surface-canvas min-h-0 flex-1", canvasClassName)}>
        <ReactFlow
          nodes={displayNodes}
          edges={edges}
          onInit={interactive ? onInit : undefined}
          onNodesChange={interactive ? onNodesChange : undefined}
          onEdgesChange={interactive ? onEdgesChange : undefined}
          onConnect={interactive ? onConnect : undefined}
          onNodeClick={interactive ? onNodeClick : undefined}
          onPaneClick={interactive ? onPaneClick : undefined}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: fitViewPadding }}
          defaultEdgeOptions={{
            type: "smoothstep",
            style: { strokeWidth: 2 },
          }}
          nodesDraggable={interactive}
          nodesConnectable={interactive}
          elementsSelectable={interactive}
          panOnDrag={interactive}
          zoomOnScroll={interactive}
          zoomOnDoubleClick={interactive}
          preventScrolling={false}
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} color="hsl(220 15% 92%)" />
          {interactive && <Controls showInteractive={false} />}
        </ReactFlow>
      </div>
    </div>
  );
};

const ProcessCanvas = ({ initialProcessName, initialNodes, initialEdges }: ProcessCanvasProps) => {
  const [processName, setProcessName] = useState(initialProcessName);
  const [nodes, setNodes] = useState<Node[]>(() => getAutoLayoutedNodes(initialNodes, initialEdges, DEFAULT_LAYOUT));
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editorStage, setEditorStage] = useState<EditorStage>("current");
  const nodeCounter = useRef(initialNodes.length + 1);
  const flowInstanceRef = useRef<ReactFlowInstance | null>(null);

  const compareNodes = useMemo(
    () => getCompareLayoutedNodes(nodes, edges),
    [edges, nodes],
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((existingNodes) => applyNodeChanges(changes, existingNodes)),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((existingEdges) => applyEdgeChanges(changes, existingEdges)),
    [],
  );

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((existingEdges) =>
        addEdge({ ...connection, animated: false, style: { strokeWidth: 2 } }, existingEdges),
      ),
    [],
  );

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const addNode = useCallback((type: NodeType) => {
    const id = `node-${nodeCounter.current++}`;
    const defaultLabels: Record<NodeType, string> = {
      process: "Neuer Schritt",
      decision: "Neue Frage",
      bottleneck: "Neues Problem",
      system: "Neues System",
    };

    const newNode: Node = {
      id,
      type: "processNode",
      position: {
        x: DEFAULT_LAYOUT.xStart,
        y: DEFAULT_LAYOUT.yStart,
      },
      data: {
        label: defaultLabels[type],
        nodeType: type,
        futureMode: "same",
        isFresh: true,
      } as ProcessNodeData,
    };

    setNodes((existingNodes) => getAutoLayoutedNodes([...existingNodes, newNode], edges, DEFAULT_LAYOUT));
    setSelectedNodeId(id);

    requestAnimationFrame(() => {
      flowInstanceRef.current?.fitView({ padding: 0.16, duration: 380 });
    });

    window.setTimeout(() => {
      setNodes((existingNodes) =>
        existingNodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, isFresh: false } }
            : node,
        ),
      );
    }, 1800);
  }, [edges]);

  const updateNodeData = useCallback(
    (updates: Partial<ProcessNodeData>) => {
      if (!selectedNodeId) return;

      setNodes((existingNodes) =>
        existingNodes.map((node) =>
          node.id === selectedNodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node,
        ),
      );
    },
    [selectedNodeId],
  );

  const deleteNode = useCallback(() => {
    if (!selectedNodeId) return;

    setNodes((existingNodes) => existingNodes.filter((node) => node.id !== selectedNodeId));
    setEdges((existingEdges) =>
      existingEdges.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId),
    );
    setSelectedNodeId(null);
  }, [selectedNodeId]);

  const resetProcess = useCallback(() => {
    if (window.confirm("Möchtest du den gesamten Ablauf zurücksetzen?")) {
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      setEditorStage("current");
      nodeCounter.current = 1;
    }
  }, []);

  const autoArrange = useCallback(() => {
    if (nodes.length === 0) return;

    const arrangedNodes = getAutoLayoutedNodes(nodes, edges, DEFAULT_LAYOUT);
    setNodes(arrangedNodes);

    requestAnimationFrame(() => {
      flowInstanceRef.current?.fitView({ padding: 0.16, duration: 400 });
    });
  }, [edges, nodes]);

  const switchStage = useCallback(
    (nextStage: EditorStage) => {
      setEditorStage(nextStage);

      if (nextStage === "compare") {
        setSelectedNodeId(null);
      }
    },
    [],
  );

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const changedNodeCount = nodes.filter(
    (node) => ((node.data as ProcessNodeData).futureMode ?? "same") !== "same",
  ).length;
  const visibleNodeCount = compareNodes.length;

  return (
    <div className="flex h-screen flex-col bg-[#f7f8fb]">
      <header className="border-b border-border/70 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-[1700px] px-4 py-4 md:px-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                Dein Prozess
              </p>
              <input
                value={processName}
                onChange={(event) => setProcessName(event.target.value)}
                className="mt-1 w-full max-w-2xl border-none bg-transparent p-0 text-2xl font-semibold text-foreground outline-none placeholder:text-muted-foreground md:text-3xl"
                placeholder="Name des Prozesses"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                {nodes.length} Schritte
              </div>
              <div className="rounded-full bg-node-ai-bg px-3 py-1.5 text-xs text-node-ai">
                {changedNodeCount} geändert
              </div>
              {editorStage !== "compare" && (
                <Button
                  variant="outline"
                  className="h-9 rounded-full px-4 text-sm"
                  onClick={autoArrange}
                >
                  Auto ordnen
                </Button>
              )}
              <Button
                variant="outline"
                className="h-9 rounded-full px-4 text-sm"
                onClick={resetProcess}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(WORKSPACE_STAGES) as EditorStage[]).map((stage) => {
              const config = WORKSPACE_STAGES[stage];
              const isActive = editorStage === stage;
              const disabled = stage !== "current" && nodes.length === 0;

              return (
                <button
                  key={stage}
                  type="button"
                  disabled={disabled}
                  onClick={() => switchStage(stage)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                    isActive
                      ? "border-primary bg-primary/8 text-foreground"
                      : "border-border/70 bg-white text-muted-foreground hover:bg-muted/30",
                    disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  {stage === "current" && <Eye className="h-4 w-4" />}
                  {stage === "future" && <Cpu className="h-4 w-4" />}
                  {stage === "compare" && <ArrowRightLeft className="h-4 w-4" />}
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 p-3 md:p-4">
        {editorStage === "compare" ? (
          <div className="mx-auto grid h-full max-w-[1760px] gap-3 lg:grid-cols-2">
            <FlowSurface
              title="Vorher"
              subtitle={`${visibleNodeCount} Schritte · max. 4 pro Zeile`}
              nodes={compareNodes}
              edges={edges}
              viewMode="current"
              interactive={false}
              fitViewPadding={0.08}
              frameClassName="compare-flow-frame"
              canvasClassName="compare-flow-canvas"
            />
            <FlowSurface
              title="Nachher"
              subtitle={
                changedNodeCount > 0
                  ? `${changedNodeCount} Änderungen · max. 4 pro Zeile`
                  : "Noch keine Änderung · max. 4 pro Zeile"
              }
              nodes={compareNodes}
              edges={edges}
              viewMode="future"
              interactive={false}
              fitViewPadding={0.08}
              frameClassName="compare-flow-frame"
              canvasClassName="compare-flow-canvas"
            />
          </div>
        ) : (
          <div className="mx-auto flex h-full max-w-[1700px] gap-3">
            <div className="relative min-w-0 flex-1">
              {editorStage === "current" && <NodePalette onAddNode={addNode} />}

              {!selectedNode && (
                <div className="pointer-events-none absolute right-4 top-4 z-10 rounded-2xl border border-border/70 bg-white/95 px-3 py-2 text-xs text-muted-foreground shadow-sm">
                  Klicke einen Schritt oder füge links etwas hinzu.
                </div>
              )}

              <FlowSurface
                title={WORKSPACE_STAGES[editorStage].label}
                subtitle={editorStage === "future" ? "Nur die Änderungen markieren" : "Ablauf aufbauen"}
                nodes={nodes}
                edges={edges}
                viewMode={editorStage === "current" ? "current" : "future"}
                interactive
                fitViewPadding={0.14}
                canvasClassName="builder-flow-canvas"
                onInit={(instance) => {
                  flowInstanceRef.current = instance;
                }}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
              />
            </div>

            {selectedNode && (
              <EditPanel
                key={`${editorStage}-${selectedNode.id}`}
                nodeData={selectedNode.data as ProcessNodeData}
                stage={editorStage}
                onUpdate={updateNodeData}
                onClose={() => setSelectedNodeId(null)}
                onDelete={deleteNode}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProcessCanvas;
