import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { type ProcessNodeData, NODE_TYPE_CONFIG, type NodeType } from '@/types/process';
import { cn } from '@/lib/utils';

const ProcessNode = memo(({ data, selected }: NodeProps) => {
  const d = data as ProcessNodeData & { isAiView?: boolean };
  const config = NODE_TYPE_CONFIG[d.nodeType as NodeType];
  const isAiExpanded = d.nodeType === 'ai' && d.isAiView;

  return (
    <div
      className={cn(
        'rounded-xl border-2 px-5 py-3 shadow-sm transition-all min-w-[180px] max-w-[280px]',
        config.bgClass,
        config.borderClass,
        selected && 'ring-2 ring-primary/30 shadow-md',
      )}
    >
      <Handle type="target" position={Position.Left} className="!border-border" />

      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{config.emoji}</span>
        <span className={cn('text-xs font-medium uppercase tracking-wide', config.colorClass)}>
          {config.label}
        </span>
      </div>

      <p className="text-base font-semibold text-foreground leading-snug">
        {String(d.label || '')}
      </p>

      {d.description && !isAiExpanded && (
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {String(d.description)}
        </p>
      )}

      {isAiExpanded && (
        <div className="mt-3 space-y-2 text-sm border-t border-node-ai/20 pt-3 animate-fade-in">
          {d.aiTask && (
            <div>
              <span className="font-medium text-node-ai">Aufgabe:</span>
              <span className="text-muted-foreground ml-1">{String(d.aiTask)}</span>
            </div>
          )}
          {d.aiInput && (
            <div>
              <span className="font-medium text-node-ai">Input:</span>
              <span className="text-muted-foreground ml-1">{String(d.aiInput)}</span>
            </div>
          )}
          {d.aiOutput && (
            <div>
              <span className="font-medium text-node-ai">Output:</span>
              <span className="text-muted-foreground ml-1">{String(d.aiOutput)}</span>
            </div>
          )}
          {d.involvedSystems && (
            <div>
              <span className="font-medium text-node-ai">Systeme:</span>
              <span className="text-muted-foreground ml-1">{String(d.involvedSystems)}</span>
            </div>
          )}
          {d.needsHumanApproval && (
            <div className="flex items-center gap-1 text-node-bottleneck">
              <span>👤</span>
              <span className="font-medium">Menschliche Freigabe nötig</span>
            </div>
          )}
          {d.checkpoint && (
            <div className="flex items-center gap-1 text-node-decision">
              <span>✓</span>
              <span className="font-medium">Prüfpunkt</span>
            </div>
          )}
          {d.handoverTo && (
            <div>
              <span className="font-medium text-node-ai">Übergabe an:</span>
              <span className="text-muted-foreground ml-1">{String(d.handoverTo)}</span>
            </div>
          )}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!border-border" />
    </div>
  );
});

ProcessNode.displayName = 'ProcessNode';
export default ProcessNode;
