import { Check } from "lucide-react";

import { useTranslation } from "@/lib/i18n";
import { PHASE_META, PHASE_ORDER, type WorkflowPhase } from "@/types/process";
import { cn } from "@/lib/utils";

interface PhaseStepperProps {
  current: WorkflowPhase;
  onChange: (phase: WorkflowPhase) => void;
  disabledPhases?: WorkflowPhase[];
}

const PhaseStepper = ({ current, onChange, disabledPhases = [] }: PhaseStepperProps) => {
  const { t } = useTranslation();
  const currentIndex = PHASE_ORDER.indexOf(current);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {PHASE_ORDER.map((phase, index) => {
        const meta = PHASE_META[phase];
        const active = phase === current;
        const done = index < currentIndex;
        const disabled = disabledPhases.includes(phase);

        return (
          <button
            key={phase}
            type="button"
            disabled={disabled}
            onClick={() => onChange(phase)}
            className={cn(
              "group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all",
              active && "border-primary bg-primary/10 text-foreground shadow-sm",
              !active && !disabled && "border-border/70 bg-white text-muted-foreground hover:bg-muted/40",
              disabled && "cursor-not-allowed border-border/40 bg-white/40 text-muted-foreground/50",
            )}
            title={t(meta.descriptionKey)}
          >
            <span
              className={cn(
                "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold transition-all",
                active && "bg-primary text-primary-foreground",
                done && "bg-primary/20 text-primary",
                !active && !done && "bg-muted text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3 w-3" /> : meta.step}
            </span>
            <span className="font-medium">{t(meta.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PhaseStepper;
