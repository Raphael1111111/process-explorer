import { useState } from 'react';
import Onboarding from '@/components/process/Onboarding';
import ProcessCanvas from '@/components/process/ProcessCanvas';
import type { Node, Edge } from '@xyflow/react';
import type { ProcessNodeData } from '@/types/process';

const EXAMPLE_NODES: Node[] = [
  {
    id: 'e1',
    type: 'processNode',
    position: { x: 50, y: 200 },
    data: { label: 'Anfrage eingehend', nodeType: 'process', description: 'Kundenanfrage per E-Mail oder Telefon', responsible: 'Vertrieb', duration: '10 Min' } as ProcessNodeData,
  },
  {
    id: 'e2',
    type: 'processNode',
    position: { x: 350, y: 100 },
    data: { label: 'Anforderungen prüfen', nodeType: 'decision', question: 'Ist die Anfrage vollständig?', options: 'Ja / Nein' } as ProcessNodeData,
  },
  {
    id: 'e3',
    type: 'processNode',
    position: { x: 350, y: 320 },
    data: { label: 'Infos fehlen oft', nodeType: 'bottleneck', problem: 'Unvollständige Kundenangaben', frequency: 'Bei ~60% der Anfragen', impact: 'Verzögerung um 1-2 Tage' } as ProcessNodeData,
  },
  {
    id: 'e4',
    type: 'processNode',
    position: { x: 680, y: 100 },
    data: { label: 'KI erstellt Angebotsentwurf', nodeType: 'ai', aiTask: 'Erstellt aus Anfragedaten einen Angebotsentwurf', aiInput: 'Kundenanfrage, Preisliste, vergangene Angebote', aiOutput: 'Angebotsentwurf als PDF', needsHumanApproval: true, involvedSystems: 'CRM, Preisdatenbank', checkpoint: true, handoverTo: 'Vertriebsleitung' } as ProcessNodeData,
  },
  {
    id: 'e5',
    type: 'processNode',
    position: { x: 680, y: 320 },
    data: { label: 'CRM-System', nodeType: 'system', systemType: 'CRM', connectedTo: 'ERP, E-Mail' } as ProcessNodeData,
  },
  {
    id: 'e6',
    type: 'processNode',
    position: { x: 1000, y: 200 },
    data: { label: 'Angebot versenden', nodeType: 'process', description: 'Geprüftes Angebot an Kunden senden', responsible: 'Vertrieb', duration: '5 Min' } as ProcessNodeData,
  },
];

const EXAMPLE_EDGES: Edge[] = [
  { id: 'ee1-2', source: 'e1', target: 'e2', type: 'smoothstep' },
  { id: 'ee2-3', source: 'e2', target: 'e3', type: 'smoothstep' },
  { id: 'ee2-4', source: 'e2', target: 'e4', type: 'smoothstep' },
  { id: 'ee4-5', source: 'e4', target: 'e5', type: 'smoothstep' },
  { id: 'ee4-6', source: 'e4', target: 'e6', type: 'smoothstep' },
];

const Index = () => {
  const [started, setStarted] = useState(false);
  const [canvasProps, setCanvasProps] = useState<{
    processName: string;
    nodes: Node[];
    edges: Edge[];
  } | null>(null);

  const handleStart = (processName: string, firstStep: string) => {
    const firstNode: Node = {
      id: 'node-1',
      type: 'processNode',
      position: { x: 250, y: 250 },
      data: {
        label: firstStep,
        nodeType: 'process',
      } as ProcessNodeData,
    };
    setCanvasProps({ processName, nodes: [firstNode], edges: [] });
    setStarted(true);
  };

  const handleLoadExample = () => {
    setCanvasProps({
      processName: 'Angebotserstellung',
      nodes: EXAMPLE_NODES,
      edges: EXAMPLE_EDGES,
    });
    setStarted(true);
  };

  if (!started || !canvasProps) {
    return <Onboarding onComplete={handleStart} onLoadExample={handleLoadExample} />;
  }

  return (
    <ProcessCanvas
      initialProcessName={canvasProps.processName}
      initialNodes={canvasProps.nodes}
      initialEdges={canvasProps.edges}
    />
  );
};

export default Index;
