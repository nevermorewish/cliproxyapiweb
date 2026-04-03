/**
 * i18n core utilities — works in both server and client components.
 */
import zh from "@/lib/locales/zh";
import en from "@/lib/locales/en";

export type Locale = "zh" | "en";
export type DictionaryValue = string | { [key: string]: DictionaryValue };
export type Dictionary = Record<string, DictionaryValue>;

const dictionaries: Record<Locale, Dictionary> = { zh, en };

export const DEFAULT_LOCALE: Locale = "zh";
export const LOCALE_COOKIE = "locale";

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

/**
 * Resolve a dot-path key like "nav.quickStart" from a dictionary.
 */
function resolve(dict: Dictionary, key: string): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = dict;
  for (const segment of key.split(".")) {
    if (current == null || typeof current !== "object") return key;
    current = current[segment];
  }
  return typeof current === "string" ? current : key;
}

/**
 * Interpolate `{{variable}}` placeholders in a translated string.
 */
function interpolate(
  text: string,
  params?: Record<string, string | number>
): string {
  if (!params) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (_, name: string) =>
    params[name] != null ? String(params[name]) : `{{${name}}}`
  );
}

export type TranslateFunction = (
  key: string,
  params?: Record<string, string | number>
) => string;

/**
 * Create a `t()` function bound to a specific locale.
 * Use in server components or anywhere outside React tree.
 */
export function createTranslator(locale: Locale): TranslateFunction {
  const dict = getDictionary(locale);
  return (key: string, params?: Record<string, string | number>) =>
    interpolate(resolve(dict, key), params);
}
