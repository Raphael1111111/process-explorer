import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeTypes,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ProcessNode from './ProcessNode';
import NodePalette from './NodePalette';
import EditPanel from './EditPanel';
import GuidingTip from './GuidingTip';
import { type NodeType, type ProcessNodeData } from '@/types/process';
import { Button } from '@/components/ui/button';
import { Eye, Cpu, RotateCcw, Download, HelpCircle } from 'lucide-react';
import { GUIDING_QUESTIONS } from '@/types/process';

const nodeTypes: NodeTypes = {
  processNode: ProcessNode,
};

interface ProcessCanvasProps {
  initialProcessName: string;
  initialNodes: Node[];
  initialEdges: Edge[];
}

const ProcessCanvas = ({ initialProcessName, initialNodes, initialEdges }: ProcessCanvasProps) => {
  const [processName, setProcessName] = useState(initialProcessName);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAiView, setIsAiView] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const nodeCounter = useRef(initialNodes.length + 1);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, animated: false, style: { strokeWidth: 2 } }, eds)),
    [],
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Update nodes with AI view state
  const nodesWithView = nodes.map((node) => ({
    ...node,
    data: { ...node.data, isAiView },
  }));

  const addNode = useCallback((type: NodeType) => {
    const id = `node-${nodeCounter.current++}`;
    const defaultLabels: Record<NodeType, string> = {
      process: 'Neuer Schritt',
      decision: 'Entscheidung',
      bottleneck: 'Engpass',
      ai: 'KI-Schritt',
      system: 'System',
    };

    const newNode: Node = {
      id,
      type: 'processNode',
      position: {
        x: 250 + Math.random() * 200,
        y: 150 + Math.random() * 200,
      },
      data: {
        label: defaultLabels[type],
        nodeType: type,
      } as ProcessNodeData,
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
  }, []);

  const updateNodeData = useCallback(
    (updates: Partial<ProcessNodeData>) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNodeId
            ? { ...n, data: { ...n.data, ...updates } }
            : n,
        ),
      );
    },
    [selectedNodeId],
  );

  const deleteNode = useCallback(() => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId),
    );
    setSelectedNodeId(null);
  }, [selectedNodeId]);

  const resetProcess = useCallback(() => {
    if (window.confirm('Möchten Sie den gesamten Prozess zurücksetzen?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNodeId(null);
      nodeCounter.current = 1;
    }
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <input
            value={processName}
            onChange={(e) => setProcessName(e.target.value)}
            className="text-xl font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            placeholder="Prozessname..."
          />
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setIsAiView(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                !isAiView ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Menschen</span>
            </button>
            <button
              onClick={() => setIsAiView(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isAiView ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span className="hidden sm:inline">KI / Technik</span>
            </button>
          </div>

          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Leitfragen"
          >
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={resetProcess}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Zurücksetzen"
          >
            <RotateCcw className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Help Panel */}
      {showHelp && (
        <div className="border-b border-border px-6 py-4 bg-muted/30 animate-fade-in">
          <h3 className="text-sm font-semibold text-foreground mb-2">Leitfragen für Ihren Prozess</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {GUIDING_QUESTIONS.map((q, i) => (
              <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-node-ai">💡</span> {q}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex relative">
        <NodePalette onAddNode={addNode} />

        <div className="flex-1">
          <ReactFlow
            nodes={nodesWithView}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { strokeWidth: 2 },
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(220 15% 90%)" />
            <Controls showInteractive={false} />
          </ReactFlow>
        </div>

        {selectedNode && (
          <EditPanel
            key={selectedNode.id}
            nodeData={selectedNode.data as ProcessNodeData}
            onUpdate={updateNodeData}
            onClose={() => setSelectedNodeId(null)}
            onDelete={deleteNode}
          />
        )}

        <GuidingTip />
      </div>
    </div>
  );
};

export default ProcessCanvas;
