export type NodeType = "process" | "decision" | "bottleneck" | "system";

export type FutureMode = "same" | "assist" | "replace";

export type CanvasView = "current" | "future";

export interface ProcessNodeData {
  [key: string]: unknown;
  label: string;
  nodeType: NodeType;
  isFresh?: boolean;
  description?: string;
  duration?: string;
  responsible?: string;
  question?: string;
  options?: string;
  problem?: string;
  frequency?: string;
  impact?: string;
  systemType?: string;
  connectedTo?: string;
  futureMode?: FutureMode;
  futureLabel?: string;
  futureDescription?: string;
  aiTask?: string;
  aiInput?: string;
  aiOutput?: string;
  techDetails?: string;
  humanRole?: string;
  reviewCheckpoint?: boolean;
}

export const NODE_TYPE_CONFIG: Record<
  NodeType,
  {
    label: string;
    shortLabel: string;
    emoji: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
  }
> = {
  process: {
    label: "Schritt",
    shortLabel: "Schritt",
    emoji: "●",
    colorClass: "text-node-process",
    bgClass: "bg-node-process-bg",
    borderClass: "border-node-process/30",
  },
  decision: {
    label: "Frage",
    shortLabel: "Frage",
    emoji: "◆",
    colorClass: "text-node-decision",
    bgClass: "bg-node-decision-bg",
    borderClass: "border-node-decision/30",
  },
  bottleneck: {
    label: "Problem",
    shortLabel: "Problem",
    emoji: "▲",
    colorClass: "text-node-bottleneck",
    bgClass: "bg-node-bottleneck-bg",
    borderClass: "border-node-bottleneck/30",
  },
  system: {
    label: "System",
    shortLabel: "System",
    emoji: "◌",
    colorClass: "text-node-system",
    bgClass: "bg-node-system-bg",
    borderClass: "border-node-system/30",
  },
};

export const FUTURE_MODE_CONFIG: Record<
  FutureMode,
  {
    label: string;
    shortLabel: string;
    description: string;
    badgeClass: string;
  }
> = {
  same: {
    label: "Bleibt gleich",
    shortLabel: "Gleich",
    description: "Hier ändert sich wenig.",
    badgeClass: "bg-muted text-muted-foreground",
  },
  assist: {
    label: "KI hilft",
    shortLabel: "KI hilft",
    description: "Der Mensch bleibt drin.",
    badgeClass: "bg-node-ai-bg text-node-ai",
  },
  replace: {
    label: "Neu mit KI",
    shortLabel: "Neu",
    description: "Der Ablauf wird neu gebaut.",
    badgeClass: "bg-node-process text-white",
  },
};

export const WORKSPACE_STAGES = {
  current: {
    id: "current",
    step: "1",
    label: "Heute",
    description: "Zeige den Ablauf von heute.",
  },
  future: {
    id: "future",
    step: "2",
    label: "Mit KI",
    description: "Markiere nur die Änderungen.",
  },
  compare: {
    id: "compare",
    step: "3",
    label: "Vergleich",
    description: "Sieh beide Wege direkt.",
  },
} as const;

export const GUIDING_QUESTIONS = {
  current: [
    "Was passiert als Nächstes?",
    "Wo dauert es lang?",
    "Wo gibt es Rückfragen?",
  ],
  future: [
    "Wo kann KI helfen?",
    "Wo prüft ein Mensch?",
    "Welche Technik braucht es?",
  ],
} as const;
