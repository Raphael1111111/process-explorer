import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-12">
        <div className="w-full max-w-2xl space-y-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-border bg-white">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>

          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
              Erfolg
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Ihre Informationen wurden gesendet.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Vielen Dank. Wir nutzen diese Angaben für die Vorbereitung des Workshops.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-14 rounded-3xl px-8"
              onClick={() => navigate("/")}
            >
              Zur Übersicht
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-14 rounded-3xl px-8"
              onClick={() => navigate(-1)}
            >
              Zurück
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
