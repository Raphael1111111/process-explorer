export type NodeType = 'process' | 'decision' | 'bottleneck' | 'ai' | 'system';

export interface ProcessNodeData {
  label: string;
  nodeType: NodeType;
  description?: string;
  // Process step fields
  duration?: string;
  responsible?: string;
  // Decision fields
  question?: string;
  options?: string;
  // Bottleneck fields
  problem?: string;
  frequency?: string;
  impact?: string;
  // AI step fields
  aiTask?: string;
  aiInput?: string;
  aiOutput?: string;
  needsHumanApproval?: boolean;
  involvedSystems?: string;
  checkpoint?: boolean;
  handoverTo?: string;
  // System fields
  systemName?: string;
  systemType?: string;
  connectedTo?: string;
}

export const NODE_TYPE_CONFIG: Record<NodeType, {
  label: string;
  emoji: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}> = {
  process: {
    label: 'Prozessschritt',
    emoji: '🔵',
    colorClass: 'text-node-process',
    bgClass: 'bg-node-process-bg',
    borderClass: 'border-node-process/30',
  },
  decision: {
    label: 'Entscheidung',
    emoji: '🟢',
    colorClass: 'text-node-decision',
    bgClass: 'bg-node-decision-bg',
    borderClass: 'border-node-decision/30',
  },
  bottleneck: {
    label: 'Engpass',
    emoji: '🟠',
    colorClass: 'text-node-bottleneck',
    bgClass: 'bg-node-bottleneck-bg',
    borderClass: 'border-node-bottleneck/30',
  },
  ai: {
    label: 'KI-Schritt',
    emoji: '🟣',
    colorClass: 'text-node-ai',
    bgClass: 'bg-node-ai-bg',
    borderClass: 'border-node-ai/30',
  },
  system: {
    label: 'System',
    emoji: '⚪',
    colorClass: 'text-node-system',
    bgClass: 'bg-node-system-bg',
    borderClass: 'border-node-system/30',
  },
};

export const GUIDING_QUESTIONS = [
  'Was passiert zuerst?',
  'Wo wiederholt sich Arbeit ständig?',
  'Wo warten Menschen auf etwas?',
  'Wo fehlen oft Informationen?',
  'Was könnte KI vorbereiten, zusammenfassen, prüfen, sortieren oder vorschlagen?',
  'Wo soll ein Mensch bewusst die Kontrolle behalten?',
];
