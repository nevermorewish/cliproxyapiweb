"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  type Locale,
  type TranslateFunction,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  createTranslator,
} from "@/lib/i18n";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFunction;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};path=/;expires=${expires};SameSite=Lax`;
}

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale?: string;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const init = initialLocale as Locale;
    if (init === "zh" || init === "en") return init;
    return DEFAULT_LOCALE;
  });
  const [t, setT] = useState<TranslateFunction>(() => createTranslator(locale));

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setT(() => createTranslator(next));
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_COOKIE, next);
      setCookie(LOCALE_COOKIE, next);
      // Update html lang attribute
      document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
    }
  }, []);

  // Sync localStorage on mount (in case cookie was set server-side)
  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_COOKIE) as Locale | null;
    if (stored && (stored === "zh" || stored === "en") && stored !== locale) {
      setLocale(stored);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Hook for client components.
 * Returns { locale, setLocale, t }.
 */
export function useTranslation(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within <LocaleProvider>");
  }
  return ctx;
}
