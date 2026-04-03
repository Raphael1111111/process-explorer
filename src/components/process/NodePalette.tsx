import { NODE_TYPE_CONFIG, type NodeType } from "@/types/process";
import { cn } from "@/lib/utils";

interface NodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

const ORDER: NodeType[] = ["process", "decision", "bottleneck", "system"];

const NodePalette = ({ onAddNode }: NodePaletteProps) => {
  return (
    <>
      <div className="absolute left-4 top-4 z-10 hidden rounded-2xl border border-border/70 bg-white/96 p-2 shadow-sm backdrop-blur lg:flex lg:flex-col lg:gap-2">
        {ORDER.map((type) => {
          const config = NODE_TYPE_CONFIG[type];

          return (
            <button
              key={type}
              onClick={() => onAddNode(type)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl border bg-white text-sm transition-all hover:bg-muted/40",
                config.borderClass,
                config.colorClass,
              )}
              title={config.label}
            >
              {config.emoji}
            </button>
          );
        })}
      </div>

      <div className="absolute inset-x-4 bottom-4 z-10 grid grid-cols-4 gap-2 lg:hidden">
        {ORDER.map((type) => {
          const config = NODE_TYPE_CONFIG[type];

          return (
            <button
              key={type}
              onClick={() => onAddNode(type)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-2xl border bg-white/96 px-3 py-3 text-sm font-medium shadow-sm backdrop-blur",
                config.borderClass,
              )}
              title={config.label}
            >
              <span className={config.colorClass}>{config.emoji}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};

export default NodePalette;
