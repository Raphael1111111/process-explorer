import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Eye, FileText, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ProcessTemplate } from "@/data/processTemplates";
import type { StoredWorkflow } from "@/hooks/useWorkflowStorage";
import type { ProcessNodeData } from "@/types/process";
import { cn } from "@/lib/utils";

interface OnboardingProps {
  templates: ProcessTemplate[];
  storedWorkflow?: StoredWorkflow | null;
  onComplete: (processName: string, firstStep: string) => void;
  onLoadTemplate: (templateId: string) => void;
  onResume?: () => void;
  onBack?: () => void;
}

const FLOW_STEPS = [
  {
    icon: FileText,
    title: "Skizzieren",
    text: "Zeichne den Ablauf Schritt für Schritt.",
  },
  {
    icon: Eye,
    title: "Verfeinern",
    text: "Kurz beschreiben, wer wann was macht.",
  },
  {
    icon: Sparkles,
    title: "KI prüfen",
    text: "Pro Schritt entscheiden: bleibt, hilft, neu.",
  },
];

const Onboarding = ({
  templates,
  storedWorkflow,
  onComplete,
  onLoadTemplate,
  onResume,
  onBack,
}: OnboardingProps) => {
  const [processName, setProcessName] = useState("");
  const [firstStep, setFirstStep] = useState("");

  const canStart = processName.trim() && firstStep.trim();

  const templateStats = useMemo(
    () =>
      templates.map((template) => ({
        id: template.id,
        steps: template.nodes.length,
        changed: template.nodes.filter(
          (node) => ((node.data as ProcessNodeData).futureMode ?? "same") !== "same",
        ).length,
      })),
    [templates],
  );

  const hasResume = Boolean(storedWorkflow && storedWorkflow.nodes.length > 0);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_hsl(var(--node-process-bg)),_white_45%),linear-gradient(180deg,white,#fafbfd)]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-10">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Zur Übersicht
          </button>
        )}

        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          {/* Left: pitch + 3 phase preview */}
          <div className="flex flex-col gap-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-node-process/25 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-node-process" />
                Workflow Builder
              </div>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-5xl">
                Mal' deinen Prozess.
                <br />
                <span className="text-muted-foreground">Sieh, wo KI hilft.</span>
              </h1>
              <p className="max-w-md text-base leading-7 text-muted-foreground">
                In drei Phasen: zuerst skizzieren, dann verfeinern, dann KI durchdenken.
                Du wirst Schritt für Schritt geführt — auch ohne Vorwissen.
              </p>
            </div>

            <div className="grid gap-3">
              {FLOW_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border border-border/60 bg-white/80 p-3.5 shadow-sm transition-all hover:bg-white",
                      "animate-fade-in",
                    )}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {index + 1}
                        </span>
                        <p className="text-sm font-semibold text-foreground">{step.title}</p>
                      </div>
                      <p className="text-[13px] leading-5 text-muted-foreground">{step.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasResume && storedWorkflow && (
              <button
                type="button"
                onClick={onResume}
                className="group flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-left transition-all hover:bg-primary/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Letzten Stand fortsetzen
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {storedWorkflow.processName || "Unbenannt"} ·{" "}
                    {storedWorkflow.nodes.length} Schritte
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </div>

          {/* Right: start options */}
          <Card className="rounded-[28px] border border-white/80 bg-white/95 p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  Vorlagen
                </p>
                <h2 className="mt-1 text-xl font-semibold text-foreground">
                  Mit einem Beispiel starten
                </h2>
              </div>

              <div className="grid gap-2">
                {templates.map((template) => {
                  const stats = templateStats.find((entry) => entry.id === template.id);
                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => onLoadTemplate(template.id)}
                      className="group flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-white p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md"
                    >
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <p className="text-sm font-semibold text-foreground">{template.title}</p>
                        <p className="text-[12px] leading-5 text-muted-foreground line-clamp-2">
                          {template.summary}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                            {stats?.steps ?? template.nodes.length} Schritte
                          </span>
                          {(stats?.changed ?? 0) > 0 && (
                            <span className="rounded-full bg-node-ai-bg px-2 py-0.5 text-[10px] text-node-ai">
                              {stats?.changed} mit KI
                            </span>
                          )}
                          {template.tools.slice(0, 2).map((tool) => (
                            <span
                              key={tool}
                              className="rounded-full bg-node-system-bg px-2 py-0.5 text-[10px] text-node-system"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border/60" />
                <p className="relative mx-auto w-fit bg-white px-3 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  oder leer beginnen
                </p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-foreground" htmlFor="process-name">
                      Prozessname
                    </label>
                    <Input
                      id="process-name"
                      value={processName}
                      onChange={(e) => setProcessName(e.target.value)}
                      className="h-11 rounded-xl"
                      placeholder="z. B. Reklamation"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-foreground" htmlFor="first-step">
                      Erster Schritt
                    </label>
                    <Input
                      id="first-step"
                      value={firstStep}
                      onChange={(e) => setFirstStep(e.target.value)}
                      className="h-11 rounded-xl"
                      placeholder="z. B. Anfrage kommt an"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && canStart) {
                          onComplete(processName.trim(), firstStep.trim());
                        }
                      }}
                    />
                  </div>
                </div>

                <Button
                  size="lg"
                  className="h-12 w-full rounded-xl"
                  disabled={!canStart}
                  onClick={() => onComplete(processName.trim(), firstStep.trim())}
                >
                  Loslegen
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
