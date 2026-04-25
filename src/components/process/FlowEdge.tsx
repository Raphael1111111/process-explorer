import { memo } from "react";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type EdgeProps } from "@xyflow/react";

const FlowEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
    data,
  }: EdgeProps) => {
    const [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 14,
    });

    const dimmed = (data as { dimmed?: boolean } | undefined)?.dimmed === true;
    const label = (data as { label?: string } | undefined)?.label;

    return (
      <>
        <BaseEdge
          id={id}
          path={edgePath}
          style={{
            stroke: selected ? "hsl(220 60% 55%)" : dimmed ? "hsl(220 15% 88%)" : "hsl(220 12% 75%)",
            strokeWidth: selected ? 2.4 : 1.6,
            opacity: dimmed ? 0.35 : 1,
            transition: "stroke 220ms ease, stroke-width 220ms ease, opacity 220ms ease",
          }}
        />
        {label && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: "absolute",
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: "all",
              }}
              className="rounded-full border border-border/70 bg-white px-2 py-[2px] text-[10px] font-medium text-muted-foreground shadow-sm"
            >
              {label}
            </div>
          </EdgeLabelRenderer>
        )}
      </>
    );
  },
);

FlowEdge.displayName = "FlowEdge";

export default FlowEdge;
