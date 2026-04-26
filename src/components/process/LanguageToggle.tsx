import { Languages } from "lucide-react";

import { useTranslation, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
  variant?: "pill" | "subtle";
}

const LANGS: { value: Locale; label: string }[] = [
  { value: "de", label: "DE" },
  { value: "en", label: "EN" },
];

const LanguageToggle = ({ className, variant = "pill" }: LanguageToggleProps) => {
  const { locale, setLocale, t } = useTranslation();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-white p-0.5 shadow-sm",
        variant === "subtle" && "border-transparent bg-white/60 shadow-none",
        className,
      )}
      role="group"
      aria-label={t("lang.label")}
    >
      <span className="ml-1.5 mr-0.5 inline-flex h-6 w-6 items-center justify-center text-muted-foreground">
        <Languages className="h-3.5 w-3.5" />
      </span>
      {LANGS.map((lang) => {
        const active = locale === lang.value;
        return (
          <button
            key={lang.value}
            type="button"
            onClick={() => setLocale(lang.value)}
            className={cn(
              "h-7 rounded-full px-2.5 text-[11px] font-semibold uppercase tracking-wider transition-colors",
              active
                ? "bg-foreground text-white"
                : "text-muted-foreground hover:bg-muted/50",
            )}
            aria-pressed={active}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
};

export default LanguageToggle;
