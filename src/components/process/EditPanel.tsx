import { useState, type ReactNode } from "react";
import { Trash2, X } from "lucide-react";

import {
  FUTURE_MODE_CONFIG,
  NODE_TYPE_CONFIG,
  type FutureMode,
  type ProcessNodeData,
} from "@/types/process";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface EditPanelProps {
  nodeData: ProcessNodeData;
  stage: "current" | "future";
  onUpdate: (data: Partial<ProcessNodeData>) => void;
  onClose: () => void;
  onDelete: () => void;
}

const FieldLabel = ({
  children,
  htmlFor,
  hint,
}: {
  children: string;
  htmlFor?: string;
  hint?: string;
}) => (
  <div className="mb-2 flex items-center gap-2">
    <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {children}
    </Label>
    {hint && (
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-[11px] text-muted-foreground"
        title={hint}
      >
        ?
      </span>
    )}
  </div>
);

const Section = ({ children }: { children: ReactNode }) => (
  <div className="space-y-3 rounded-[20px] border border-border/70 bg-white p-3">{children}</div>
);

const TogglePanelButton = ({
  open,
  closedLabel,
  openLabel,
  onClick,
}: {
  open: boolean;
  closedLabel: string;
  openLabel: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-2xl border border-border/70 bg-white px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
  >
    {open ? openLabel : closedLabel}
  </button>
);

const EditPanel = ({ nodeData, stage, onUpdate, onClose, onDelete }: EditPanelProps) => {
  const config = NODE_TYPE_CONFIG[nodeData.nodeType];
  const futureMode = (nodeData.futureMode ?? "same") as FutureMode;
  const [showCurrentExtras, setShowCurrentExtras] = useState(() =>
    Boolean(
      nodeData.responsible ||
        nodeData.duration ||
        nodeData.options ||
        nodeData.frequency ||
        nodeData.impact ||
        nodeData.systemType ||
        nodeData.connectedTo,
    ),
  );
  const [showFutureExtras, setShowFutureExtras] = useState(() =>
    Boolean(
      nodeData.futureLabel ||
        nodeData.aiInput ||
        nodeData.aiOutput ||
        nodeData.techDetails ||
        nodeData.reviewCheckpoint,
    ),
  );

  return (
    <aside className="h-full w-full max-w-[340px] overflow-y-auto rounded-[24px] border border-border/70 bg-[#fcfcfc] p-3 shadow-sm lg:w-[340px]">
      <div className="sticky top-0 z-10 mb-3 flex items-start justify-between rounded-[20px] border border-border/70 bg-white/95 p-3 shadow-sm backdrop-blur">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-semibold", config.colorClass)}>{config.emoji}</span>
            <span className={cn("text-[11px] font-semibold uppercase tracking-[0.2em]", config.colorClass)}>
              {config.label}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            {stage === "current" ? "Schritt bearbeiten" : "KI-Version festlegen"}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {stage === "current"
              ? "Trage nur das Wichtigste ein."
              : "Wähle zuerst, was sich ändert."}
          </p>
        </div>

        <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-muted" title="Schließen">
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-3">
        {stage === "current" && (
          <>
            <Section>
              <div>
                <FieldLabel htmlFor="node-label" children="Name" />
                <Input
                  id="node-label"
                  value={nodeData.label}
                  onChange={(event) => onUpdate({ label: event.target.value })}
                  className="h-12 rounded-2xl"
                  placeholder="Name des Schritts"
                />
              </div>

              <div>
                <FieldLabel
                  htmlFor="node-description"
                  children={nodeData.nodeType === "bottleneck" ? "Kurz zum Problem" : "Kurz erklärt"}
                  hint="Ein kurzer Satz reicht."
                />
                <Textarea
                  id="node-description"
                  value={nodeData.description || ""}
                  onChange={(event) => onUpdate({ description: event.target.value })}
                  className="min-h-[110px] rounded-2xl"
                  placeholder={
                    nodeData.nodeType === "decision"
                      ? "Was passiert an dieser Stelle?"
                      : nodeData.nodeType === "system"
                        ? "Wofür ist dieses System da?"
                        : nodeData.nodeType === "bottleneck"
                          ? "Was läuft hier schlecht?"
                          : "Was passiert hier?"
                  }
                />
              </div>
            </Section>

            <TogglePanelButton
              open={showCurrentExtras}
              closedLabel="Mehr Angaben"
              openLabel="Weniger Angaben"
              onClick={() => setShowCurrentExtras((value) => !value)}
            />

            {showCurrentExtras && nodeData.nodeType === "process" && (
              <Section>
                <div>
                  <FieldLabel htmlFor="node-responsible" children="Wer?" />
                  <Input
                    id="node-responsible"
                    value={nodeData.responsible || ""}
                    onChange={(event) => onUpdate({ responsible: event.target.value })}
                    className="h-12 rounded-2xl"
                    placeholder="z. B. Vertrieb"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="node-duration" children="Dauer" />
                  <Input
                    id="node-duration"
                    value={nodeData.duration || ""}
                    onChange={(event) => onUpdate({ duration: event.target.value })}
                    className="h-12 rounded-2xl"
                    placeholder="z. B. 30 Min"
                  />
                </div>
              </Section>
            )}

            {showCurrentExtras && nodeData.nodeType === "decision" && (
              <Section>
                <div>
                  <FieldLabel htmlFor="node-question" children="Frage" />
                  <Input
                    id="node-question"
                    value={nodeData.question || ""}
                    onChange={(event) => onUpdate({ question: event.target.value })}
                    className="h-12 rounded-2xl"
                    placeholder="z. B. Sind alle Daten da?"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="node-options" children="Antworten" />
                  <Input
                    id="node-options"
                    value={nodeData.options || ""}
                    onChange={(event) => onUpdate({ options: event.target.value })}
                    className="h-12 rounded-2xl"
                    placeholder="z. B. Ja / Nein"
                  />
                </div>
              </Section>
            )}

            {showCurrentExtras && nodeData.nodeType === "bottleneck" && (
              <Section>
                <div>
                  <FieldLabel htmlFor="node-problem" children="Problem" />
                  <Textarea
                    id="node-problem"
                    value={nodeData.problem || ""}
                    onChange={(event) => onUpdate({ problem: event.target.value })}
                    className="min-h-[96px] rounded-2xl"
                    placeholder="Was bremst hier?"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="node-frequency" children="Wie oft?" />
                  <Input
                    id="node-frequency"
                    value={nodeData.frequency || ""}
                    onChange={(event) => onUpdate({ frequency: event.target.value })}
                    className="h-12 rounded-2xl"
                    placeholder="z. B. oft"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="node-impact" children="Folge" />
                  <Input
                    id="node-impact"
                    value={nodeData.impact || ""}
                    onChange={(event) => onUpdate({ impact: event.target.value })}
                    className="h-12 rounded-2xl"
                    placeholder="z. B. Wartezeit"
                  />
                </div>
              </Section>
            )}

            {showCurrentExtras && nodeData.nodeType === "system" && (
              <Section>
                <div>
                  <FieldLabel htmlFor="node-system-type" children="Art" />
                  <Input
                    id="node-system-type"
                    value={nodeData.systemType || ""}
                    onChange={(event) => onUpdate({ systemType: event.target.value })}
                    className="h-12 rounded-2xl"
                    placeholder="z. B. CRM"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="node-connected-to" children="Verbunden mit" />
                  <Input
                    id="node-connected-to"
                    value={nodeData.connectedTo || ""}
                    onChange={(event) => onUpdate({ connectedTo: event.target.value })}
                    className="h-12 rounded-2xl"
                    placeholder="z. B. E-Mail"
                  />
                </div>
              </Section>
            )}
          </>
        )}

        {stage === "future" && (
          <>
            <Section>
              <FieldLabel children="Was ändert sich?" />
              <div className="grid gap-2">
                {(Object.keys(FUTURE_MODE_CONFIG) as FutureMode[]).map((mode) => {
                  const option = FUTURE_MODE_CONFIG[mode];
                  const active = futureMode === mode;

                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => onUpdate({ futureMode: mode })}
                      className={cn(
                        "rounded-2xl border px-4 py-4 text-left transition-all",
                        active
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/70 bg-white hover:border-border",
                      )}
                      title={option.description}
                    >
                      <p className="font-medium text-foreground">{option.label}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </Section>

            {futureMode === "same" && (
              <Section>
                <p className="text-sm leading-6 text-muted-foreground">
                  Hier musst du nichts mehr eintragen.
                </p>
              </Section>
            )}

            {futureMode !== "same" && (
              <>
                <Section>
                  <div>
                    <FieldLabel
                      htmlFor="future-description"
                      children="Was ist neu?"
                      hint="Nur die Änderung beschreiben."
                    />
                    <Textarea
                      id="future-description"
                      value={nodeData.futureDescription || ""}
                      onChange={(event) => onUpdate({ futureDescription: event.target.value })}
                      className="min-h-[110px] rounded-2xl"
                      placeholder="Was läuft später anders?"
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="future-ai-task" children="KI macht" />
                    <Textarea
                      id="future-ai-task"
                      value={nodeData.aiTask || ""}
                      onChange={(event) => onUpdate({ aiTask: event.target.value })}
                      className="min-h-[96px] rounded-2xl"
                      placeholder="Was übernimmt die KI?"
                    />
                  </div>

                  <div>
                    <FieldLabel htmlFor="future-human-role" children="Mensch macht" />
                    <Textarea
                      id="future-human-role"
                      value={nodeData.humanRole || ""}
                      onChange={(event) => onUpdate({ humanRole: event.target.value })}
                      className="min-h-[96px] rounded-2xl"
                      placeholder="Was bleibt beim Menschen?"
                    />
                  </div>
                </Section>

                <TogglePanelButton
                  open={showFutureExtras}
                  closedLabel="Technische Angaben"
                  openLabel="Technische Angaben ausblenden"
                  onClick={() => setShowFutureExtras((value) => !value)}
                />

                {showFutureExtras && (
                  <Section>
                    <div>
                      <FieldLabel
                        htmlFor="future-label"
                        children="Name in der KI-Version"
                        hint="Kann leer bleiben, wenn der Name gleich ist."
                      />
                      <Input
                        id="future-label"
                        value={nodeData.futureLabel || ""}
                        onChange={(event) => onUpdate({ futureLabel: event.target.value })}
                        className="h-12 rounded-2xl"
                        placeholder={nodeData.label}
                      />
                    </div>

                    <div>
                      <FieldLabel htmlFor="future-ai-input" children="KI braucht" />
                      <Input
                        id="future-ai-input"
                        value={nodeData.aiInput || ""}
                        onChange={(event) => onUpdate({ aiInput: event.target.value })}
                        className="h-12 rounded-2xl"
                        placeholder="z. B. Anfrage, Daten, Dokumente"
                      />
                    </div>

                    <div>
                      <FieldLabel htmlFor="future-ai-output" children="KI liefert" />
                      <Input
                        id="future-ai-output"
                        value={nodeData.aiOutput || ""}
                        onChange={(event) => onUpdate({ aiOutput: event.target.value })}
                        className="h-12 rounded-2xl"
                        placeholder="z. B. Entwurf oder Prüfung"
                      />
                    </div>

                    <div>
                      <FieldLabel
                        htmlFor="future-tech-details"
                        children="Technik"
                        hint="Hier darf es technischer sein."
                      />
                      <Textarea
                        id="future-tech-details"
                        value={nodeData.techDetails || ""}
                        onChange={(event) => onUpdate({ techDetails: event.target.value })}
                        className="min-h-[110px] rounded-2xl"
                        placeholder="z. B. CRM-Anbindung, Freigabe, Schnittstelle"
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-white px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">Mensch prüft am Schluss</p>
                        <p className="text-sm text-muted-foreground">
                          Aktivieren, wenn eine Freigabe bleibt.
                        </p>
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
          </>
        )}

        <Button
          variant="ghost"
          className="h-12 w-full rounded-2xl text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Löschen
        </Button>
      </div>
    </aside>
  );
};

export default EditPanel;
