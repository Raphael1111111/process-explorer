import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface QuestionnaireIntroProps {
  onBack: () => void;
}

const QuestionnaireIntro = ({ onBack }: QuestionnaireIntroProps) => {
  const navigate = useNavigate();
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setResult("Wird gesendet...");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        form.reset();
        navigate("/success");
        return;
      }

      setResult("Beim Senden ist ein Fehler aufgetreten.");
    } catch {
      setResult("Beim Senden ist ein Fehler aufgetreten.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl px-6 py-12">
        <div className="my-auto w-full">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Zur Übersicht
          </button>

          <div className="mt-8 max-w-2xl space-y-4">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
              Fragebogen
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Ein kurzer Fragebogen vor dem Workshop.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Bitte beantworten Sie kurz diese Fragen.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-10 max-w-3xl space-y-8">
            <input type="hidden" name="access_key" value="255c6b88-b428-4e2f-a754-b6bc56dd6e63" />
            <input type="hidden" name="subject" value="Neuer Fragebogen aus dem Process Explorer" />
            <input type="hidden" name="from_name" value="Process Explorer" />
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Was ist Ihr Name?
                </label>
                <Input
                  id="name"
                  name="name"
                  required
                  className="h-14 rounded-2xl"
                  placeholder="Vor- und Nachname"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-foreground">
                  Welche Rolle haben Sie im Unternehmen?
                </label>
                <Input
                  id="role"
                  name="rolle_im_unternehmen"
                  required
                  className="h-14 rounded-2xl"
                  placeholder="z. B. Geschäftsführung, Vertrieb, Marketing"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="repeating-tasks" className="text-sm font-medium text-foreground">
                Welche wiederkehrenden Aufgaben oder Prozesse kosten Sie im Arbeitsalltag unnötig Zeit oder Nerven?
              </label>
              <Textarea
                id="repeating-tasks"
                name="wiederkehrende_aufgaben_oder_prozesse"
                required
                className="min-h-[140px] rounded-2xl"
                placeholder="Beschreiben Sie kurz, was heute unnötig Zeit oder Nerven kostet."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="biggest-effort" className="text-sm font-medium text-foreground">
                In welchem Bereich Ihres Arbeitsalltags entsteht derzeit der grösste Aufwand?
              </label>
              <Input
                id="biggest-effort"
                name="groesster_aufwand_im_arbeitsalltag"
                required
                className="h-14 rounded-2xl"
                placeholder="z. B. E-Mails, Angebote, Planung oder Abstimmungen"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="relief-area" className="text-sm font-medium text-foreground">
                In welchem Bereich würden Sie sich besonders Entlastung wünschen?
              </label>
              <Input
                id="relief-area"
                name="bereich_fuer_besondere_entlastung"
                required
                className="h-14 rounded-2xl"
                placeholder="z. B. im Vertrieb, im Büro, im Service oder in der Produktion"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="topics" className="text-sm font-medium text-foreground">
                Gibt es konkrete Tools, Themen oder Anwendungsfälle, die Sie im Workshop gerne behandelt sehen würden?
              </label>
              <Textarea
                id="topics"
                name="konkrete_tools_themen_oder_anwendungsfaelle"
                required
                className="min-h-[140px] rounded-2xl"
                placeholder="z. B. Outlook, Excel, Angebote, E-Mails, Auswertungen oder KI-Use-Cases"
              />
            </div>

            <div className="flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-muted-foreground" aria-live="polite">
                {result}
              </span>

              <div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 rounded-3xl px-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Wird gesendet..." : "Fragebogen senden"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireIntro;
