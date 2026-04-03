import { type ProcessNodeData, NODE_TYPE_CONFIG, GUIDING_QUESTIONS } from '@/types/process';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { X, Lightbulb, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EditPanelProps {
  nodeData: ProcessNodeData;
  onUpdate: (data: Partial<ProcessNodeData>) => void;
  onClose: () => void;
  onDelete: () => void;
}

const Hint = ({ text }: { text: string }) => (
  <p className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
    <Lightbulb className="w-3 h-3 mt-0.5 shrink-0 text-node-ai" />
    {text}
  </p>
);

const EditPanel = ({ nodeData, onUpdate, onClose, onDelete }: EditPanelProps) => {
  const config = NODE_TYPE_CONFIG[nodeData.nodeType];
  const [questionIdx] = useState(() => Math.floor(Math.random() * GUIDING_QUESTIONS.length));

  return (
    <div className="w-[360px] h-full bg-background border-l border-border p-6 overflow-y-auto animate-slide-in-right">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.emoji}</span>
          <span className={`text-sm font-semibold uppercase tracking-wide ${config.colorClass}`}>
            {config.label}
          </span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <Label className="text-base font-medium">Name</Label>
          <Input
            value={nodeData.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="mt-1 text-lg h-12"
            placeholder="Wie heisst dieser Schritt?"
          />
        </div>

        {/* Beschreibung – für alle */}
        <div>
          <Label>Beschreibung</Label>
          <Textarea
            value={nodeData.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="mt-1"
            placeholder="Was passiert hier genau?"
            rows={3}
          />
        </div>

        {/* Prozessschritt-spezifisch */}
        {nodeData.nodeType === 'process' && (
          <>
            <div>
              <Label>Dauer</Label>
              <Input
                value={nodeData.duration || ''}
                onChange={(e) => onUpdate({ duration: e.target.value })}
                className="mt-1"
                placeholder="z.B. 30 Minuten, 2 Tage"
              />
            </div>
            <div>
              <Label>Verantwortlich</Label>
              <Input
                value={nodeData.responsible || ''}
                onChange={(e) => onUpdate({ responsible: e.target.value })}
                className="mt-1"
                placeholder="Wer ist zuständig?"
              />
              <Hint text="Wo wiederholt sich Arbeit ständig?" />
            </div>
          </>
        )}

        {/* Entscheidung */}
        {nodeData.nodeType === 'decision' && (
          <>
            <div>
              <Label>Frage</Label>
              <Input
                value={nodeData.question || ''}
                onChange={(e) => onUpdate({ question: e.target.value })}
                className="mt-1"
                placeholder="Welche Frage wird hier beantwortet?"
              />
            </div>
            <div>
              <Label>Optionen</Label>
              <Input
                value={nodeData.options || ''}
                onChange={(e) => onUpdate({ options: e.target.value })}
                className="mt-1"
                placeholder="z.B. Ja / Nein, oder Genehmigt / Abgelehnt"
              />
              <Hint text="Könnte KI diese Entscheidung vorbereiten?" />
            </div>
          </>
        )}

        {/* Engpass */}
        {nodeData.nodeType === 'bottleneck' && (
          <>
            <div>
              <Label>Problem</Label>
              <Textarea
                value={nodeData.problem || ''}
                onChange={(e) => onUpdate({ problem: e.target.value })}
                className="mt-1"
                placeholder="Was ist das Problem?"
                rows={2}
              />
            </div>
            <div>
              <Label>Häufigkeit</Label>
              <Input
                value={nodeData.frequency || ''}
                onChange={(e) => onUpdate({ frequency: e.target.value })}
                className="mt-1"
                placeholder="z.B. täglich, bei jedem Auftrag"
              />
            </div>
            <div>
              <Label>Auswirkung</Label>
              <Input
                value={nodeData.impact || ''}
                onChange={(e) => onUpdate({ impact: e.target.value })}
                className="mt-1"
                placeholder="Was passiert dadurch?"
              />
              <Hint text="Wo warten Menschen auf etwas?" />
            </div>
          </>
        )}

        {/* KI-Schritt */}
        {nodeData.nodeType === 'ai' && (
          <>
            <div>
              <Label>Was macht die KI?</Label>
              <Textarea
                value={nodeData.aiTask || ''}
                onChange={(e) => onUpdate({ aiTask: e.target.value })}
                className="mt-1"
                placeholder="z.B. fasst E-Mails zusammen, prüft Dokumente"
                rows={2}
              />
              <Hint text="Was könnte KI vorbereiten, zusammenfassen, prüfen oder sortieren?" />
            </div>
            <div>
              <Label>Input</Label>
              <Input
                value={nodeData.aiInput || ''}
                onChange={(e) => onUpdate({ aiInput: e.target.value })}
                className="mt-1"
                placeholder="Was fließt hinein?"
              />
            </div>
            <div>
              <Label>Output</Label>
              <Input
                value={nodeData.aiOutput || ''}
                onChange={(e) => onUpdate({ aiOutput: e.target.value })}
                className="mt-1"
                placeholder="Was kommt heraus?"
              />
            </div>
            <div>
              <Label>Beteiligte Systeme</Label>
              <Input
                value={nodeData.involvedSystems || ''}
                onChange={(e) => onUpdate({ involvedSystems: e.target.value })}
                className="mt-1"
                placeholder="z.B. CRM, ERP, E-Mail"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Menschliche Freigabe nötig?</Label>
              <Switch
                checked={nodeData.needsHumanApproval || false}
                onCheckedChange={(checked) => onUpdate({ needsHumanApproval: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Prüfpunkt?</Label>
              <Switch
                checked={nodeData.checkpoint || false}
                onCheckedChange={(checked) => onUpdate({ checkpoint: checked })}
              />
            </div>
            <div>
              <Label>Übergabe an</Label>
              <Input
                value={nodeData.handoverTo || ''}
                onChange={(e) => onUpdate({ handoverTo: e.target.value })}
                className="mt-1"
                placeholder="An wen wird übergeben?"
              />
              <Hint text="Wo soll ein Mensch bewusst die Kontrolle behalten?" />
            </div>
          </>
        )}

        {/* System */}
        {nodeData.nodeType === 'system' && (
          <>
            <div>
              <Label>Systemtyp</Label>
              <Input
                value={nodeData.systemType || ''}
                onChange={(e) => onUpdate({ systemType: e.target.value })}
                className="mt-1"
                placeholder="z.B. CRM, ERP, Datenbank"
              />
            </div>
            <div>
              <Label>Verbunden mit</Label>
              <Input
                value={nodeData.connectedTo || ''}
                onChange={(e) => onUpdate({ connectedTo: e.target.value })}
                className="mt-1"
                placeholder="Welche anderen Systeme sind verbunden?"
              />
              <Hint text="Wo fehlen oft Informationen?" />
            </div>
          </>
        )}

        {/* Leitfrage */}
        <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-base">💡</span>
            <span className="italic">{GUIDING_QUESTIONS[questionIdx]}</span>
          </p>
        </div>

        {/* Löschen */}
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full mt-2"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Element löschen
        </Button>
      </div>
    </div>
  );
};

export default EditPanel;
