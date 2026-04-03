import { Button } from "@/components/ui/button";

interface LandingHubProps {
  onOpenQuestionnaire: () => void;
  onOpenBuilder: () => void;
}

const LandingHub = ({ onOpenQuestionnaire, onOpenBuilder }: LandingHubProps) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
            Process Explorer
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Was möchten Sie öffnen?
          </h1>

          <div className="mt-12 grid gap-4">
            <Button
              variant="outline"
              size="lg"
              className="h-16 rounded-3xl border-border/80 bg-white text-lg font-medium text-foreground hover:bg-muted/40"
              onClick={onOpenQuestionnaire}
            >
              Fragebogen
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-16 rounded-3xl border-border/80 bg-white text-lg font-medium text-foreground hover:bg-muted/40"
              onClick={onOpenBuilder}
            >
              Workflow Builder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingHub;
