import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { ProcessNodeData, NODE_TYPE_CONFIG } from '@/types/process';
import { cn } from '@/lib/utils';

interface ProcessNodeProps extends NodeProps {
  data: ProcessNodeData & { isAiView?: boolean };
}

const ProcessNode = memo(({ data, selected }: ProcessNodeProps) => {
  const config = NODE_TYPE_CONFIG[data.nodeType];
  const isAiExpanded = data.nodeType === 'ai' && data.isAiView;

  return (
    <div
      className={cn(
        'rounded-xl border-2 px-5 py-3 shadow-sm transition-all min-w-[180px] max-w-[280px]',
        config.bgClass,
        config.borderClass,
        selected && 'ring-2 ring-primary/30 shadow-md',
        data.nodeType === 'decision' && 'rotate-0',
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!border-border"
      />

      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{config.emoji}</span>
        <span className={cn('text-xs font-medium uppercase tracking-wide', config.colorClass)}>
          {config.label}
        </span>
      </div>

      <p className="text-base font-semibold text-foreground leading-snug">
        {data.label}
      </p>

      {data.description && !isAiExpanded && (
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          {data.description}
        </p>
      )}

      {isAiExpanded && (
        <div className="mt-3 space-y-2 text-sm border-t border-node-ai/20 pt-3 animate-fade-in">
          {data.aiTask && (
            <div>
              <span className="font-medium text-node-ai">Aufgabe:</span>
              <span className="text-muted-foreground ml-1">{data.aiTask}</span>
            </div>
          )}
          {data.aiInput && (
            <div>
              <span className="font-medium text-node-ai">Input:</span>
              <span className="text-muted-foreground ml-1">{data.aiInput}</span>
            </div>
          )}
          {data.aiOutput && (
            <div>
              <span className="font-medium text-node-ai">Output:</span>
              <span className="text-muted-foreground ml-1">{data.aiOutput}</span>
            </div>
          )}
          {data.involvedSystems && (
            <div>
              <span className="font-medium text-node-ai">Systeme:</span>
              <span className="text-muted-foreground ml-1">{data.involvedSystems}</span>
            </div>
          )}
          {data.needsHumanApproval && (
            <div className="flex items-center gap-1 text-node-bottleneck">
              <span>👤</span>
              <span className="font-medium">Menschliche Freigabe nötig</span>
            </div>
          )}
          {data.checkpoint && (
            <div className="flex items-center gap-1 text-node-decision">
              <span>✓</span>
              <span className="font-medium">Prüfpunkt</span>
            </div>
          )}
          {data.handoverTo && (
            <div>
              <span className="font-medium text-node-ai">Übergabe an:</span>
              <span className="text-muted-foreground ml-1">{data.handoverTo}</span>
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!border-border"
      />
    </div>
  );
});

ProcessNode.displayName = 'ProcessNode';
export default ProcessNode;
