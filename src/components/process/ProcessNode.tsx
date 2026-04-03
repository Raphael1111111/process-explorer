import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

import {
  FUTURE_MODE_CONFIG,
  NODE_TYPE_CONFIG,
  type CanvasView,
  type FutureMode,
  type NodeType,
  type ProcessNodeData,
} from "@/types/process";
import { cn } from "@/lib/utils";

type ViewNodeData = ProcessNodeData & {
  viewMode?: CanvasView;
};

const ProcessNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as ViewNodeData;
  const config = NODE_TYPE_CONFIG[nodeData.nodeType as NodeType];
  const viewMode = nodeData.viewMode ?? "current";
  const futureMode = (nodeData.futureMode ?? "same") as FutureMode;
  const futureConfig = FUTURE_MODE_CONFIG[futureMode];
  const isFutureView = viewMode === "future";
  const isChanged = futureMode !== "same";

  const title = isFutureView && isChanged ? nodeData.futureLabel || nodeData.label : nodeData.label;

  const currentMeta =
    nodeData.nodeType === "process"
      ? [nodeData.responsible, nodeData.duration].filter(Boolean).join(" • ")
      : nodeData.nodeType === "decision"
        ? nodeData.options
        : nodeData.nodeType === "bottleneck"
          ? nodeData.impact || nodeData.frequency || nodeData.problem
          : nodeData.systemType || nodeData.connectedTo;

  const futureMeta = isChanged
    ? nodeData.reviewCheckpoint
      ? "Freigabe bleibt"
      : nodeData.aiTask || "Mit KI geändert"
    : currentMeta;

  return (
    <div
      className={cn(
        "relative min-w-[180px] max-w-[220px] rounded-[18px] border bg-white px-4 py-3 shadow-[0_8px_22px_rgba(15,23,42,0.06)] transition-all",
        config.borderClass,
        config.bgClass,
        isFutureView && isChanged && "border-node-ai/35 bg-white shadow-[0_10px_26px_rgba(109,40,217,0.08)]",
        selected && "ring-2 ring-primary/20 shadow-[0_12px_30px_rgba(37,99,235,0.12)]",
        nodeData.isFresh && "process-node-fresh",
      )}
    >
      <Handle type="target" position={Position.Left} className="!h-2 !w-2 !border-border !bg-white" />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className={cn("text-xs font-semibold", config.colorClass)}>{config.emoji}</span>
            <span className={cn("text-[10px] font-semibold uppercase tracking-[0.18em]", config.colorClass)}>
              {config.label}
            </span>
          </div>
          <p className="text-sm font-semibold leading-5 text-foreground">{String(title || "")}</p>
        </div>

        {isFutureView && (
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-1 text-[10px] font-medium",
              futureConfig.badgeClass,
            )}
          >
            {futureConfig.shortLabel}
          </span>
        )}
      </div>

      {((!isFutureView && currentMeta) || (isFutureView && futureMeta)) && (
        <div className="mt-2 rounded-full bg-white/80 px-2.5 py-1 text-[11px] leading-4 text-muted-foreground">
          {String(isFutureView ? futureMeta : currentMeta)}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!h-2 !w-2 !border-border !bg-white" />
    </div>
  );
});

ProcessNode.displayName = "ProcessNode";

export default ProcessNode;
