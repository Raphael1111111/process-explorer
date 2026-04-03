import { NODE_TYPE_CONFIG, type NodeType } from '@/types/process';
import { cn } from '@/lib/utils';

interface NodePaletteProps {
  onAddNode: (type: NodeType) => void;
}

const NodePalette = ({ onAddNode }: NodePaletteProps) => {
  const types = Object.entries(NODE_TYPE_CONFIG) as [NodeType, typeof NODE_TYPE_CONFIG[NodeType]][];

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
      {types.map(([type, config]) => (
        <button
          key={type}
          onClick={() => onAddNode(type)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg border bg-background shadow-sm',
            'hover:shadow-md transition-all text-sm font-medium',
            'hover:scale-105 active:scale-95',
            config.borderClass,
          )}
          title={`${config.label} hinzufügen`}
        >
          <span>{config.emoji}</span>
          <span className="hidden lg:inline text-foreground">{config.label}</span>
        </button>
      ))}
    </div>
  );
};

export default NodePalette;
