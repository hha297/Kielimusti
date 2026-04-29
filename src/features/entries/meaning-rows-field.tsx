"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { FieldArrayWithId, UseFormRegister } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CreateEntryInput } from "@/lib/entry-create-schema";

/** Same as drag + delete column width (`size-9` = 2.25rem). */
const meaningRowGridStyle = {
  gridTemplateColumns: "2.25rem minmax(0, 1fr) minmax(0, 2fr) 2.25rem",
} as const;

type MeaningRowField = FieldArrayWithId<CreateEntryInput, "meanings", "id">;

type MeaningRowsFieldProps = {
  fields: MeaningRowField[];
  register: UseFormArrayRegister;
  append: (v: { meaning: string; example: string }) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
  disabled?: boolean;
};

type UseFormArrayRegister = UseFormRegister<CreateEntryInput>;

export function MeaningRowsField({
  fields,
  register,
  append,
  remove,
  move,
  disabled,
}: MeaningRowsFieldProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      move(oldIndex, newIndex);
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={disabled}
          onClick={() => append({ meaning: "", example: "" })}
        >
          <Plus className="size-4" aria-hidden />
          Add meaning
        </Button>
      </div>

      <div
        className="hidden text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid sm:items-center sm:gap-x-2 sm:px-1"
        style={meaningRowGridStyle}
      >
        <span aria-hidden className="block" />
        <span className="min-w-0 leading-none">Meaning</span>
        <span className="min-w-0 leading-none">Example</span>
        <span className="sr-only">Remove</span>
      </div>

      {mounted ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <SortableMeaningRow
                  key={field.id}
                  id={field.id}
                  index={index}
                  register={register}
                  onRemove={() => remove(index)}
                  removeDisabled={fields.length <= 1 || Boolean(disabled)}
                  disabled={disabled}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <StaticMeaningRow
              key={field.id}
              index={index}
              register={register}
              onRemove={() => remove(index)}
              removeDisabled={fields.length <= 1 || Boolean(disabled)}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </>
  );
}

function StaticMeaningRow({
  index,
  register,
  onRemove,
  removeDisabled,
  disabled,
}: {
  index: number;
  register: UseFormArrayRegister;
  onRemove: () => void;
  removeDisabled: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      style={meaningRowGridStyle}
      className="flex flex-col gap-2 rounded-[1.25rem] border border-transparent p-1 sm:grid sm:items-center sm:gap-x-2"
    >
      <div className="flex shrink-0 justify-center sm:block">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 cursor-default touch-none text-muted-foreground"
          disabled
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-5" aria-hidden />
        </Button>
      </div>

      <div className="min-w-0 space-y-1 sm:space-y-0">
        <Label className="sm:hidden" htmlFor={`meaning-${index}-text`}>
          Meaning
        </Label>
        <Input
          id={`meaning-${index}-text`}
          placeholder="Translation"
          disabled={disabled}
          {...register(`meanings.${index}.meaning` as const)}
        />
      </div>

      <div className="min-w-0 space-y-1 sm:space-y-0">
        <Label className="sm:hidden" htmlFor={`meaning-${index}-example`}>
          Example
        </Label>
        <Input
          id={`meaning-${index}-example`}
          placeholder="Example sentence"
          disabled={disabled}
          {...register(`meanings.${index}.example` as const)}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 self-end text-muted-foreground hover:text-destructive sm:self-center"
        disabled={removeDisabled}
        onClick={onRemove}
        aria-label="Remove meaning row"
      >
        <Trash2 className="size-4" aria-hidden />
      </Button>
    </div>
  );
}

function SortableMeaningRow({
  id,
  index,
  register,
  onRemove,
  removeDisabled,
  disabled,
}: {
  id: string;
  index: number;
  register: UseFormArrayRegister;
  onRemove: () => void;
  removeDisabled: boolean;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...meaningRowGridStyle,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col gap-2 rounded-[1.25rem] border border-transparent p-1 sm:grid sm:items-center sm:gap-x-2",
        isDragging && "z-10 border-border bg-muted/40 shadow-md ring-1 ring-border",
      )}
    >
      <div className="flex shrink-0 justify-center sm:block">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
          disabled={disabled}
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-5" aria-hidden />
        </Button>
      </div>

      <div className="min-w-0 space-y-1 sm:space-y-0">
        <Label className="sm:hidden" htmlFor={`meaning-${index}-text`}>
          Meaning
        </Label>
        <Input
          id={`meaning-${index}-text`}
          placeholder="Translation"
          disabled={disabled}
          {...register(`meanings.${index}.meaning` as const)}
        />
      </div>

      <div className="min-w-0 space-y-1 sm:space-y-0">
        <Label className="sm:hidden" htmlFor={`meaning-${index}-example`}>
          Example
        </Label>
        <Input
          id={`meaning-${index}-example`}
          placeholder="Example sentence"
          disabled={disabled}
          {...register(`meanings.${index}.example` as const)}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 self-end text-muted-foreground hover:text-destructive sm:self-center"
        disabled={removeDisabled}
        onClick={onRemove}
        aria-label="Remove meaning row"
      >
        <Trash2 className="size-4" aria-hidden />
      </Button>
    </div>
  );
}
