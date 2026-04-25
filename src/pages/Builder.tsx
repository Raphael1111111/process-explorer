import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Edge, Node } from "@xyflow/react";

import Onboarding from "@/components/process/Onboarding";
import ProcessCanvas from "@/components/process/ProcessCanvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PROCESS_TEMPLATES, type ProcessTemplate } from "@/data/processTemplates";
import {
  clearWorkflow,
  loadWorkflow,
  type StoredWorkflow,
} from "@/hooks/useWorkflowStorage";
import type { ProcessNodeData, WorkflowPhase } from "@/types/process";

const cloneNodes = (nodes: Node[]) =>
  nodes.map((n) => ({
    ...n,
    position: { ...n.position },
    data: { ...(n.data as ProcessNodeData) },
  }));

const cloneEdges = (edges: Edge[]) => edges.map((e) => ({ ...e }));

const cloneTemplate = (template: ProcessTemplate) => ({
  processName: template.processName,
  nodes: cloneNodes(template.nodes),
  edges: cloneEdges(template.edges),
  phase: "draft" as WorkflowPhase,
});

interface CanvasProps {
  processName: string;
  nodes: Node[];
  edges: Edge[];
  phase: WorkflowPhase;
}

const Builder = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [canvasProps, setCanvasProps] = useState<CanvasProps | null>(null);
  const [storedWorkflow, setStoredWorkflow] = useState<StoredWorkflow | null>(null);

  useEffect(() => {
    if (hasAccess && !canvasProps) {
      setStoredWorkflow(loadWorkflow());
    }
  }, [hasAccess, canvasProps]);

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.trim().toLowerCase() === "workflow") {
      setHasAccess(true);
      setPasswordError("");
      return;
    }
    setPasswordError("Das Passwort ist nicht korrekt.");
  };

  const handleStart = (processName: string, firstStep: string) => {
    clearWorkflow();
    const firstNode: Node = {
      id: "node-1",
      type: "processNode",
      position: { x: 80, y: 80 },
      data: {
        label: firstStep,
        nodeType: "process",
        futureMode: "same",
      } as ProcessNodeData,
    };
    setCanvasProps({
      processName,
      nodes: [firstNode],
      edges: [],
      phase: "draft",
    });
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = PROCESS_TEMPLATES.find((entry) => entry.id === templateId);
    if (!template) return;
    clearWorkflow();
    setCanvasProps(cloneTemplate(template));
  };

  const handleResume = () => {
    if (!storedWorkflow) return;
    setCanvasProps({
      processName: storedWorkflow.processName,
      nodes: cloneNodes(storedWorkflow.nodes),
      edges: cloneEdges(storedWorkflow.edges),
      phase: storedWorkflow.phase,
    });
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-12">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Zur Übersicht
          </button>

          <div className="mx-auto my-auto w-full max-w-xl">
            <Card className="rounded-[32px] border-border/70 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
              <CardContent className="space-y-8 p-8 md:p-10">
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                      Workflow Builder
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                      Zugang zum Workflow Builder
                    </h1>
                    <p className="text-lg leading-8 text-muted-foreground">
                      Bitte gib das Passwort ein, um den Workflow Builder zu öffnen.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="builder-password" className="text-sm font-medium text-foreground">
                      Passwort
                    </label>
                    <Input
                      id="builder-password"
                      type="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      className="h-14 rounded-2xl border-border/80 px-5 text-lg"
                      placeholder="Passwort eingeben"
                      autoFocus
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground" aria-live="polite">
                      {passwordError || "Bitte gib das Passwort ein, um fortzufahren."}
                    </p>

                    <Button type="submit" size="lg" className="h-14 rounded-2xl px-8">
                      Weiter
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!canvasProps) {
    return (
      <Onboarding
        templates={PROCESS_TEMPLATES}
        storedWorkflow={storedWorkflow}
        onComplete={handleStart}
        onLoadTemplate={handleLoadTemplate}
        onResume={handleResume}
        onBack={() => navigate("/")}
      />
    );
  }

  return (
    <ProcessCanvas
      initialProcessName={canvasProps.processName}
      initialNodes={canvasProps.nodes}
      initialEdges={canvasProps.edges}
      initialPhase={canvasProps.phase}
    />
  );
};

export default Builder;
