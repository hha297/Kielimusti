import ISO6391 from "iso-639-1";

import { LANGUAGE_FLAG_COUNTRY } from "@/constants/language-flag-country";

export type WorldLanguage = {
  code: string;
  name: string;
  /** ISO 3166-1 alpha-2 for `country-flag-icons/unicode` */
  flagCountry: string;
};

const list: WorldLanguage[] = ISO6391.getAllCodes()
  .map((code) => ({
    code,
    name: ISO6391.getName(code),
    flagCountry: LANGUAGE_FLAG_COUNTRY[code] ?? "UN",
  }))
  .filter((row) => row.name.length > 0)
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

export const WORLD_LANGUAGES: readonly WorldLanguage[] = list;

export const WORLD_LANGUAGE_CODES = new Set(list.map((l) => l.code));

export function getWorldLanguage(code: string): WorldLanguage | undefined {
  return list.find((l) => l.code === code);
}
