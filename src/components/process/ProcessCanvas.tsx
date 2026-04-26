import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent as ReactDragEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeTypes,
  type Node,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { ArrowRightLeft, Cpu, Eye, Maximize2, RotateCcw, Sparkles } from "lucide-react";
import "@xyflow/react/dist/style.css";

import CarouselControls from "./CarouselControls";
import EditPanel from "./EditPanel";
import ExportMenu from "./ExportMenu";
import FlowEdge from "./FlowEdge";
import LanguageToggle from "./LanguageToggle";
import NodeContextMenu from "./NodeContextMenu";
import NodePalette from "./NodePalette";
import PdfPreview from "./PdfPreview";
import PhaseStepper from "./PhaseStepper";
import ProcessNode from "./ProcessNode";
import { Button } from "@/components/ui/button";
import { useWorkflowAutoSave } from "@/hooks/useWorkflowStorage";
import { useTranslation } from "@/lib/i18n";
import { DEFAULT_LAYOUT, layoutNodes, snapToGrid } from "@/lib/layout";
import { cn } from "@/lib/utils";
import {
  PHASE_META,
  PHASE_ORDER,
  type NodeType,
  type ProcessNodeData,
  type WorkflowPhase,
} from "@/types/process";

const nodeTypes: NodeTypes = { processNode: ProcessNode };
const edgeTypes: EdgeTypes = { default: FlowEdge, smoothstep: FlowEdge };

const NODE_WIDTH = 220;
const NODE_HEIGHT = 110;

interface ProcessCanvasProps {
  initialProcessName: string;
  initialNodes: Node[];
  initialEdges: Edge[];
  initialPhase?: WorkflowPhase;
}

interface ContextMenuState {
  x: number;
  y: number;
  nodeId: string;
}

