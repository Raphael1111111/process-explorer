import { memo } from "react";
import { Handle, Position, useStore, type NodeProps } from "@xyflow/react";
import { AlertTriangle, Sparkles } from "lucide-react";

import { useTranslation } from "@/lib/i18n";
import {
  FUTURE_MODE_STYLE,
  NODE_TYPE_STYLE,
  type CanvasView,
  type FutureMode,
  type NodeType,
  type ProcessNodeData,
} from "@/types/process";
import { cn } from "@/lib/utils";

type FocusState = "focus" | "neighbor" | "background" | "neutral";

type ViewNodeData = ProcessNodeData & {
  viewMode?: CanvasView;
  focusState?: FocusState;
  hideMeta?: boolean;
};

const ProcessNode = memo(({ data, selected }: NodeProps) => {
  const { t } = useTranslation();
  const nodeData = data as ViewNodeData;
  const style = NODE_TYPE_STYLE[nodeData.nodeType as NodeType] ?? NODE_TYPE_STYLE.process;
  const viewMode = nodeData.viewMode ?? "current";
  const futureMode = (nodeData.futureMode ?? "same") as FutureMode;
  const futureStyle = FUTURE_MODE_STYLE[futureMode];
  const isFutureView = viewMode === "future";
  const isChanged = futureMode !== "same";
  const focusState: FocusState = nodeData.focusState ?? "neutral";

  const zoom = useStore((store) => store.transform[2]);
  const detailLevel: "compact" | "default" | "expanded" =
    zoom < 0.55 ? "compact" : zoom > 1.1 ? "expanded" : "default";

  const title = isFutureView && isChanged ? nodeData.futureLabel || nodeData.label : nodeData.label;
  const showMeta = !nodeData.hideMeta && detailLevel !== "compact";
  const showExpanded = detailLevel === "expanded" && focusState !== "background";

  const tools = nodeData.tools ?? [];
  const responsible = nodeData.responsible;
  const duration = nodeData.duration;

  const focusClasses: Record<FocusState, string> = {
    focus: "scale-[1.04] opacity-100 shadow-[0_18px_36px_rgba(15,23,42,0.10)]",
    neighbor: "scale-[0.98] opacity-90",
    background: "scale-[0.94] opacity-40",
    neutral: "opacity-100",
  };

  return (
    <div
      className={cn(
        "process-node relative min-w-[200px] max-w-[240px] rounded-[20px] border bg-white px-4 py-3 shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition-all duration-300 ease-out",
        style.borderClass,
        style.bgClass,
        isFutureView && isChanged && futureStyle.cardClass,
        selected && "ring-2 ring-primary/30 shadow-[0_14px_32px_rgba(37,99,235,0.14)]",
        nodeData.isFresh && "process-node-fresh",
        focusClasses[focusState],
        nodeData.isBottleneck && !isFutureView && "bottleneck-card",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-2 !border-border/80 !bg-white"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-1.5">
            <span className={cn("text-[11px] font-semibold leading-none", style.colorClass)}>
              {style.emoji}
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.18em]",
                style.colorClass,
              )}
            >
              {t(style.labelKey)}
            </span>
            {nodeData.isBottleneck && !isFutureView && (
              <span
                className="ml-1 inline-flex items-center gap-1 rounded-full bg-node-bottleneck-bg px-1.5 py-[2px] text-[9px] font-semibold uppercase tracking-[0.14em] text-node-bottleneck"
                title={nodeData.bottleneckReason || t("node.bottleneck.title")}
              >
                <AlertTriangle className="h-2.5 w-2.5" />
                {t("node.bottleneckBadge")}
              </span>
            )}
          </div>
          <p
            className={cn(
              "text-sm font-semibold leading-snug text-foreground transition-all",
              detailLevel === "compact" && "text-[13px]",
            )}
          >
            {String(title || t("common.unnamed"))}
          </p>
        </div>

        {isFutureView && isChanged && (
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-1 text-[10px] font-medium",
              futureStyle.badgeClass,
            )}
          >
            <Sparkles className="mr-1 inline h-2.5 w-2.5" />
            {t(futureStyle.shortKey)}
          </span>
        )}
      </div>

      {showMeta && !isFutureView && (responsible || duration) && (
        <div className="mt-2 flex flex-wrap items-center gap-1">
          {responsible && (
            <span className="inline-flex items-center rounded-full bg-white/70 px-2 py-[3px] text-[10px] font-medium text-muted-foreground">
              {responsible}
            </span>
          )}
          {duration && (
            <span className="inline-flex items-center rounded-full bg-white/70 px-2 py-[3px] text-[10px] font-medium text-muted-foreground">
              {duration}
            </span>
          )}
        </div>
      )}

      {showMeta && isFutureView && isChanged && nodeData.aiTask && (
        <div className="mt-2 rounded-2xl bg-white/80 px-2.5 py-1.5 text-[11px] leading-4 text-node-ai">
          {nodeData.aiTask}
        </div>
      )}

      {showExpanded && nodeData.description && (
        <p className="mt-2 text-[11px] leading-snug text-muted-foreground">
          {nodeData.description}
        </p>
      )}

      {showMeta && tools.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tools.slice(0, showExpanded ? tools.length : 3).map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center rounded-md bg-node-system-bg px-1.5 py-[2px] text-[9px] font-medium text-node-system"
            >
              {tool}
            </span>
          ))}
          {!showExpanded && tools.length > 3 && (
            <span className="text-[9px] text-muted-foreground">+{tools.length - 3}</span>
          )}
        </div>
      )}

      {showMeta && isFutureView && isChanged && nodeData.reviewCheckpoint && (
        <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium text-node-ai">
          <span className="h-1.5 w-1.5 rounded-full bg-node-ai" />
          {t("node.humanReview")}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border-2 !border-border/80 !bg-white"
      />
    </div>
  );
});

ProcessNode.displayName = "ProcessNode";

export default ProcessNode;
