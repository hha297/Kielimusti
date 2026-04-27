import * as FlagModule from "country-flag-icons/react/3x2";
import { Globe } from "lucide-react";
import type { JSX, SVGProps } from "react";

import { cn } from "@/lib/utils";

type LanguageFlagProps = {
  /** ISO 3166-1 alpha-2 */
  countryCode: string;
  className?: string;
  title?: string;
};

type SvgFlag = (props: SVGProps<SVGSVGElement>) => JSX.Element;

function resolveSvgFlag(countryCode: string): SvgFlag | null {
  const cc = countryCode.trim().toUpperCase();
  if (cc.length !== 2) return null;
  const mod = FlagModule as Record<string, unknown>;
  const Cmp = mod[cc];
  if (typeof Cmp !== "function") return null;
  return Cmp as SvgFlag;
}

/**
 * Country flag SVG from `country-flag-icons` (emoji flags break on many Windows setups).
 */
export function LanguageFlag({ countryCode, className, title }: LanguageFlagProps) {
  const Flag = resolveSvgFlag(countryCode);
  if (!Flag) {
    return (
      <span className="inline-flex shrink-0" title={title}>
        <Globe
          className={cn("size-4 shrink-0 text-muted-foreground", className)}
          aria-hidden={title ? undefined : true}
          aria-label={title}
        />
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0" title={title}>
      <Flag
        aria-hidden={title ? undefined : true}
        aria-label={title}
        className={cn(
          "h-4 w-6 shrink-0 overflow-hidden rounded-full shadow-[var(--shadow-float)] ring-1 ring-black/10",
          className,
        )}
      />
    </span>
  );
}
