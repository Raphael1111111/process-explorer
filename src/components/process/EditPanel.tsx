import { useState, type ReactNode } from "react";
import { AlertTriangle, Plus, Sparkles, Trash2, X } from "lucide-react";

import { useTranslation } from "@/lib/i18n";
import {
  COMMON_TOOL_SUGGESTIONS,
  FUTURE_MODE_STYLE,
  NODE_TYPE_STYLE,
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
  const { t } = useTranslation();
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
            placeholder={t("edit.field.tools.placeholder")}
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
  const { t } = useTranslation();
  const style = NODE_TYPE_STYLE[nodeData.nodeType];
  const futureMode = (nodeData.futureMode ?? "same") as FutureMode;

  const subtitleKey =
    phase === "draft"
      ? "edit.subtitle.draft"
      : phase === "refine"
        ? "edit.subtitle.refine"
        : phase === "ai"
          ? "edit.subtitle.ai"
          : null;

  return (
    <aside className="edit-panel flex h-full w-[360px] shrink-0 flex-col overflow-hidden rounded-[24px] border border-border/70 bg-[#fcfcfd] shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3 border-b border-border/60 bg-white/95 p-4 backdrop-blur">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn("text-[12px] font-semibold leading-none", style.colorClass)}>
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
            {typeof position === "number" && typeof total === "number" && (
              <span className="ml-auto rounded-full bg-muted px-2 py-[2px] text-[10px] font-medium text-muted-foreground">
                {position + 1} / {total}
              </span>
            )}
          </div>
          <h2 className="text-base font-semibold text-foreground">
            {phase === "ai" ? t("edit.title.ai") : t("edit.title.refine")}
          </h2>
          {subtitleKey && (
            <p className="text-xs leading-5 text-muted-foreground">{t(subtitleKey)}</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted"
          title={t("common.close")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {(phase === "draft" || phase === "refine") && (
          <Section>
            <Field label={t("edit.field.name")}>
              <Input
                value={nodeData.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                className="h-11 rounded-xl"
                placeholder={t("edit.field.name.placeholder")}
                autoFocus
              />
            </Field>

            {phase === "draft" && (
              <Field label={t("edit.field.type")}>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(NODE_TYPE_STYLE) as NodeType[]).map((type) => {
                    const tStyle = NODE_TYPE_STYLE[type];
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
                        <span className={cn("text-base", tStyle.colorClass)}>{tStyle.emoji}</span>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">{t(tStyle.labelKey)}</p>
                          <p className="text-[10px] leading-4 text-muted-foreground">
                            {t(tStyle.descriptionKey)}
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
              <Field label={t("edit.field.shortDescription")} hint={t("edit.field.shortDescription.hint")}>
                <Textarea
                  value={nodeData.description || ""}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  className="min-h-[88px] rounded-xl text-sm"
                  placeholder={
                    nodeData.nodeType === "decision"
                      ? t("edit.field.shortDescription.placeholderDecision")
                      : t("edit.field.shortDescription.placeholderProcess")
                  }
                />
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Field label={t("edit.field.who")}>
                  <Input
                    value={nodeData.responsible || ""}
                    onChange={(e) => onUpdate({ responsible: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                    placeholder={t("edit.field.who.placeholder")}
                  />
                </Field>
                <Field label={t("edit.field.duration")}>
                  <Input
                    value={nodeData.duration || ""}
                    onChange={(e) => onUpdate({ duration: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                    placeholder={t("edit.field.duration.placeholder")}
                  />
                </Field>
              </div>

              <Field label={t("edit.field.tools")} hint={t("edit.field.tools.hint")}>
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
                    <p className="text-sm font-medium text-foreground">{t("edit.bottleneck.title")}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {t("edit.bottleneck.body")}
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
                  placeholder={t("edit.bottleneck.placeholder")}
                />
              )}
            </Section>
          </>
        )}

        {phase === "ai" && (
          <>
            <Section>
              <Field label={t("edit.ai.fieldLabel")}>
                <div className="space-y-2">
                  {(Object.keys(FUTURE_MODE_STYLE) as FutureMode[]).map((mode) => {
                    const opt = FUTURE_MODE_STYLE[mode];
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
                          <p className="text-sm font-medium text-foreground">{t(opt.labelKey)}</p>
                          <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                            {t(opt.descriptionKey)}
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
                <Field label={t("edit.ai.task")}>
                  <Textarea
                    value={nodeData.aiTask || ""}
                    onChange={(e) => onUpdate({ aiTask: e.target.value })}
                    className="min-h-[72px] rounded-xl text-sm"
                    placeholder={t("edit.ai.task.placeholder")}
                  />
                </Field>
                <Field label={t("edit.ai.human")}>
                  <Textarea
                    value={nodeData.humanRole || ""}
                    onChange={(e) => onUpdate({ humanRole: e.target.value })}
                    className="min-h-[60px] rounded-xl text-sm"
                    placeholder={t("edit.ai.human.placeholder")}
                  />
                </Field>

                <div className="flex items-center justify-between rounded-xl border border-border/70 bg-white px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("edit.ai.review.title")}</p>
                    <p className="text-[11px] text-muted-foreground">{t("edit.ai.review.body")}</p>
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
          title={t("edit.delete.title")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        {onAdvance && (
          <Button size="sm" className="ml-auto h-10 rounded-xl px-4" onClick={onAdvance}>
            {t("common.next")}
          </Button>
        )}
      </div>
    </aside>
  );
};

export default EditPanel;
