import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "de" | "en";

const STORAGE_KEY = "workflow-builder:locale";

const TRANSLATIONS = {
  de: {
    "common.next": "Weiter",
    "common.back": "Zurück",
    "common.finish": "Fertig",
    "common.close": "Schließen",
    "common.delete": "Löschen",
    "common.duplicate": "Duplizieren",
    "common.cancel": "Abbrechen",
    "common.confirm": "Bestätigen",
    "common.save": "Speichern",
    "common.continue": "Weiter",
    "common.start": "Loslegen",
    "common.or": "oder",
    "common.optional": "(optional)",
    "common.unnamed": "Ohne Namen",

    "lang.label": "Sprache",
    "lang.de": "Deutsch",
    "lang.en": "Englisch",

    "header.workflow": "Workflow",
    "header.processName.placeholder": "Name des Prozesses",
    "header.steps": "{count} Schritte",
    "header.bottlenecks": "{count} Engstellen",
    "header.aiCount": "{count} mit KI",
    "header.arrange": "Ordnen",
    "header.arrange.title": "Automatisch ordnen",
    "header.reset.title": "Alles zurücksetzen",
    "header.export": "Exportieren",

    "phases.draft.label": "Skizzieren",
    "phases.draft.headline": "Wie läuft es heute?",
    "phases.draft.description": "Erfasse die Schritte. Reihenfolge zählt, Details später.",
    "phases.refine.label": "Verfeinern",
    "phases.refine.headline": "Was passiert in jedem Schritt?",
    "phases.refine.description": "Ein Schritt nach dem anderen. Nur das Wichtigste.",
    "phases.ai.label": "KI prüfen",
    "phases.ai.headline": "Wo könnte KI helfen?",
    "phases.ai.description": "Pro Schritt eine kurze Entscheidung.",
    "phases.compare.label": "Vergleich",
    "phases.compare.headline": "Vorher und Nachher",
    "phases.compare.description": "Sieh den Unterschied auf einen Blick.",

    "node.type.process": "Schritt",
    "node.type.process.description": "Etwas wird getan.",
    "node.type.decision": "Frage",
    "node.type.decision.description": "Es wird entschieden.",

    "node.future.same": "Bleibt wie heute",
    "node.future.same.short": "Gleich",
    "node.future.same.description": "Hier ändert sich nichts.",
    "node.future.assist": "KI unterstützt",
    "node.future.assist.short": "KI hilft",
    "node.future.assist.description": "Mensch macht weiter, KI hilft im Hintergrund.",
    "node.future.replace": "Neu mit KI",
    "node.future.replace.short": "Neu",
    "node.future.replace.description": "Die KI übernimmt den Schritt komplett.",

    "node.bottleneckBadge": "Eng",
    "node.bottleneck.title": "Hier hakt es",
    "node.humanReview": "Mensch prüft",

    "palette.heading": "Neu",
    "palette.hint": "Ziehen oder klicken",
    "palette.button.title": "{label} hinzufügen — ziehen oder klicken",
    "palette.newProcess": "Neuer Schritt",
    "palette.newDecision": "Neue Frage",

    "canvas.empty.kicker": "Leerer Canvas",
    "canvas.empty.title": "Beginne mit dem ersten Schritt.",
    "canvas.empty.body": "Ziehe ein Element aus der Palette links oder klicke darauf. Mit Enter fügst du Folgeschritte ein.",
    "canvas.insertAfter": "Schritt danach",
    "canvas.insertAfter.title": "Folgeschritt einfügen (Enter)",
    "canvas.compare.before": "Vorher",
    "canvas.compare.after": "Mit KI",

    "canvas.summary.title": "Übersicht",
    "canvas.summary.totalSteps": "Schritte gesamt",
    "canvas.summary.changedAi": "davon mit KI verändert",
    "canvas.summary.bottlenecks": "markierte Engstellen",
    "canvas.summary.toggleHint": "Wechsle oben zwischen Vorher und Mit KI, um den Unterschied zu sehen.",

    "carousel.position": "Schritt {current} / {total}",
    "carousel.hint": "Pfeiltasten ← →",
    "carousel.finish.refine": "Weiter zur KI",
    "carousel.finish.ai": "Vergleich ansehen",
    "carousel.prev.title": "Zurück",

    "edit.title.refine": "Schritt bearbeiten",
    "edit.title.ai": "KI-Möglichkeit",
    "edit.subtitle.draft": "Nur Name. Reihenfolge zählt.",
    "edit.subtitle.refine": "Wer, was, wie lange.",
    "edit.subtitle.ai": "Eine Entscheidung reicht.",
    "edit.field.name": "Name",
    "edit.field.name.placeholder": "Was passiert hier?",
    "edit.field.type": "Typ",
    "edit.field.shortDescription": "Kurz erklärt",
    "edit.field.shortDescription.hint": "Ein Satz reicht.",
    "edit.field.shortDescription.placeholderProcess": "Was passiert in diesem Schritt?",
    "edit.field.shortDescription.placeholderDecision": "Worüber wird entschieden?",
    "edit.field.who": "Wer?",
    "edit.field.who.placeholder": "z. B. Sales",
    "edit.field.duration": "Dauer",
    "edit.field.duration.placeholder": "z. B. 30 Min",
    "edit.field.tools": "Tools",
    "edit.field.tools.hint": "Wo passiert das?",
    "edit.field.tools.placeholder": "Tool…",
    "edit.bottleneck.title": "Hier hakt es",
    "edit.bottleneck.body": "Markiere diesen Schritt als Engstelle.",
    "edit.bottleneck.placeholder": "Was ist das Problem?",
    "edit.ai.fieldLabel": "Was soll hier passieren?",
    "edit.ai.task": "KI übernimmt",
    "edit.ai.task.placeholder": "Was macht die KI hier?",
    "edit.ai.human": "Mensch macht",
    "edit.ai.human.placeholder": "Was bleibt beim Menschen?",
    "edit.ai.review.title": "Mensch prüft am Schluss",
    "edit.ai.review.body": "Freigabe bleibt beim Menschen.",
    "edit.delete.title": "Diesen Schritt löschen",

    "context.insertAfter": "Schritt danach einfügen",
    "context.duplicate": "Duplizieren",
    "context.toggleBottleneck.on": "Als Engstelle markieren",
    "context.toggleBottleneck.off": "Engstelle entfernen",
    "context.delete": "Löschen",
    "context.cycleType": "Typ wechseln",

    "reset.confirm": "Alles zurücksetzen? Dein aktueller Ablauf geht verloren.",

    "onboarding.badge": "Workflow Builder",
    "onboarding.title.line1": "Mal' deinen Prozess.",
    "onboarding.title.line2": "Sieh, wo KI hilft.",
    "onboarding.subtitle": "In drei Phasen: zuerst skizzieren, dann verfeinern, dann KI durchdenken. Du wirst Schritt für Schritt geführt — auch ohne Vorwissen.",
    "onboarding.phase1.title": "Skizzieren",
    "onboarding.phase1.body": "Zeichne den Ablauf Schritt für Schritt.",
    "onboarding.phase2.title": "Verfeinern",
    "onboarding.phase2.body": "Kurz beschreiben, wer wann was macht.",
    "onboarding.phase3.title": "KI prüfen",
    "onboarding.phase3.body": "Pro Schritt entscheiden: bleibt, hilft, neu.",
    "onboarding.resume.title": "Letzten Stand fortsetzen",
    "onboarding.resume.subtitle": "{name} · {count} Schritte",
    "onboarding.resume.unnamed": "Unbenannt",
    "onboarding.templates.kicker": "Vorlagen",
    "onboarding.templates.title": "Mit einem Beispiel starten",
    "onboarding.templates.steps": "{count} Schritte",
    "onboarding.templates.aiSteps": "{count} mit KI",
    "onboarding.divider": "oder leer beginnen",
    "onboarding.field.name": "Prozessname",
    "onboarding.field.name.placeholder": "z. B. Reklamation",
    "onboarding.field.firstStep": "Erster Schritt",
    "onboarding.field.firstStep.placeholder": "z. B. Anfrage kommt an",
    "onboarding.back": "Zur Übersicht",

    "export.menu.title": "Exportieren",
    "export.menu.markdown.download": "Als Markdown speichern",
    "export.menu.markdown.copy": "Markdown kopieren",
    "export.menu.markdown.copied": "Kopiert!",
    "export.menu.pdf": "Als PDF speichern",
    "export.markdown.heading": "Workflow: {name}",
    "export.markdown.generated": "Generiert am {date}",
    "export.markdown.summary": "Zusammenfassung",
    "export.markdown.totalSteps": "Schritte gesamt",
    "export.markdown.bottlenecks": "Engstellen",
    "export.markdown.aiSteps": "Schritte mit KI",
    "export.markdown.steps": "Schritte",
    "export.markdown.tools": "Tools",
    "export.markdown.responsible": "Verantwortlich",
    "export.markdown.duration": "Dauer",
    "export.markdown.description": "Beschreibung",
    "export.markdown.bottleneckLabel": "Engstelle",
    "export.markdown.aiSection": "Mit KI",
    "export.markdown.aiTask": "KI macht",
    "export.markdown.humanRole": "Mensch macht",
    "export.markdown.review": "Mensch prüft am Schluss",
    "export.markdown.connections": "Verbindungen",
    "export.markdown.aiPrompt.title": "Hinweis für KI",
    "export.markdown.aiPrompt.body": "Dieses Markdown beschreibt einen Geschäftsprozess. Nutze es als Kontext, um Optimierungen, Risiken oder konkrete Automatisierungs-Ideen vorzuschlagen.",

    "pdf.title": "Workflow: {name}",
    "pdf.kicker": "Workflow-Übersicht",
    "pdf.printHint": "Tipp: Im Druckdialog \"Als PDF speichern\" wählen.",
    "pdf.print": "Drucken / Als PDF",
    "pdf.close": "Schließen",
    "pdf.beforeAfter": "Vorher → Mit KI",
    "pdf.before": "Vorher",
    "pdf.after": "Mit KI",
    "pdf.unchanged": "Bleibt wie heute",
    "pdf.flow": "Ablauf",

    "password.kicker": "Workflow Builder",
    "password.title": "Zugang zum Workflow Builder",
    "password.subtitle": "Bitte gib das Passwort ein, um den Workflow Builder zu öffnen.",
    "password.label": "Passwort",
    "password.placeholder": "Passwort eingeben",
    "password.error": "Das Passwort ist nicht korrekt.",
    "password.hint": "Bitte gib das Passwort ein, um fortzufahren.",
    "password.submit": "Weiter",
    "password.back": "Zur Übersicht",
  },
  en: {
    "common.next": "Next",
    "common.back": "Back",
    "common.finish": "Done",
    "common.close": "Close",
    "common.delete": "Delete",
    "common.duplicate": "Duplicate",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.save": "Save",
    "common.continue": "Continue",
    "common.start": "Get started",
    "common.or": "or",
    "common.optional": "(optional)",
    "common.unnamed": "Untitled",

    "lang.label": "Language",
    "lang.de": "German",
    "lang.en": "English",

    "header.workflow": "Workflow",
    "header.processName.placeholder": "Process name",
    "header.steps": "{count} steps",
    "header.bottlenecks": "{count} bottlenecks",
    "header.aiCount": "{count} with AI",
    "header.arrange": "Arrange",
    "header.arrange.title": "Auto-arrange",
    "header.reset.title": "Reset everything",
    "header.export": "Export",

    "phases.draft.label": "Sketch",
    "phases.draft.headline": "How does it work today?",
    "phases.draft.description": "Capture the steps. Order matters, details come later.",
    "phases.refine.label": "Refine",
    "phases.refine.headline": "What happens in each step?",
    "phases.refine.description": "One step at a time. Just the essentials.",
    "phases.ai.label": "AI review",
    "phases.ai.headline": "Where could AI help?",
    "phases.ai.description": "One quick decision per step.",
    "phases.compare.label": "Compare",
    "phases.compare.headline": "Before and after",
    "phases.compare.description": "See the difference at a glance.",

    "node.type.process": "Step",
    "node.type.process.description": "Something gets done.",
    "node.type.decision": "Question",
    "node.type.decision.description": "A decision is made.",

    "node.future.same": "Stays as today",
    "node.future.same.short": "Same",
    "node.future.same.description": "Nothing changes here.",
    "node.future.assist": "AI assists",
    "node.future.assist.short": "AI helps",
    "node.future.assist.description": "Human stays in charge, AI helps in the background.",
    "node.future.replace": "AI takes over",
    "node.future.replace.short": "New",
    "node.future.replace.description": "AI handles this step end to end.",

    "node.bottleneckBadge": "Slow",
    "node.bottleneck.title": "Friction here",
    "node.humanReview": "Human reviews",

    "palette.heading": "Add",
    "palette.hint": "Drag or click",
    "palette.button.title": "Add {label} — drag or click",
    "palette.newProcess": "New step",
    "palette.newDecision": "New question",

    "canvas.empty.kicker": "Empty canvas",
    "canvas.empty.title": "Start with the first step.",
    "canvas.empty.body": "Drag an element from the palette on the left or click on it. Press Enter to add follow-up steps.",
    "canvas.insertAfter": "Step after",
    "canvas.insertAfter.title": "Insert follow-up step (Enter)",
    "canvas.compare.before": "Before",
    "canvas.compare.after": "With AI",

    "canvas.summary.title": "Summary",
    "canvas.summary.totalSteps": "steps total",
    "canvas.summary.changedAi": "of those changed with AI",
    "canvas.summary.bottlenecks": "marked bottlenecks",
    "canvas.summary.toggleHint": "Toggle Before / With AI above to see the difference.",

    "carousel.position": "Step {current} / {total}",
    "carousel.hint": "Arrow keys ← →",
    "carousel.finish.refine": "On to AI",
    "carousel.finish.ai": "See comparison",
    "carousel.prev.title": "Previous",

    "edit.title.refine": "Edit step",
    "edit.title.ai": "AI opportunity",
    "edit.subtitle.draft": "Just the name. Order matters.",
    "edit.subtitle.refine": "Who, what, how long.",
    "edit.subtitle.ai": "One decision is enough.",
    "edit.field.name": "Name",
    "edit.field.name.placeholder": "What happens here?",
    "edit.field.type": "Type",
    "edit.field.shortDescription": "Briefly",
    "edit.field.shortDescription.hint": "One sentence is enough.",
    "edit.field.shortDescription.placeholderProcess": "What happens in this step?",
    "edit.field.shortDescription.placeholderDecision": "What is being decided?",
    "edit.field.who": "Who?",
    "edit.field.who.placeholder": "e.g. Sales",
    "edit.field.duration": "Duration",
    "edit.field.duration.placeholder": "e.g. 30 min",
    "edit.field.tools": "Tools",
    "edit.field.tools.hint": "Where does it happen?",
    "edit.field.tools.placeholder": "Tool…",
    "edit.bottleneck.title": "Friction here",
    "edit.bottleneck.body": "Mark this step as a bottleneck.",
    "edit.bottleneck.placeholder": "What is the issue?",
    "edit.ai.fieldLabel": "What should happen here?",
    "edit.ai.task": "AI handles",
    "edit.ai.task.placeholder": "What does the AI do here?",
    "edit.ai.human": "Human does",
    "edit.ai.human.placeholder": "What stays with the human?",
    "edit.ai.review.title": "Human reviews at the end",
    "edit.ai.review.body": "Sign-off stays with a human.",
    "edit.delete.title": "Delete this step",

    "context.insertAfter": "Insert step after",
    "context.duplicate": "Duplicate",
    "context.toggleBottleneck.on": "Mark as bottleneck",
    "context.toggleBottleneck.off": "Remove bottleneck",
    "context.delete": "Delete",
    "context.cycleType": "Switch type",

    "reset.confirm": "Reset everything? Your current flow will be lost.",

    "onboarding.badge": "Workflow Builder",
    "onboarding.title.line1": "Sketch your process.",
    "onboarding.title.line2": "See where AI helps.",
    "onboarding.subtitle": "Three phases: sketch first, then refine, then think AI through. You're guided step by step — no prior knowledge required.",
    "onboarding.phase1.title": "Sketch",
    "onboarding.phase1.body": "Draw the flow step by step.",
    "onboarding.phase2.title": "Refine",
    "onboarding.phase2.body": "Briefly describe who does what when.",
    "onboarding.phase3.title": "AI review",
    "onboarding.phase3.body": "Per step decide: stays, helps, new.",
    "onboarding.resume.title": "Resume last session",
    "onboarding.resume.subtitle": "{name} · {count} steps",
    "onboarding.resume.unnamed": "Untitled",
    "onboarding.templates.kicker": "Templates",
    "onboarding.templates.title": "Start from an example",
    "onboarding.templates.steps": "{count} steps",
    "onboarding.templates.aiSteps": "{count} with AI",
    "onboarding.divider": "or start blank",
    "onboarding.field.name": "Process name",
    "onboarding.field.name.placeholder": "e.g. Complaint",
    "onboarding.field.firstStep": "First step",
    "onboarding.field.firstStep.placeholder": "e.g. Request comes in",
    "onboarding.back": "To overview",

    "export.menu.title": "Export",
    "export.menu.markdown.download": "Save as Markdown",
    "export.menu.markdown.copy": "Copy Markdown",
    "export.menu.markdown.copied": "Copied!",
    "export.menu.pdf": "Save as PDF",
    "export.markdown.heading": "Workflow: {name}",
    "export.markdown.generated": "Generated on {date}",
    "export.markdown.summary": "Summary",
    "export.markdown.totalSteps": "Steps total",
    "export.markdown.bottlenecks": "Bottlenecks",
    "export.markdown.aiSteps": "Steps with AI",
    "export.markdown.steps": "Steps",
    "export.markdown.tools": "Tools",
    "export.markdown.responsible": "Responsible",
    "export.markdown.duration": "Duration",
    "export.markdown.description": "Description",
    "export.markdown.bottleneckLabel": "Bottleneck",
    "export.markdown.aiSection": "With AI",
    "export.markdown.aiTask": "AI does",
    "export.markdown.humanRole": "Human does",
    "export.markdown.review": "Human reviews at the end",
    "export.markdown.connections": "Connections",
    "export.markdown.aiPrompt.title": "Hint for AI",
    "export.markdown.aiPrompt.body": "This Markdown describes a business process. Use it as context to suggest improvements, risks or concrete automation ideas.",

    "pdf.title": "Workflow: {name}",
    "pdf.kicker": "Workflow overview",
    "pdf.printHint": "Tip: in the print dialog choose \"Save as PDF\".",
    "pdf.print": "Print / Save PDF",
    "pdf.close": "Close",
    "pdf.beforeAfter": "Before → With AI",
    "pdf.before": "Before",
    "pdf.after": "With AI",
    "pdf.unchanged": "Stays as today",
    "pdf.flow": "Flow",

    "password.kicker": "Workflow Builder",
    "password.title": "Access to the Workflow Builder",
    "password.subtitle": "Please enter the password to open the Workflow Builder.",
    "password.label": "Password",
    "password.placeholder": "Enter password",
    "password.error": "The password is not correct.",
    "password.hint": "Please enter the password to continue.",
    "password.submit": "Continue",
    "password.back": "To overview",
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.de;

type Params = Record<string, string | number>;

const interpolate = (value: string, params?: Params) => {
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (_, key) => {
    const v = params[key];
    return v === undefined ? `{${key}}` : String(v);
  });
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: Params) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const detectInitialLocale = (): Locale => {
  if (typeof window === "undefined") return "de";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "de" || stored === "en") return stored;
  } catch {
    /* ignore */
  }
  const nav = typeof navigator !== "undefined" ? navigator.language?.toLowerCase() : "";
  return nav.startsWith("en") ? "en" : "de";
};

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => detectInitialLocale());

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", locale);
    }
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);

  const t = useCallback(
    (key: TranslationKey, params?: Params) => {
      const dict = TRANSLATIONS[locale] ?? TRANSLATIONS.de;
      const value = (dict as Record<string, string>)[key] ?? (TRANSLATIONS.de as Record<string, string>)[key] ?? key;
      return interpolate(value, params);
    },
    [locale],
  );

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useTranslation = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      locale: "de" as Locale,
      setLocale: () => {},
      t: (key: TranslationKey, params?: Params) =>
        interpolate((TRANSLATIONS.de as Record<string, string>)[key] ?? key, params),
    };
  }
  return ctx;
};
