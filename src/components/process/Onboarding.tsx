import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (processName: string, firstStep: string) => void;
  onLoadExample: () => void;
}

const Onboarding = ({ onComplete, onLoadExample }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [processName, setProcessName] = useState('');
  const [firstStep, setFirstStep] = useState('');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="max-w-lg w-full px-6 animate-fade-in">
        {step === 0 && (
          <div className="space-y-8 text-center">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Prozesse verstehen,
                <br />
                <span className="text-primary">KI-Potenziale entdecken</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Bilden Sie einen Geschäftsprozess ab und finden Sie heraus, wo KI sinnvoll unterstützen kann.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full text-lg h-14"
                onClick={() => setStep(1)}
              >
                Neuen Prozess starten
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-lg h-14"
                onClick={onLoadExample}
              >
                Beispiel-Prozess laden
              </Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Wie heißt der Prozess?
              </h2>
              <p className="text-muted-foreground">
                Geben Sie dem Prozess einen einfachen Namen.
              </p>
            </div>
            <Input
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              className="text-xl h-14"
              placeholder="z.B. Angebotserstellung, Reklamation..."
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && processName.trim() && setStep(2)}
            />
            <Button
              size="lg"
              className="w-full text-lg h-14"
              disabled={!processName.trim()}
              onClick={() => setStep(2)}
            >
              Weiter
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Was ist der erste Schritt?
              </h2>
              <p className="text-muted-foreground">
                Wie beginnt der Prozess? Was passiert zuerst?
              </p>
            </div>
            <Input
              value={firstStep}
              onChange={(e) => setFirstStep(e.target.value)}
              className="text-xl h-14"
              placeholder="z.B. Anfrage geht ein, Bestellung wird erfasst..."
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && firstStep.trim() && onComplete(processName, firstStep)}
            />
            <Button
              size="lg"
              className="w-full text-lg h-14"
              disabled={!firstStep.trim()}
              onClick={() => onComplete(processName, firstStep)}
            >
              Prozess starten
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
