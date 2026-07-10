import { cn } from "../lib";
import { useLanguage } from "./LanguageProvider";

interface LanguageToggleProps {
  className?: string;
  variant?: "compact" | "menu";
}

export function LanguageToggle({
  className,
  variant = "compact",
}: LanguageToggleProps) {
  const { locale, toggleLocale, t } = useLanguage();
  const isEnglish = locale === "en";
  const isMenu = variant === "menu";

  const switchTrack = (
    <span
      aria-hidden="true"
      className="relative flex h-8 w-16 shrink-0 items-center rounded-full border border-white/20 bg-white/10 p-1 transition-colors group-hover:bg-white/15"
    >
      <span
        className={cn(
          "absolute left-1 top-1 h-6 w-7 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out",
          isEnglish && "translate-x-7",
        )}
      />
      <span
        className={cn(
          "relative z-10 flex h-6 w-7 items-center justify-center transition-colors",
          !isEnglish ? "text-[#12122d]" : "text-white/65",
        )}
      >
        {t.language.ko}
      </span>
      <span
        className={cn(
          "relative z-10 flex h-6 w-7 items-center justify-center transition-colors",
          isEnglish ? "text-[#12122d]" : "text-white/65",
        )}
      >
        {t.language.en}
      </span>
    </span>
  );

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={
        isMenu
          ? `${t.language.menuLabel}: ${t.language.toggleLabel}`
          : t.language.toggleLabel
      }
      aria-pressed={isEnglish}
      className={cn(
        "group text-xs font-bold text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12122d]",
        isMenu
          ? "flex h-12 w-full items-center justify-between rounded-lg border border-white/15 bg-white/[0.04] px-3 transition-colors hover:bg-white/[0.08]"
          : "relative inline-flex h-8 w-16 shrink-0 rounded-full",
        className,
      )}
    >
      {isMenu && (
        <span className="text-sm text-white/70">{t.language.menuLabel}</span>
      )}
      {switchTrack}
    </button>
  );
}
