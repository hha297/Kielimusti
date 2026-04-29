"use client";

import { CheckIcon, ChevronDownIcon, Star } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { LanguageFlag } from "@/components/language-flag";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  WORLD_LANGUAGES,
  getWorldLanguage,
  type WorldLanguage,
} from "@/constants/world-languages";
import { cn } from "@/lib/utils";

const FAVORITE_LANGUAGES_KEY = "kielimuisti:favorite-languages";

function readFavoriteLanguageCodes(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITE_LANGUAGES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string" && x.length > 0);
  } catch {
    return [];
  }
}

function writeFavoriteLanguageCodes(codes: string[]) {
  try {
    localStorage.setItem(FAVORITE_LANGUAGES_KEY, JSON.stringify(codes));
  } catch {
    /* ignore quota / private mode */
  }
}

const EMPTY_FAVORITES: string[] = [];
const favoriteListeners = new Set<() => void>();

function subscribeFavoriteLanguages(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => { };
  const onStorage = (e: StorageEvent) => {
    if (e.key === FAVORITE_LANGUAGES_KEY || e.key === null) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  favoriteListeners.add(onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    favoriteListeners.delete(onStoreChange);
  };
}

function emitFavoriteLanguagesChanged() {
  favoriteListeners.forEach((fn) => fn());
}

let cachedFavoriteRaw: string | null = null;
let cachedFavoriteList: string[] = EMPTY_FAVORITES;

function getFavoriteLanguagesSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY_FAVORITES;
  let raw: string;
  try {
    raw = localStorage.getItem(FAVORITE_LANGUAGES_KEY) ?? "[]";
  } catch {
    return EMPTY_FAVORITES;
  }
  if (raw === cachedFavoriteRaw) return cachedFavoriteList;
  try {
    const parsed = JSON.parse(raw) as unknown;
    const out = Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string" && x.length > 0)
      : [];
    cachedFavoriteRaw = raw;
    cachedFavoriteList = out.length > 0 ? [...out] : EMPTY_FAVORITES;
    return cachedFavoriteList;
  } catch {
    cachedFavoriteRaw = raw;
    cachedFavoriteList = EMPTY_FAVORITES;
    return cachedFavoriteList;
  }
}

function getFavoriteLanguagesServerSnapshot(): string[] {
  return EMPTY_FAVORITES;
}

function useFavoriteLanguageCodes() {
  const favorites = useSyncExternalStore(
    subscribeFavoriteLanguages,
    getFavoriteLanguagesSnapshot,
    getFavoriteLanguagesServerSnapshot,
  );

  const toggleFavorite = useCallback((code: string) => {
    const prev = readFavoriteLanguageCodes();
    const i = prev.indexOf(code);
    const next =
      i >= 0 ? prev.filter((c) => c !== code) : [code, ...prev.filter((c) => c !== code)];
    writeFavoriteLanguageCodes(next);
    cachedFavoriteRaw = null;
    emitFavoriteLanguagesChanged();
  }, []);

  const favoriteRank = useCallback(
    (code: string) => {
      const i = favorites.indexOf(code);
      return i === -1 ? Number.POSITIVE_INFINITY : i;
    },
    [favorites],
  );

  const isFavorite = useCallback(
    (code: string) => favorites.includes(code),
    [favorites],
  );

  return { favorites, toggleFavorite, favoriteRank, isFavorite };
}

type LanguageListRowProps = {
  lang: WorldLanguage;
  selectedCode: string;
  disabled?: boolean;
  fieldOnChange: (code: string) => void;
  onPick: () => void;
  isFavorite: (code: string) => boolean;
  toggleFavorite: (code: string) => void;
};

function LanguageListRow({
  lang,
  selectedCode,
  disabled,
  fieldOnChange,
  onPick,
  isFavorite,
  toggleFavorite,
}: LanguageListRowProps) {
  const on = selectedCode === lang.code;
  const fav = isFavorite(lang.code);
  return (
    <li
      className={cn(
        "flex items-stretch gap-0.5 rounded-md transition-colors",
        on && "bg-muted/90",
      )}
    >
      <button
        type="button"
        role="option"
        aria-selected={on}
        disabled={disabled}
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors",
          !on && "hover:bg-muted/60",
          disabled && "pointer-events-none opacity-50",
        )}
        onClick={() => {
          fieldOnChange(lang.code);
          onPick();
        }}
      >
        <LanguageFlag countryCode={lang.flagCountry} title={lang.name} />
        <span className="min-w-0 flex-1 truncate font-medium">{lang.name}</span>
        {on ? (
          <CheckIcon className="size-4 shrink-0 text-primary" aria-hidden />
        ) : (
          <span className="size-4 shrink-0" aria-hidden />
        )}
      </button>
      <button
        type="button"
        disabled={disabled}
        aria-label={fav ? `Remove ${lang.name} from favorites` : `Favorite ${lang.name}`}
        aria-pressed={fav}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md px-2 transition-colors",
          "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
          disabled && "pointer-events-none opacity-50",
        )}
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(lang.code);
        }}
      >
        <Star
          className={cn(
            "size-4",
            fav ? "fill-amber-400 text-amber-400" : "fill-transparent stroke-[1.75]",
          )}
          aria-hidden
        />
      </button>
    </li>
  );
}

