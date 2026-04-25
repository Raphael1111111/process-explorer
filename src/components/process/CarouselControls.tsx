import { ChevronLeft, ChevronRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CarouselControlsProps {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  hint?: string;
  nextLabel?: string;
  finishLabel?: string;
}

const CarouselControls = ({
  index,
  total,
  onPrev,
  onNext,
  onFinish,
  hint,
  nextLabel = "Weiter",
  finishLabel = "Fertig",
}: CarouselControlsProps) => {
  const atStart = index <= 0;
  const atEnd = index >= total - 1;

  return (
    <div className="pointer-events-auto flex w-full max-w-3xl flex-col items-center gap-3">
      <div className="flex w-full items-center justify-center gap-2">
        {Array.from({ length: total }).map((_, dotIndex) => (
          <span
            key={dotIndex}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              dotIndex === index
                ? "w-8 bg-primary"
                : dotIndex < index
                  ? "w-1.5 bg-primary/60"
                  : "w-1.5 bg-muted",
            )}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-full border border-border/70 bg-white/95 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-full p-0"
          disabled={atStart}
          onClick={onPrev}
          title="Zurück"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="min-w-[120px] text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Schritt {index + 1} / {total}
          </p>
          {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
        </div>

        {atEnd ? (
          <Button size="sm" className="h-10 rounded-full px-5" onClick={onFinish}>
            <Check className="mr-1.5 h-4 w-4" />
            {finishLabel}
          </Button>
        ) : (
          <Button size="sm" className="h-10 rounded-full px-5" onClick={onNext}>
            {nextLabel}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CarouselControls;
