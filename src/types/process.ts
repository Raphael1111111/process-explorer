import type { TranslationKey } from "@/lib/i18n";

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

export const NODE_TYPE_STYLE: Record<
  NodeType,
  {
    emoji: string;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    accentVar: string;
    labelKey: TranslationKey;
    descriptionKey: TranslationKey;
  }
> = {
  process: {
    emoji: "●",
    colorClass: "text-node-process",
    bgClass: "bg-node-process-bg",
    borderClass: "border-node-process/40",
    accentVar: "var(--node-process)",
    labelKey: "node.type.process",
    descriptionKey: "node.type.process.description",
  },
  decision: {
    emoji: "◆",
    colorClass: "text-node-decision",
    bgClass: "bg-node-decision-bg",
    borderClass: "border-node-decision/40",
    accentVar: "var(--node-decision)",
    labelKey: "node.type.decision",
    descriptionKey: "node.type.decision.description",
  },
};

export const FUTURE_MODE_STYLE: Record<
  FutureMode,
  {
    badgeClass: string;
    cardClass: string;
    labelKey: TranslationKey;
    shortKey: TranslationKey;
    descriptionKey: TranslationKey;
  }
> = {
  same: {
    badgeClass: "bg-muted text-muted-foreground",
    cardClass: "border-border/70 bg-white",
    labelKey: "node.future.same",
    shortKey: "node.future.same.short",
    descriptionKey: "node.future.same.description",
  },
  assist: {
    badgeClass: "bg-node-ai-bg text-node-ai",
    cardClass: "border-node-ai/30 bg-node-ai-bg/60",
    labelKey: "node.future.assist",
    shortKey: "node.future.assist.short",
    descriptionKey: "node.future.assist.description",
  },
  replace: {
    badgeClass: "bg-node-ai text-white",
    cardClass: "border-node-ai/60 bg-node-ai/10",
    labelKey: "node.future.replace",
    shortKey: "node.future.replace.short",
    descriptionKey: "node.future.replace.description",
  },
};

export const PHASE_META: Record<
  WorkflowPhase,
  {
    id: WorkflowPhase;
    step: string;
    labelKey: TranslationKey;
    headlineKey: TranslationKey;
    descriptionKey: TranslationKey;
  }
> = {
  draft: {
    id: "draft",
    step: "1",
    labelKey: "phases.draft.label",
    headlineKey: "phases.draft.headline",
    descriptionKey: "phases.draft.description",
  },
  refine: {
    id: "refine",
    step: "2",
    labelKey: "phases.refine.label",
    headlineKey: "phases.refine.headline",
    descriptionKey: "phases.refine.description",
  },
  ai: {
    id: "ai",
    step: "3",
    labelKey: "phases.ai.label",
    headlineKey: "phases.ai.headline",
    descriptionKey: "phases.ai.description",
  },
  compare: {
    id: "compare",
    step: "4",
    labelKey: "phases.compare.label",
    headlineKey: "phases.compare.headline",
    descriptionKey: "phases.compare.description",
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
