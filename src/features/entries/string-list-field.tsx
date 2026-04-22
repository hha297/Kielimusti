"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type StringListFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  addLabel: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
};

export function StringListField<T extends FieldValues>({
  control,
  name,
  label,
  addLabel,
  placeholder,
  disabled,
  error,
}: StringListFieldProps<T>) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              disabled={disabled}
              onClick={() => field.onChange([...(field.value ?? []), ""])}
            >
              <Plus className="size-4" aria-hidden />
              {addLabel}
            </Button>
          )}
        />
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const list: string[] = Array.isArray(field.value) ? field.value : [];
          if (list.length === 0) {
            return (
              <p className="text-xs text-muted-foreground">
                None yet — use &quot;{addLabel}&quot; to add items.
              </p>
            );
          }
          return (
            <ul className="space-y-2">
              {list.map((item, index) => (
                <li key={index} className="flex gap-2">
                  <Input
                    className="min-w-0 flex-1"
                    placeholder={placeholder}
                    disabled={disabled}
                    value={item}
                    onChange={(e) => {
                      const next = [...list];
                      next[index] = e.target.value;
                      field.onChange(next);
                    }}
                    onBlur={field.onBlur}
                    aria-invalid={Boolean(error)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    disabled={disabled}
                    aria-label="Remove item"
                    onClick={() => {
                      const next = list.filter((_, i) => i !== index);
                      field.onChange(next);
                    }}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
          );
        }}
      />
      {error ? <p className={cn("text-xs text-destructive")}>{error}</p> : null}
    </div>
  );
}
