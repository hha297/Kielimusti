"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type FlipCardProps = {
  front: ReactNode;
  back: ReactNode;
  flipped: boolean;
  onToggle?: () => void;
  className?: string;
};

export function FlipCard({ front, back, flipped, onToggle, className }: FlipCardProps) {
  return (
    <button
      type="button"
      aria-pressed={flipped}
      onClick={onToggle}
      className={cn(
        "group block w-full rounded-[1.25rem] text-left outline-none perspective-[1000px]",
        "focus-visible:ring-2 focus-visible:ring-ring/35",
        className,
      )}
    >
      <span
        className={cn(
          "relative block min-h-52 w-full transform-3d rounded-[1.25rem] border border-border bg-card shadow-(--shadow-float)",
          "transition-transform duration-500 ease-out motion-reduce:transition-none",
          flipped && "transform-[rotateX(180deg)]",
        )}
      >
        <span
          className={cn(
            "absolute inset-0 flex rounded-[1.25rem] p-5",
            "backface-hidden",
          )}
        >
          {front}
        </span>
        <span
          className={cn(
            "absolute inset-0 flex rounded-[1.25rem] p-5",
            "backface-hidden transform-[rotateX(180deg)]",
          )}
        >
          {back}
        </span>
      </span>
    </button>
  );
}
