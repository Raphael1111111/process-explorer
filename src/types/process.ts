export type NodeType = "process" | "decision";

export type FutureMode = "same" | "assist" | "replace";

export type WorkflowPhase = "draft" | "refine" | "ai" | "compare";

export type CanvasView = "current" | "future";

export interface ProcessNodeData {
  [key: string]: unknown;
  label: string;
  nodeType: NodeType;
  isFresh?: boolean;
  description?: string;
  duration?: string;
  responsible?: string;
  tools?: string[];
  isBottleneck?: boolean;
  bottleneckReason?: string;
  futureMode?: FutureMode;
  futureLabel?: string;
  aiTask?: string;
  humanRole?: string;
  reviewCheckpoint?: boolean;
}

export const NODE_TYPE_CONFIG: Record<
  NodeType,
  {
    label: string;
    shortLabel: string;
    emoji: string;
    description: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    accentVar: string;
  }
> = {
  process: {
    label: "Schritt",
    shortLabel: "Schritt",
    emoji: "●",
    description: "Etwas wird getan.",
    colorClass: "text-node-process",
    bgClass: "bg-node-process-bg",
    borderClass: "border-node-process/40",
    accentVar: "var(--node-process)",
  },
  decision: {
    label: "Frage",
    shortLabel: "Frage",
    emoji: "◆",
    description: "Es wird entschieden.",
    colorClass: "text-node-decision",
    bgClass: "bg-node-decision-bg",
    borderClass: "border-node-decision/40",
    accentVar: "var(--node-decision)",
  },
};

export const FUTURE_MODE_CONFIG: Record<
  FutureMode,
  {
    label: string;
    shortLabel: string;
    description: string;
    badgeClass: string;
    cardClass: string;
  }
> = {
  same: {
    label: "Bleibt wie heute",
    shortLabel: "Gleich",
    description: "Hier ändert sich nichts.",
    badgeClass: "bg-muted text-muted-foreground",
    cardClass: "border-border/70 bg-white",
  },
  assist: {
    label: "KI unterstützt",
    shortLabel: "KI hilft",
    description: "Mensch macht weiter, KI hilft im Hintergrund.",
    badgeClass: "bg-node-ai-bg text-node-ai",
    cardClass: "border-node-ai/30 bg-node-ai-bg/60",
  },
  replace: {
    label: "Neu mit KI",
    shortLabel: "Neu",
    description: "Die KI übernimmt den Schritt komplett.",
    badgeClass: "bg-node-ai text-white",
    cardClass: "border-node-ai/60 bg-node-ai/10",
  },
};

export const WORKFLOW_PHASES: Record<
  WorkflowPhase,
  {
    id: WorkflowPhase;
    step: string;
    label: string;
    headline: string;
    description: string;
  }
> = {
  draft: {
    id: "draft",
    step: "1",
    label: "Skizzieren",
    headline: "Wie läuft es heute?",
    description: "Erfasse die Schritte. Reihenfolge zählt, Details später.",
  },
  refine: {
    id: "refine",
    step: "2",
    label: "Verfeinern",
    headline: "Was passiert in jedem Schritt?",
    description: "Ein Schritt nach dem anderen. Nur das Wichtigste.",
  },
  ai: {
    id: "ai",
    step: "3",
    label: "KI prüfen",
    headline: "Wo könnte KI helfen?",
    description: "Pro Schritt eine kurze Entscheidung.",
  },
  compare: {
    id: "compare",
    step: "4",
    label: "Vergleich",
    headline: "Vorher und Nachher",
    description: "Sieh den Unterschied auf einen Blick.",
  },
};

export const PHASE_ORDER: WorkflowPhase[] = ["draft", "refine", "ai", "compare"];

export const COMMON_TOOL_SUGGESTIONS = [
  "Outlook",
  "Teams",
  "SharePoint",
  "Excel",
  "Word",
  "CRM",
  "Dynamics 365",
  "WordPress",
  "Slack",
];

export const STORAGE_KEY = "workflow-builder:state:v2";