type LanguageSelectProps<T extends FieldValues> = {
  disabled?: boolean;
  error?: string;
  label?: string;
  hint?: string;
  hideHeader?: boolean;
  className?: string;
} & (
  | {
      control: Control<T>;
      name: FieldPath<T>;
      value?: never;
      onValueChange?: never;
    }
  | {
      control?: never;
      name?: never;
      value: string;
      onValueChange: (value: string) => void;
    }
);

export function LanguageSelect<T extends FieldValues>({
  disabled,
  error,
  label = "Language",
  hint = "Entry is listed under this language.",
  hideHeader = false,
  className,
  ...props
}: LanguageSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const { toggleFavorite, favoriteRank, isFavorite } = useFavoriteLanguageCodes();

  const closeDropdown = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDocPointerDown(e: PointerEvent) {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) {
        closeDropdown();
      }
    }
    document.addEventListener("pointerdown", onDocPointerDown, true);
    return () => document.removeEventListener("pointerdown", onDocPointerDown, true);
  }, [open, closeDropdown]);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = !q
      ? WORLD_LANGUAGES
      : WORLD_LANGUAGES.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.code.includes(q) ||
          l.flagCountry.toLowerCase().includes(q),
      );
    return [...base].sort((a, b) => {
      const ra = favoriteRank(a.code);
      const rb = favoriteRank(b.code);
      const fa = ra !== Number.POSITIVE_INFINITY;
      const fb = rb !== Number.POSITIVE_INFINITY;
      if (fa !== fb) return fa ? -1 : 1;
      if (fa && fb && ra !== rb) return ra - rb;
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });
  }, [query, favoriteRank]);

  const { favoriteLanguages, otherLanguages } = useMemo(() => {
    const fav: WorldLanguage[] = [];
    const other: WorldLanguage[] = [];
    for (const l of filteredSorted) {
      if (isFavorite(l.code)) fav.push(l);
      else other.push(l);
    }
    return { favoriteLanguages: fav, otherLanguages: other };
  }, [filteredSorted, isFavorite]);

  return (
    <div className={cn("w-full space-y-2", className)} ref={rootRef}>
      {hideHeader ? null : (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <Label>{label}</Label>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      )}
      {"control" in props && props.control && props.name ? (
        <Controller
          control={props.control}
          name={props.name}
          render={({ field }) => {
            const code = (field.value as string | undefined) ?? "";
            const current = code ? getWorldLanguage(code) : undefined;
            const label = current?.name ?? (code ? code : null);
            const flagCc = current?.flagCountry ?? "UN";

            return (
              <div className="relative w-full">
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  aria-expanded={open}
                  aria-haspopup="listbox"
                  aria-invalid={Boolean(error)}
                  className={cn(
                    "h-auto min-h-10 w-full justify-between gap-2 rounded-[1.25rem] py-2 pr-2 pl-3 font-normal shadow-[var(--shadow-float)]",
                    error && "border-destructive/80",
                  )}
                  onClick={() => {
                    if (open) {
                      closeDropdown();
                    } else {
                      setOpen(true);
                    }
                  }}
                >
                  <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
                    {!label ? (
                      <span className="text-muted-foreground/70">Select language…</span>
                    ) : (
                      <>
                        <LanguageFlag countryCode={flagCc} title={label} className="h-3! w-[18px]!" />
                        <span className="truncate font-normal text-foreground">{label}</span>
                      </>
                    )}
                  </span>
                  <ChevronDownIcon
                    className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
                  />
                </Button>

                {open ? (
                  <div
                    className="absolute top-full right-0 left-0 z-50 mt-1 w-full overflow-hidden rounded-[1.25rem] border border-border bg-popover text-popover-foreground shadow-[var(--shadow-elevated)]"
                    role="listbox"
                  >
                    <div className="border-b border-border p-2" onPointerDown={(e) => e.stopPropagation()}>
                      <Input
                        type="search"
                        placeholder="Search languages…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={disabled}
                        className="h-8 w-full shadow-none"
                        autoComplete="off"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1">
                      {filteredSorted.length === 0 ? (
                        <p className="px-2 py-6 text-center text-sm text-muted-foreground">No matches.</p>
                      ) : (
                        <ul className="space-y-0.5">
                          {favoriteLanguages.map((lang) => (
                            <LanguageListRow
                              key={lang.code}
                              lang={lang}
                              selectedCode={code}
                              disabled={disabled}
                              fieldOnChange={field.onChange}
                              onPick={closeDropdown}
                              isFavorite={isFavorite}
                              toggleFavorite={toggleFavorite}
                            />
                          ))}
                          {favoriteLanguages.length > 0 && otherLanguages.length > 0 ? (
                            <li
                              className="list-none py-1.5"
                              role="separator"
                              aria-orientation="horizontal"
                            >
                              <div className="h-px w-full bg-border" />
                            </li>
                          ) : null}
                          {otherLanguages.map((lang) => (
                            <LanguageListRow
                              key={lang.code}
                              lang={lang}
                              selectedCode={code}
                              disabled={disabled}
                              fieldOnChange={field.onChange}
                              onPick={closeDropdown}
                              isFavorite={isFavorite}
                              toggleFavorite={toggleFavorite}
                            />
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          }}
        />
      ) : (
        (() => {
          const controlled = props as { value: string; onValueChange: (value: string) => void };
          const code = controlled.value;
          const current = code ? getWorldLanguage(code) : undefined;
          const label = current?.name ?? (code ? code : null);
          const flagCc = current?.flagCountry ?? "UN";

          return (
            <div className="relative w-full">
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-invalid={Boolean(error)}
                className={cn(
                  "h-auto min-h-10 w-full justify-between gap-2 rounded-[1.25rem] py-2 pr-2 pl-3 font-normal shadow-[var(--shadow-float)]",
                  error && "border-destructive/80",
                )}
                onClick={() => {
                  if (open) {
                    closeDropdown();
                  } else {
                    setOpen(true);
                  }
                }}
              >
                <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  {!label ? (
                    <span className="text-muted-foreground/70">Select language…</span>
                  ) : (
                    <>
                      <LanguageFlag countryCode={flagCc} title={label} className="h-3! w-[18px]!" />
                      <span className="truncate font-normal text-foreground">{label}</span>
                    </>
                  )}
                </span>
                <ChevronDownIcon
                  className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
                />
              </Button>

              {open ? (
                <div
                  className="absolute top-full right-0 left-0 z-50 mt-1 w-full overflow-hidden rounded-[1.25rem] border border-border bg-popover text-popover-foreground shadow-[var(--shadow-elevated)]"
                  role="listbox"
                >
                  <div className="border-b border-border p-2" onPointerDown={(e) => e.stopPropagation()}>
                    <Input
                      type="search"
                      placeholder="Search languages…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      disabled={disabled}
                      className="h-8 w-full shadow-none"
                      autoComplete="off"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto p-1">
                    {filteredSorted.length === 0 ? (
                      <p className="px-2 py-6 text-center text-sm text-muted-foreground">No matches.</p>
                    ) : (
                      <ul className="space-y-0.5">
                        {favoriteLanguages.map((lang) => (
                          <LanguageListRow
                            key={lang.code}
                            lang={lang}
                            selectedCode={code}
                            disabled={disabled}
                            fieldOnChange={controlled.onValueChange}
                            onPick={closeDropdown}
                            isFavorite={isFavorite}
                            toggleFavorite={toggleFavorite}
                          />
                        ))}
                        {favoriteLanguages.length > 0 && otherLanguages.length > 0 ? (
                          <li
                            className="list-none py-1.5"
                            role="separator"
                            aria-orientation="horizontal"
                          >
                            <div className="h-px w-full bg-border" />
                          </li>
                        ) : null}
                        {otherLanguages.map((lang) => (
                          <LanguageListRow
                            key={lang.code}
                            lang={lang}
                            selectedCode={code}
                            disabled={disabled}
                            fieldOnChange={controlled.onValueChange}
                            onPick={closeDropdown}
                            isFavorite={isFavorite}
                            toggleFavorite={toggleFavorite}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })()
      )}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
