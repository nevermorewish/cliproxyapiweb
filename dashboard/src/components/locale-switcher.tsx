"use client";

import { useTranslation } from "@/lib/i18n-client";

export function LocaleSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      className="flex items-center gap-1.5 rounded-md border border-slate-700/60 bg-slate-800/50 px-2 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-700/60 hover:text-slate-100"
      aria-label="Switch language"
      title={locale === "zh" ? "Switch to English" : "切换为中文"}
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span>{locale === "zh" ? "EN" : "中文"}</span>
    </button>
  );
}
