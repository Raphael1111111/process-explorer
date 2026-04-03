import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ProcessTemplate } from "@/data/processTemplates";
import type { ProcessNodeData } from "@/types/process";

interface OnboardingProps {
  templates: ProcessTemplate[];
  onComplete: (processName: string, firstStep: string) => void;
  onLoadTemplate: (templateId: string) => void;
  onBack?: () => void;
}

const INTRO_STEPS = [
  {
    number: "1",
    title: "Ziel des Tools",
    text: "Der Workflow Builder hilft dir dabei, einen bestehenden Ablauf klar zu erfassen und eine mögliche KI-Version sichtbar zu machen.",
  },
  {
    number: "2",
    title: "Heutigen Ablauf aufnehmen",
    text: "Starte immer mit dem aktuellen Prozess. Ein Schritt pro Karte reicht, damit der Ablauf schnell verständlich wird.",
  },
  {
    number: "3",
    title: "Änderungen mit KI markieren",
    text: "Im zweiten Schritt markierst du nur die Stellen, an denen KI unterstützen oder einzelne Aufgaben neu übernehmen soll.",
  },
  {
    number: "4",
    title: "Vorher und Nachher vergleichen",
    text: "In der Vergleichsansicht siehst du den heutigen Ablauf und die KI-Version direkt nebeneinander.",
  },
  {
    number: "5",
    title: "So startest du",
    text: "Du kannst mit einer Vorlage beginnen oder deinen Prozess leer aufbauen. Alle Inhalte lassen sich später anpassen.",
  },
];

const Onboarding = ({ templates, onComplete, onLoadTemplate, onBack }: OnboardingProps) => {
  const [processName, setProcessName] = useState("");
  const [firstStep, setFirstStep] = useState("");
  const [introStepIndex, setIntroStepIndex] = useState(0);

  const canStart = processName.trim() && firstStep.trim();
  const currentIntroStep = INTRO_STEPS[introStepIndex];
  const isLastIntroStep = introStepIndex === INTRO_STEPS.length - 1;

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

  if (currentIntroStep) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-12">
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

          <div className="mx-auto my-auto w-full max-w-2xl">
            <Card className="rounded-[32px] border-border/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
              <CardContent className="space-y-8 p-8 md:p-10">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                    Workflow Builder
                  </p>
                  <div className="flex items-center gap-2">
                    {INTRO_STEPS.map((step, index) => (
                      <span
                        key={step.number}
                        className={
                          index === introStepIndex
                            ? "h-2.5 w-10 rounded-full bg-primary"
                            : "h-2.5 w-2.5 rounded-full bg-muted"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Schritt {introStepIndex + 1} von {INTRO_STEPS.length}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-base font-semibold text-foreground">
                    {currentIntroStep.number}
                  </div>
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    {currentIntroStep.title}
                  </h1>
                  <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                    {currentIntroStep.text}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-muted-foreground">
                    Kurz erklärt. Danach kannst du direkt mit dem Aufbau beginnen.
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="h-12 rounded-2xl px-6"
                      disabled={introStepIndex === 0}
                      onClick={() => setIntroStepIndex((current) => Math.max(0, current - 1))}
                    >
                      Zurück
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      className="h-12 rounded-2xl px-6"
                      onClick={() => {
                        if (isLastIntroStep) {
                          setIntroStepIndex(INTRO_STEPS.length);
                          return;
                        }

                        setIntroStepIndex((current) => current + 1);
                      }}
                    >
                      {isLastIntroStep ? "Zum Builder" : "Weiter"}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_hsl(var(--node-process-bg)),_white_42%),linear-gradient(180deg,white,white)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-12 px-6 py-12">
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

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-node-process/20 bg-white px-4 py-2 text-sm text-muted-foreground shadow-sm">
              <Sparkles className="h-4 w-4 text-node-process" />
              Erst heute. Dann mit KI.
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-6xl">
                Starte mit einer guten Vorlage oder ganz leer.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Wähle eine Vorlage oder lege deinen eigenen Ablauf an.
              </p>
            </div>

            <div className="rounded-[28px] border border-border/70 bg-white/90 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                Kurz zur Logik
              </p>
              <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                <p>1. Zeige zuerst den Ablauf von heute.</p>
                <p>2. Markiere danach nur die KI-Änderungen.</p>
                <p>3. Vergleiche am Ende beide Wege direkt.</p>
              </div>
            </div>
          </div>

          <Card className="rounded-[32px] border-white/80 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                  Vorlagen
                </p>
                <h2 className="text-2xl font-semibold text-foreground">
                  Wähle einen Startpunkt.
                </h2>
              </div>

              <div className="grid gap-3">
                {templates.map((template) => {
                  const stats = templateStats.find((entry) => entry.id === template.id);

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => onLoadTemplate(template.id)}
                      className="rounded-[28px] border border-border/70 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {template.tools.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xl font-semibold text-foreground">{template.title}</p>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {template.summary}
                          </p>
                        </div>
                        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                          {stats?.steps ?? template.nodes.length} Schritte
                        </span>
                        <span className="rounded-full bg-node-ai-bg px-3 py-1 text-node-ai">
                          {stats?.changed ?? 0} mit KI anders
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-[28px] border border-border/70 bg-[#fafbfc] p-5">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                    Oder leer starten
                  </p>
                  <h3 className="text-xl font-semibold text-foreground">
                    Eigener Prozess
                  </h3>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="process-name">
                      Prozessname
                    </label>
                    <Input
                      id="process-name"
                      value={processName}
                      onChange={(event) => setProcessName(event.target.value)}
                      className="h-14 rounded-2xl border-border/80 px-5 text-lg"
                      placeholder="z. B. Reklamation"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground" htmlFor="first-step">
                      Erster Schritt
                    </label>
                    <Input
                      id="first-step"
                      value={firstStep}
                      onChange={(event) => setFirstStep(event.target.value)}
                      className="h-14 rounded-2xl border-border/80 px-5 text-lg"
                      placeholder="z. B. Anfrage kommt an"
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && canStart) {
                          onComplete(processName.trim(), firstStep.trim());
                        }
                      }}
                    />
                  </div>

                  <Button
                    size="lg"
                    className="h-14 w-full rounded-2xl text-base"
                    disabled={!canStart}
                    onClick={() => onComplete(processName.trim(), firstStep.trim())}
                  >
                    Leer starten
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