const ProcessCanvasInner = ({
  initialProcessName,
  initialNodes,
  initialEdges,
  initialPhase,
}: ProcessCanvasProps) => {
  const { t } = useTranslation();
  const reactFlow = useReactFlow();
  const [processName, setProcessName] = useState(initialProcessName);
  const [phase, setPhase] = useState<WorkflowPhase>(initialPhase ?? "draft");
  const [nodes, setNodes] = useState<Node[]>(() => layoutNodes(initialNodes, initialEdges));
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [compareView, setCompareView] = useState<"current" | "future">("current");
  const [hydrated, setHydrated] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const nodeCounter = useRef(initialNodes.length + 1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setHydrated(true), 200);
    return () => window.clearTimeout(t);
  }, []);

  const storageData = useMemo(
    () => ({ processName, phase, nodes, edges }),
    [processName, phase, nodes, edges],
  );
  useWorkflowAutoSave({ enabled: hydrated, data: storageData });

  const orderedNodes = useMemo(() => {
    return [...nodes].sort((a, b) => {
      if (a.position.x !== b.position.x) return a.position.x - b.position.x;
      return a.position.y - b.position.y;
    });
  }, [nodes]);

  const carouselActiveId = orderedNodes[carouselIndex]?.id ?? null;
  const isCarousel = phase === "refine" || phase === "ai";
  const activeNodeId = isCarousel ? carouselActiveId : selectedNodeId;
  const activeNode = nodes.find((n) => n.id === activeNodeId);

  const focusedNodes = useMemo(() => {
    const map = new Map<string, "focus" | "neighbor" | "background" | "neutral">();
    if (!isCarousel || !carouselActiveId) {
      nodes.forEach((n) => {
        map.set(n.id, n.id === selectedNodeId ? "focus" : "neutral");
      });
      return map;
    }
    const idx = orderedNodes.findIndex((n) => n.id === carouselActiveId);
    orderedNodes.forEach((n, i) => {
      const dist = Math.abs(i - idx);
      map.set(n.id, dist === 0 ? "focus" : dist === 1 ? "neighbor" : "background");
    });
    return map;
  }, [isCarousel, carouselActiveId, orderedNodes, nodes, selectedNodeId]);

  const displayNodes = useMemo(() => {
    const isCompareFuture = phase === "compare" && compareView === "future";
    const viewMode = phase === "ai" || isCompareFuture ? "future" : "current";

    return nodes.map((node) => {
      const focusState = focusedNodes.get(node.id) ?? "neutral";
      return {
        ...node,
        data: {
          ...node.data,
          viewMode,
          focusState,
          hideMeta: false,
        },
        selected: node.id === activeNodeId,
        draggable: phase === "draft",
      };
    });
  }, [nodes, phase, compareView, focusedNodes, activeNodeId]);

  const displayEdges = useMemo(() => {
    return edges.map((edge) => {
      const dimmed =
        isCarousel &&
        carouselActiveId !== null &&
        edge.source !== carouselActiveId &&
        edge.target !== carouselActiveId;
      return {
        ...edge,
        type: "smoothstep",
        data: { ...(edge.data ?? {}), dimmed },
        animated: false,
      };
    });
  }, [edges, isCarousel, carouselActiveId]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((existing) => {
        const next = applyNodeChanges(changes, existing);
        return next.map((node) => {
          const change = changes.find((c) => c.type === "position" && (c as { id?: string }).id === node.id);
          if (change && (change as { dragging?: boolean }).dragging === false) {
            return {
              ...node,
              position: { x: snapToGrid(node.position.x), y: snapToGrid(node.position.y) },
            };
          }
          return node;
        });
      });
    },
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((existing) => applyEdgeChanges(changes, existing)),
    [],
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) =>
      setEdges((existing) => addEdge({ ...connection, type: "smoothstep" }, existing)),
    [],
  );

  const onNodeClick = useCallback(
    (_: unknown, node: Node) => {
      if (isCarousel) {
        const idx = orderedNodes.findIndex((n) => n.id === node.id);
        if (idx >= 0) setCarouselIndex(idx);
        return;
      }
      setSelectedNodeId(node.id);
    },
    [isCarousel, orderedNodes],
  );

  const onPaneClick = useCallback(() => {
    if (!isCarousel) setSelectedNodeId(null);
    setContextMenu(null);
  }, [isCarousel]);

  const onNodeContextMenu = useCallback(
    (event: ReactMouseEvent, node: Node) => {
      event.preventDefault();
      if (phase === "compare") return;
      setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
      if (!isCarousel) setSelectedNodeId(node.id);
    },
    [isCarousel, phase],
  );

  const createNode = useCallback(
    (type: NodeType, position: { x: number; y: number }, label?: string): Node => {
      const id = `node-${nodeCounter.current++}`;
      return {
        id,
        type: "processNode",
        position: { x: snapToGrid(position.x), y: snapToGrid(position.y) },
        data: {
          label:
            label ?? (type === "decision" ? t("palette.newDecision") : t("palette.newProcess")),
          nodeType: type,
          futureMode: "same",
          isFresh: true,
        } as ProcessNodeData,
      };
    },
    [t],
  );

  const addNodeFromPalette = useCallback(
    (type: NodeType) => {
      const newNode = createNode(type, { x: DEFAULT_LAYOUT.xStart, y: DEFAULT_LAYOUT.yStart });
      setNodes((existing) => layoutNodes([...existing, newNode], edges));
      setSelectedNodeId(newNode.id);
      requestAnimationFrame(() => {
        reactFlow.fitView({ padding: 0.2, duration: 420 });
      });
      window.setTimeout(() => {
        setNodes((existing) =>
          existing.map((n) => (n.id === newNode.id ? { ...n, data: { ...n.data, isFresh: false } } : n)),
        );
      }, 1600);
    },
    [createNode, edges, reactFlow],
  );

  const insertAfter = useCallback(
    (sourceId: string, type: NodeType = "process") => {
      const source = nodes.find((n) => n.id === sourceId);
      if (!source) return;

      const newNode = createNode(type, {
        x: source.position.x + DEFAULT_LAYOUT.xGap,
        y: source.position.y,
      });

      const newEdge: Edge = {
        id: `edge-${sourceId}-${newNode.id}`,
        source: sourceId,
        target: newNode.id,
        type: "smoothstep",
      };

      const nextNodes = layoutNodes([...nodes, newNode], [...edges, newEdge]);
      setNodes(nextNodes);
      setEdges((existing) => [...existing, newEdge]);
      setSelectedNodeId(newNode.id);

      requestAnimationFrame(() => {
        reactFlow.fitView({ padding: 0.2, duration: 420 });
      });
      window.setTimeout(() => {
        setNodes((existing) =>
          existing.map((n) =>
            n.id === newNode.id ? { ...n, data: { ...n.data, isFresh: false } } : n,
          ),
        );
      }, 1600);
    },
    [createNode, edges, nodes, reactFlow],
  );

  const duplicateNode = useCallback(
    (sourceId: string) => {
      const source = nodes.find((n) => n.id === sourceId);
      if (!source) return;
      const id = `node-${nodeCounter.current++}`;
      const cloned: Node = {
        ...source,
        id,
        position: {
          x: snapToGrid(source.position.x + 40),
          y: snapToGrid(source.position.y + 40),
        },
        data: { ...(source.data as ProcessNodeData), isFresh: true },
        selected: false,
      };
      setNodes((existing) => [...existing, cloned]);
      setSelectedNodeId(id);
      window.setTimeout(() => {
        setNodes((existing) =>
          existing.map((n) => (n.id === id ? { ...n, data: { ...n.data, isFresh: false } } : n)),
        );
      }, 1600);
    },
    [nodes],
  );

  const toggleBottleneck = useCallback((targetId: string) => {
    setNodes((existing) =>
      existing.map((n) =>
        n.id === targetId
          ? { ...n, data: { ...n.data, isBottleneck: !(n.data as ProcessNodeData).isBottleneck } }
          : n,
      ),
    );
  }, []);

  const cycleNodeType = useCallback((targetId: string) => {
    setNodes((existing) =>
      existing.map((n) => {
        if (n.id !== targetId) return n;
        const current = (n.data as ProcessNodeData).nodeType;
        const next: NodeType = current === "process" ? "decision" : "process";
        return { ...n, data: { ...n.data, nodeType: next } };
      }),
    );
  }, []);

  const deleteNode = useCallback(
    (targetId: string) => {
      setNodes((existing) => existing.filter((n) => n.id !== targetId));
      setEdges((existing) =>
        existing.filter((e) => e.source !== targetId && e.target !== targetId),
      );
      if (isCarousel) {
        setCarouselIndex((idx) => Math.max(0, Math.min(idx, orderedNodes.length - 2)));
      }
      if (selectedNodeId === targetId) setSelectedNodeId(null);
    },
    [isCarousel, orderedNodes.length, selectedNodeId],
  );

  const onDrop = useCallback(
    (event: ReactDragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/process-node") as NodeType;
      if (!type) return;

      const bounds = wrapperRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const position = reactFlow.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode = createNode(type, position);
      setNodes((existing) => [...existing, newNode]);
      setSelectedNodeId(newNode.id);
      window.setTimeout(() => {
        setNodes((existing) =>
          existing.map((n) =>
            n.id === newNode.id ? { ...n, data: { ...n.data, isFresh: false } } : n,
          ),
        );
      }, 1600);
    },
    [createNode, reactFlow],
  );

  const onDragOver = useCallback((event: ReactDragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const updateNodeData = useCallback(
    (updates: Partial<ProcessNodeData>) => {
      if (!activeNodeId) return;
      setNodes((existing) =>
        existing.map((n) =>
          n.id === activeNodeId ? { ...n, data: { ...n.data, ...updates } } : n,
        ),
      );
    },
    [activeNodeId],
  );

  const deleteActive = useCallback(() => {
    if (!activeNodeId) return;
    deleteNode(activeNodeId);
  }, [activeNodeId, deleteNode]);

  const resetAll = useCallback(() => {
    if (window.confirm(t("reset.confirm"))) {
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      setPhase("draft");
      setCarouselIndex(0);
      nodeCounter.current = 1;
    }
  }, [t]);

  const autoArrange = useCallback(() => {
    if (nodes.length === 0) return;
    setNodes(layoutNodes(nodes, edges));
    requestAnimationFrame(() => {
      reactFlow.fitView({ padding: 0.18, duration: 420 });
    });
  }, [edges, nodes, reactFlow]);

  useEffect(() => {
    if (!isCarousel || !carouselActiveId) return;
    const node = nodes.find((n) => n.id === carouselActiveId);
    if (!node) return;
    reactFlow.setCenter(
      node.position.x + NODE_WIDTH / 2,
      node.position.y + NODE_HEIGHT / 2,
      { zoom: 1.1, duration: 600 },
    );
  }, [carouselActiveId, isCarousel, nodes, reactFlow]);

  const switchPhase = useCallback(
    (next: WorkflowPhase) => {
      setPhase(next);
      setSelectedNodeId(null);
      setContextMenu(null);
      if (next === "refine" || next === "ai") {
        setCarouselIndex(0);
      } else {
        requestAnimationFrame(() => {
          reactFlow.fitView({ padding: 0.18, duration: 420 });
        });
      }
    },
    [reactFlow],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (isCarousel) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setCarouselIndex((i) => Math.min(orderedNodes.length - 1, i + 1));
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          setCarouselIndex((i) => Math.max(0, i - 1));
        }
      }

      if (phase === "draft") {
        if (e.key === "Enter" && selectedNodeId) {
          e.preventDefault();
          insertAfter(selectedNodeId, "process");
        } else if (e.key === "Backspace" && selectedNodeId && e.metaKey) {
          e.preventDefault();
          deleteActive();
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deleteActive, insertAfter, isCarousel, orderedNodes.length, phase, selectedNodeId]);

  const changedCount = nodes.filter(
    (n) => ((n.data as ProcessNodeData).futureMode ?? "same") !== "same",
  ).length;
  const bottleneckCount = nodes.filter((n) => (n.data as ProcessNodeData).isBottleneck).length;
  const phaseMeta = PHASE_META[phase];

  const disabledPhases = nodes.length === 0 ? PHASE_ORDER.filter((p) => p !== "draft") : [];

  const carouselPosition = isCarousel
    ? orderedNodes.findIndex((n) => n.id === activeNodeId)
    : undefined;

  const contextNode = contextMenu ? nodes.find((n) => n.id === contextMenu.nodeId) : undefined;

  return (
    <div className="flex h-screen flex-col bg-[#f5f6fa]">
      <header className="border-b border-border/60 bg-white/95 backdrop-blur">
        <div className="mx-auto w-full max-w-[1760px] px-4 py-3 md:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {t("header.workflow")}
              </p>
              <input
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                className="mt-0.5 w-full max-w-2xl border-0 bg-transparent p-0 text-2xl font-semibold tracking-tight text-foreground outline-none placeholder:text-muted-foreground md:text-[28px]"
                placeholder={t("header.processName.placeholder")}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full bg-muted px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
                {t("header.steps", { count: nodes.length })}
              </div>
              {bottleneckCount > 0 && (
                <div className="rounded-full bg-node-bottleneck-bg px-3 py-1.5 text-[11px] font-medium text-node-bottleneck">
                  {t("header.bottlenecks", { count: bottleneckCount })}
                </div>
              )}
              {changedCount > 0 && (
                <div className="rounded-full bg-node-ai-bg px-3 py-1.5 text-[11px] font-medium text-node-ai">
                  <Sparkles className="mr-1 inline h-3 w-3" />
                  {t("header.aiCount", { count: changedCount })}
                </div>
              )}
              {phase === "draft" && nodes.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-full px-3 text-xs"
                  onClick={autoArrange}
                  title={t("header.arrange.title")}
                >
                  <Maximize2 className="mr-1 h-3.5 w-3.5" />
                  {t("header.arrange")}
                </Button>
              )}
              <ExportMenu
                processName={processName}
                nodes={nodes}
                edges={edges}
                onPdf={() => setPdfOpen(true)}
              />
              <LanguageToggle />
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground"
                onClick={resetAll}
                title={t("header.reset.title")}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <PhaseStepper current={phase} onChange={switchPhase} disabledPhases={disabledPhases} />
            <p className="text-[12px] text-muted-foreground">
              <span className="font-medium text-foreground">{t(phaseMeta.headlineKey)}</span>
              {" — "}
              {t(phaseMeta.descriptionKey)}
            </p>
          </div>
        </div>
      </header>

      <main className="relative min-h-0 flex-1">
        <div
          ref={wrapperRef}
          onDrop={phase === "draft" ? onDrop : undefined}
          onDragOver={phase === "draft" ? onDragOver : undefined}
          className="relative h-full w-full"
        >
          {phase === "draft" && <NodePalette onAddNode={addNodeFromPalette} />}

          {phase === "compare" && (
            <div className="pointer-events-auto absolute left-1/2 top-4 z-10 -translate-x-1/2">
              <div className="flex items-center gap-1 rounded-full border border-border/70 bg-white/95 p-1 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
                <button
                  onClick={() => setCompareView("current")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                    compareView === "current"
                      ? "bg-foreground text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Eye className="h-3.5 w-3.5" />
                  {t("canvas.compare.before")}
                </button>
                <ArrowRightLeft className="h-3 w-3 text-muted-foreground/60" />
                <button
                  onClick={() => setCompareView("future")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all",
                    compareView === "future"
                      ? "bg-node-ai text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Cpu className="h-3.5 w-3.5" />
                  {t("canvas.compare.after")}
                </button>
              </div>
            </div>
          )}

          {nodes.length === 0 && phase === "draft" && (
            <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center">
              <div className="max-w-md rounded-3xl border border-dashed border-border bg-white/80 px-8 py-10 text-center backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  {t("canvas.empty.kicker")}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-foreground">
                  {t("canvas.empty.title")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("canvas.empty.body")}
                </p>
              </div>
            </div>
          )}

          {phase === "draft" && selectedNodeId && (() => {
            const node = nodes.find((n) => n.id === selectedNodeId);
            if (!node) return null;
            const screen = reactFlow.flowToScreenPosition({
              x: node.position.x + NODE_WIDTH + 16,
              y: node.position.y + NODE_HEIGHT / 2 - 18,
            });
            const bounds = wrapperRef.current?.getBoundingClientRect();
            if (!bounds) return null;
            return (
              <button
                type="button"
                onClick={() => insertAfter(selectedNodeId, "process")}
                className="pointer-events-auto absolute z-10 flex h-9 items-center gap-1.5 rounded-full border border-primary/30 bg-white px-3 text-xs font-medium text-primary shadow-[0_8px_20px_rgba(37,99,235,0.18)] transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                style={{
                  left: screen.x - bounds.left,
                  top: screen.y - bounds.top,
                }}
                title={t("canvas.insertAfter.title")}
              >
                <span className="text-base leading-none">+</span>
                {t("canvas.insertAfter")}
              </button>
            );
          })()}

          <div
            className={cn(
              "h-full w-full transition-all duration-500",
              phase === "compare" && compareView === "future" && "compare-future-bg",
            )}
          >
            <ReactFlow
              nodes={displayNodes}
              edges={displayEdges}
              onNodesChange={phase === "draft" ? onNodesChange : undefined}
              onEdgesChange={phase === "draft" ? onEdgesChange : undefined}
              onConnect={phase === "draft" ? onConnect : undefined}
              onNodeClick={phase !== "compare" ? onNodeClick : undefined}
              onNodeContextMenu={phase !== "compare" ? onNodeContextMenu : undefined}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              defaultEdgeOptions={{ type: "smoothstep" }}
              snapToGrid
              snapGrid={[24, 24]}
              nodesDraggable={phase === "draft"}
              nodesConnectable={phase === "draft"}
              elementsSelectable={phase !== "compare"}
              panOnDrag={!isCarousel}
              zoomOnScroll
              zoomOnDoubleClick={false}
              minZoom={0.35}
              maxZoom={1.6}
              proOptions={{ hideAttribution: true }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1.2}
                color="hsl(220 15% 90%)"
              />
              {phase === "draft" && <Controls showInteractive={false} position="bottom-right" />}
            </ReactFlow>
          </div>

          {isCarousel && orderedNodes.length > 0 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center px-4">
              <CarouselControls
                index={carouselIndex}
                total={orderedNodes.length}
                onPrev={() => setCarouselIndex((i) => Math.max(0, i - 1))}
                onNext={() => setCarouselIndex((i) => Math.min(orderedNodes.length - 1, i + 1))}
                onFinish={() => switchPhase(phase === "refine" ? "ai" : "compare")}
                hint={t("carousel.hint")}
                finishLabel={
                  phase === "refine" ? t("carousel.finish.refine") : t("carousel.finish.ai")
                }
              />
            </div>
          )}
        </div>

        {(phase === "draft" || phase === "refine" || phase === "ai") && activeNode && (
          <div
            className={cn(
              "pointer-events-auto absolute right-4 top-4 z-20 h-[calc(100%-2rem)] animate-slide-in-right",
            )}
          >
            <EditPanel
              key={`${phase}-${activeNode.id}`}
              nodeData={activeNode.data as ProcessNodeData}
              phase={phase}
              onUpdate={updateNodeData}
              onClose={() => {
                if (isCarousel) {
                  setCarouselIndex((i) => Math.min(orderedNodes.length - 1, i + 1));
                } else {
                  setSelectedNodeId(null);
                }
              }}
              onDelete={deleteActive}
              onAdvance={
                isCarousel
                  ? () => {
                      if (carouselIndex >= orderedNodes.length - 1) {
                        switchPhase(phase === "refine" ? "ai" : "compare");
                      } else {
                        setCarouselIndex((i) => i + 1);
                      }
                    }
                  : undefined
              }
              position={carouselPosition}
              total={isCarousel ? orderedNodes.length : undefined}
            />
          </div>
        )}

        {phase === "compare" && (
          <div className="pointer-events-auto absolute bottom-6 right-6 z-10 flex max-w-sm flex-col gap-2 rounded-2xl border border-border/70 bg-white/95 p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("canvas.summary.title")}
            </p>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-foreground">{nodes.length}</span>
              <span className="text-muted-foreground">{t("canvas.summary.totalSteps")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-node-ai">{changedCount}</span>
              <span className="text-muted-foreground">{t("canvas.summary.changedAi")}</span>
            </div>
            {bottleneckCount > 0 && (
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold text-node-bottleneck">{bottleneckCount}</span>
                <span className="text-muted-foreground">{t("canvas.summary.bottlenecks")}</span>
              </div>
            )}
            {nodes.length > 0 && (
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                {t("canvas.summary.toggleHint")}
              </p>
            )}
          </div>
        )}
      </main>

      {contextMenu && contextNode && (
        <NodeContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeData={contextNode.data as ProcessNodeData}
          onClose={() => setContextMenu(null)}
          onInsertAfter={() => insertAfter(contextMenu.nodeId, "process")}
          onDuplicate={() => duplicateNode(contextMenu.nodeId)}
          onToggleBottleneck={() => toggleBottleneck(contextMenu.nodeId)}
          onCycleType={() => cycleNodeType(contextMenu.nodeId)}
          onDelete={() => deleteNode(contextMenu.nodeId)}
        />
      )}

      {pdfOpen && (
        <PdfPreview
          processName={processName}
          nodes={nodes}
          edges={edges}
          onClose={() => setPdfOpen(false)}
        />
      )}
    </div>
  );
};

const ProcessCanvas = (props: ProcessCanvasProps) => (
  <ReactFlowProvider>
    <ProcessCanvasInner {...props} />
  </ReactFlowProvider>
);

export default ProcessCanvas;
