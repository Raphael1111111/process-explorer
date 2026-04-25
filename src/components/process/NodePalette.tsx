import { Plus } from "lucide-react";

import { NODE_TYPE_CONFIG, type NodeType } from "@/types/process";
import { cn } from "@/lib/utils";

interface NodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

const ORDER: NodeType[] = ["process", "decision"];

const NodePalette = ({ onAddNode }: NodePaletteProps) => {
  const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, type: NodeType) => {
    event.dataTransfer.setData("application/process-node", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="pointer-events-auto absolute left-4 top-4 z-10 flex flex-col gap-2 rounded-2xl border border-border/70 bg-white/95 p-2 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
      <p className="px-1.5 pt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Neu
      </p>
      {ORDER.map((type) => {
        const config = NODE_TYPE_CONFIG[type];
        return (
          <button
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            onClick={() => onAddNode(type)}
            className={cn(
              "group flex items-center gap-2 rounded-xl border bg-white px-2.5 py-2 text-left text-[13px] transition-all hover:-translate-y-px hover:shadow-sm active:cursor-grabbing",
              config.borderClass,
            )}
            title={`${config.label} hinzufügen — ziehen oder klicken`}
          >
            <span
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-lg text-sm",
                config.bgClass,
                config.colorClass,
              )}
            >
              {config.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium leading-none text-foreground">{config.label}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                {config.description}
              </p>
            </div>
            <Plus className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        );
      })}
      <p className="px-1.5 pb-1 pt-0.5 text-[9px] leading-tight text-muted-foreground">
        Ziehen oder klicken
      </p>
    </div>
  );
};

export default NodePalette;
