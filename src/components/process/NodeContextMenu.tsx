import { useEffect, useRef } from "react";
import { ArrowRightFromLine, Copy, Repeat, Trash2, AlertTriangle } from "lucide-react";

import { useTranslation } from "@/lib/i18n";
import type { ProcessNodeData } from "@/types/process";

interface NodeContextMenuProps {
  x: number;
  y: number;
  nodeData: ProcessNodeData;
  onClose: () => void;
  onInsertAfter: () => void;
  onDuplicate: () => void;
  onToggleBottleneck: () => void;
  onCycleType: () => void;
  onDelete: () => void;
}

const NodeContextMenu = ({
  x,
  y,
  nodeData,
  onClose,
  onInsertAfter,
  onDuplicate,
  onToggleBottleneck,
  onCycleType,
  onDelete,
}: NodeContextMenuProps) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", onDoc);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDoc);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const items: Array<{
    icon: typeof Trash2;
    label: string;
    onClick: () => void;
    danger?: boolean;
    divider?: boolean;
  }> = [
    {
      icon: ArrowRightFromLine,
      label: t("context.insertAfter"),
      onClick: () => {
        onInsertAfter();
        onClose();
      },
    },
    {
      icon: Copy,
      label: t("context.duplicate"),
      onClick: () => {
        onDuplicate();
        onClose();
      },
    },
    {
      icon: Repeat,
      label: t("context.cycleType"),
      onClick: () => {
        onCycleType();
        onClose();
      },
    },
    {
      icon: AlertTriangle,
      label: nodeData.isBottleneck
        ? t("context.toggleBottleneck.off")
        : t("context.toggleBottleneck.on"),
      onClick: () => {
        onToggleBottleneck();
        onClose();
      },
      divider: true,
    },
    {
      icon: Trash2,
      label: t("context.delete"),
      onClick: () => {
        onDelete();
        onClose();
      },
      danger: true,
    },
  ];

  return (
    <div
      ref={ref}
      style={{ left: x, top: y }}
      className="fixed z-50 min-w-[210px] overflow-hidden rounded-xl border border-border/70 bg-white p-1 shadow-[0_18px_44px_rgba(15,23,42,0.18)]"
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, i) => (
        <div key={i}>
          {item.divider && <div className="my-1 h-px bg-border/60" />}
          <button
            type="button"
            onClick={item.onClick}
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
              item.danger
                ? "text-destructive hover:bg-destructive/10"
                : "text-foreground hover:bg-muted/60"
            }`}
          >
            <item.icon className="h-4 w-4 opacity-80" />
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default NodeContextMenu;
