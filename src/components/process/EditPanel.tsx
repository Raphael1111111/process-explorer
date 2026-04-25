import { useState, type ReactNode } from "react";
import { AlertTriangle, Plus, Sparkles, Trash2, X } from "lucide-react";

import {
  COMMON_TOOL_SUGGESTIONS,
  FUTURE_MODE_CONFIG,
  NODE_TYPE_CONFIG,
  type FutureMode,
  type NodeType,
  type ProcessNodeData,
  type WorkflowPhase,
} from "@/types/process";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EditPanelProps {
  nodeData: ProcessNodeData;
  phase: WorkflowPhase;
  onUpdate: (data: Partial<ProcessNodeData>) => void;
  onClose: () => void;
  onDelete: () => void;
  onAdvance?: () => void;
  position?: number;
  total?: number;
}

const Field = ({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-2">
      <Label className="text-[13px] font-medium text-foreground">{label}</Label>
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </div>
    {children}
  </div>
);

const Section = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("space-y-3 rounded-2xl border border-border/70 bg-white p-4", className)}>
    {children}
  </div>
);

const TagEditor = ({
  tools,
  onChange,
}: {
  tools: string[];
  onChange: (next: string[]) => void;
}) => {
  const [draft, setDraft] = useState("");

  const addTool = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (tools.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...tools, trimmed]);
    setDraft("");
  };

  const remove = (value: string) => onChange(tools.filter((t) => t !== value));

  const suggestions = COMMON_TOOL_SUGGESTIONS.filter((s) => !tools.includes(s));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tools.map((tool) => (
          <button
            key={tool}
            type="button"
            onClick={() => remove(tool)}
            className="group inline-flex items-center gap-1.5 rounded-full bg-node-system-bg px-2.5 py-1 text-xs font-medium text-node-system transition-colors hover:bg-node-system/15"
          >
            {tool}
            <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
          </button>
        ))}
        <div className="inline-flex items-center gap-1 rounded-full border border-dashed border-border/70 bg-white px-2 py-0.5">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTool(draft);
              }
            }}
            placeholder="Tool…"
            className="h-7 w-24 border-0 bg-transparent p-0 text-xs shadow-none focus-visible:ring-0"
          />
          {draft && (
            <button
              type="button"
              onClick={() => addTool(draft)}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted"
            >
              <Plus className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {suggestions.slice(0, 5).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTool(suggestion)}
              className="rounded-full border border-border/70 bg-white px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-muted/40"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const EditPanel = ({
  nodeData,
  phase,
  onUpdate,
  onClose,
  onDelete,
  onAdvance,
  position,
  total,
}: EditPanelProps) => {
  const config = NODE_TYPE_CONFIG[nodeData.nodeType];
  const futureMode = (nodeData.futureMode ?? "same") as FutureMode;

  return (
    <aside className="edit-panel flex h-full w-[360px] shrink-0 flex-col overflow-hidden rounded-[24px] border border-border/70 bg-[#fcfcfd] shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3 border-b border-border/60 bg-white/95 p-4 backdrop-blur">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn("text-[12px] font-semibold leading-none", config.colorClass)}>
              {config.emoji}
            </span>
            <span
              className={cn(
                "text-[10px] font-semibold uppercase tracking-[0.18em]",
                config.colorClass,
              )}
            >
              {config.label}
            </span>
            {typeof position === "number" && typeof total === "number" && (
              <span className="ml-auto rounded-full bg-muted px-2 py-[2px] text-[10px] font-medium text-muted-foreground">
                {position + 1} / {total}
              </span>
            )}
          </div>
          <h2 className="text-base font-semibold text-foreground">
            {phase === "ai" ? "KI-Möglichkeit" : "Schritt bearbeiten"}
          </h2>
          <p className="text-xs leading-5 text-muted-foreground">
            {phase === "draft"
              ? "Nur Name. Reihenfolge zählt."
              : phase === "refine"
                ? "Wer, was, wie lange."
                : phase === "ai"
                  ? "Eine Entscheidung reicht."
                  : ""}
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
          title="Schließen"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {(phase === "draft" || phase === "refine") && (
          <Section>
            <Field label="Name">
              <Input
                value={nodeData.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                className="h-11 rounded-xl"
                placeholder="Was passiert hier?"
                autoFocus
              />
            </Field>

            {phase === "draft" && (
              <Field label="Typ">
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(NODE_TYPE_CONFIG) as NodeType[]).map((type) => {
                    const tConfig = NODE_TYPE_CONFIG[type];
                    const active = nodeData.nodeType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => onUpdate({ nodeType: type })}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                          active
                            ? "border-primary bg-primary/8 text-foreground shadow-sm"
                            : "border-border/70 bg-white text-muted-foreground hover:bg-muted/30",
                        )}
                      >
                        <span className={cn("text-base", tConfig.colorClass)}>{tConfig.emoji}</span>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{tConfig.label}</p>
                          <p className="text-[10px] leading-4 text-muted-foreground">
                            {tConfig.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Field>
            )}
          </Section>
        )}

        {phase === "refine" && (
          <>
            <Section>
              <Field label="Kurz erklärt" hint="Ein Satz reicht.">
                <Textarea
                  value={nodeData.description || ""}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  className="min-h-[88px] rounded-xl text-sm"
                  placeholder={
                    nodeData.nodeType === "decision"
                      ? "Worüber wird entschieden?"
                      : "Was passiert in diesem Schritt?"
                  }
                />
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Field label="Wer?">
                  <Input
                    value={nodeData.responsible || ""}
                    onChange={(e) => onUpdate({ responsible: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                    placeholder="z. B. Sales"
                  />
                </Field>
                <Field label="Dauer">
                  <Input
                    value={nodeData.duration || ""}
                    onChange={(e) => onUpdate({ duration: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                    placeholder="z. B. 30 Min"
                  />
                </Field>
              </div>

              <Field label="Tools" hint="Wo passiert das?">
                <TagEditor
                  tools={nodeData.tools || []}
                  onChange={(tools) => onUpdate({ tools })}
                />
              </Field>
            </Section>

            <Section className="border-node-bottleneck/30 bg-node-bottleneck-bg/40">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-node-bottleneck" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Hier hakt es</p>
                    <p className="text-[11px] text-muted-foreground">
                      Markiere diesen Schritt als Engstelle.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={nodeData.isBottleneck || false}
                  onCheckedChange={(checked) => onUpdate({ isBottleneck: checked })}
                />
              </div>

              {nodeData.isBottleneck && (
                <Input
                  value={nodeData.bottleneckReason || ""}
                  onChange={(e) => onUpdate({ bottleneckReason: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                  placeholder="Was ist das Problem?"
                />
              )}
            </Section>
          </>
        )}

        {phase === "ai" && (
          <>
            <Section>
              <Field label="Was soll hier passieren?">
                <div className="space-y-2">
                  {(Object.keys(FUTURE_MODE_CONFIG) as FutureMode[]).map((mode) => {
                    const opt = FUTURE_MODE_CONFIG[mode];
                    const active = futureMode === mode;
                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => onUpdate({ futureMode: mode })}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-all",
                          active
                            ? "border-primary bg-primary/8 shadow-sm"
                            : "border-border/70 bg-white hover:bg-muted/20",
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-white",
                          )}
                        >
                          {active && <span className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">{opt.label}</p>
                          <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                            {opt.description}
                          </p>
                        </div>
                        {mode !== "same" && (
                          <Sparkles className="h-3.5 w-3.5 shrink-0 text-node-ai" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </Section>

            {futureMode !== "same" && (
              <Section>
                <Field label="KI übernimmt">
                  <Textarea
                    value={nodeData.aiTask || ""}
                    onChange={(e) => onUpdate({ aiTask: e.target.value })}
                    className="min-h-[72px] rounded-xl text-sm"
                    placeholder="Was macht die KI hier?"
                  />
                </Field>
                <Field label="Mensch macht">
                  <Textarea
                    value={nodeData.humanRole || ""}
                    onChange={(e) => onUpdate({ humanRole: e.target.value })}
                    className="min-h-[60px] rounded-xl text-sm"
                    placeholder="Was bleibt beim Menschen?"
                  />
                </Field>

                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-white px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">Mensch prüft am Schluss</p>
                    <p className="text-[11px] text-muted-foreground">Freigabe bleibt beim Menschen.</p>
                  </div>
                  <Switch
                    checked={nodeData.reviewCheckpoint || false}
                    onCheckedChange={(checked) => onUpdate({ reviewCheckpoint: checked })}
                  />
                </div>
              </Section>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-border/60 bg-white/95 p-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-10 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
          title="Diesen Schritt löschen"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        {onAdvance && (
          <Button size="sm" className="ml-auto h-10 rounded-xl px-4" onClick={onAdvance}>
            Weiter
          </Button>
        )}
      </div>
    </aside>
  );
};

export default EditPanel;
