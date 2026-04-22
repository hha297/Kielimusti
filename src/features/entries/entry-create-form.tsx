"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
  type UseFieldArrayReturn,
  type UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Textarea } from "@/components/ui/textarea";
import { createEntry } from "@/features/entries/actions";
import { getFieldConfigsForType, type FormFieldConfig } from "@/features/entries/entry-form-config";
import {
  ENTRY_TYPES,
  entryTypeLabels,
  noteKindLabels,
} from "@/features/entries/entry-taxonomy";
import { LanguageSelect } from "@/features/entries/language-select";
import { MeaningRowsField } from "@/features/entries/meaning-rows-field";
import { StringListField } from "@/features/entries/string-list-field";
import type { CreateEntryInput } from "@/lib/entry-create-schema";
import { createEntrySchema } from "@/lib/entry-create-schema";
import { NOTE_KINDS } from "@/types/entry-payload";
import { getDefaultEntryFormValues } from "@/types/entry-form";

export function EntryCreateForm() {
  const router = useRouter();
  const form = useForm<CreateEntryInput>({
    resolver: zodResolver(createEntrySchema) as Resolver<CreateEntryInput>,
    defaultValues: getDefaultEntryFormValues("note"),
  });

  const entryType = useWatch({ control: form.control, name: "type" });
  const prevType = useRef(entryType);

  useEffect(() => {
    if (prevType.current === entryType) return;
    prevType.current = entryType;
    const lang = form.getValues("language");
    form.reset({ ...getDefaultEntryFormValues(entryType), language: lang });
  }, [entryType, form]);

  const meaningRows = useFieldArray({
    control: form.control,
    name: "meanings",
  });

  async function onSubmit(data: CreateEntryInput) {
    const res = await createEntry(data);
    if (res.ok) {
      toast.success("Entry saved");
      router.push("/entries");
      router.refresh();
      return;
    }
    const fieldErrors = res.error;
    if (fieldErrors) {
      for (const [key, messages] of Object.entries(fieldErrors)) {
        const msg = messages?.[0];
        if (msg) {
          form.setError(key as never, { message: msg });
        }
      }
      toast.error("Fix the highlighted fields");
    }
  }

  const submitting = form.formState.isSubmitting;
  const errors = form.formState.errors;
  const fieldsConfig = getFieldConfigsForType(entryType);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-6">
        {fieldsConfig.map((field) => (
          <FormFieldBlock
            key={`${entryType}-${field.id}`}
            field={field}
            form={form}
            meaningRows={meaningRows}
            submitting={submitting}
            errors={errors}
          />
        ))}
      </div>

      <div className="flex justify-end gap-2 border-t border-border/60 pt-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save entry"}
        </Button>
      </div>
    </form>
  );
}

type EntryForm = UseFormReturn<CreateEntryInput>;
type MeaningsArrayApi = UseFieldArrayReturn<CreateEntryInput, "meanings", "id">;

function FormFieldBlock({
  field,
  form,
  meaningRows,
  submitting,
  errors,
}: {
  field: FormFieldConfig;
  form: EntryForm;
  meaningRows: MeaningsArrayApi;
  submitting: boolean;
  errors: EntryForm["formState"]["errors"];
}) {
  const id = field.id;

  if (id === "type") {
    return (
      <div className="space-y-2">
        <Label htmlFor="entry-type">{field.label}</Label>
        <Controller
          control={form.control}
          name="type"
          render={({ field: f }) => (
            <Select
              name={f.name}
              value={f.value}
              onValueChange={f.onChange}
              onOpenChange={(open) => {
                if (!open) f.onBlur();
              }}
            >
              <SelectTrigger id="entry-type" className="w-full min-w-0 capitalize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ENTRY_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {entryTypeLabels[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.type?.message ? (
          <p className="text-xs text-destructive">{errors.type.message}</p>
        ) : null}
      </div>
    );
  }

  if (id === "language") {
    return (
      <LanguageSelect
        control={form.control}
        name="language"
        disabled={submitting}
        error={
          typeof errors.language?.message === "string" ? errors.language.message : undefined
        }
      />
    );
  }

  if (id === "title") {
    const entryType = form.watch("type");
    return (
      <div className="space-y-2">
        <Label htmlFor="title">{field.label}</Label>
        <Input
          id="title"
          placeholder={field.placeholder}
          disabled={submitting}
          {...form.register("title")}
        />
        {entryType !== "note" && errors.title?.message ? (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        ) : null}
      </div>
    );
  }

  if (id === "partOfSpeech") {
    const name = id;
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{field.label}</Label>
        <Input
          id={name}
          placeholder={field.placeholder}
          disabled={submitting}
          {...form.register(name)}
        />
      </div>
    );
  }

  if (id === "structure") {
    return (
      <div className="space-y-2">
        <Label htmlFor="structure">{field.label}</Label>
        <Input
          id="structure"
          placeholder={field.placeholder}
          disabled={submitting}
          {...form.register("structure")}
        />
      </div>
    );
  }

  if (id === "usageNotes") {
    return (
      <div className="space-y-2">
        <Label htmlFor="usageNotes">{field.label}</Label>
        <Textarea
          id="usageNotes"
          rows={3}
          placeholder={field.placeholder}
          className="resize-y font-mono text-sm"
          disabled={submitting}
          {...form.register("usageNotes")}
        />
      </div>
    );
  }

  if (id === "source") {
    return (
      <div className="space-y-2">
        <Label htmlFor="source">{field.label}</Label>
        <Input
          id="source"
          placeholder={field.placeholder}
          disabled={submitting}
          {...form.register("source")}
        />
      </div>
    );
  }

  if (id === "notes") {
    return (
      <div className="space-y-2">
        <Label htmlFor="notes">{field.label}</Label>
        {field.description ? (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        ) : null}
        <Textarea
          id="notes"
          rows={3}
          placeholder={field.placeholder}
          className="resize-y font-mono text-sm"
          disabled={submitting}
          {...form.register("notes")}
        />
      </div>
    );
  }

  if (id === "content") {
    return (
      <div className="space-y-2">
        <Label htmlFor="content">{field.label}</Label>
        {field.description ? (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        ) : null}
        <Controller
          name="content"
          control={form.control}
          render={({ field: f }) => (
            <RichTextEditor
              id="content"
              value={f.value ?? ""}
              onChange={f.onChange}
              onBlur={f.onBlur}
              disabled={submitting}
              aria-invalid={Boolean(errors.content)}
            />
          )}
        />
        {errors.content?.message ? (
          <p className="text-xs text-destructive">{errors.content.message}</p>
        ) : null}
      </div>
    );
  }

  if (id === "meanings") {
    return (
      <div className="space-y-2">
        <Label>{field.label}</Label>
        {field.description ? (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        ) : null}
        <MeaningRowsField
          fields={meaningRows.fields}
          register={form.register}
          append={meaningRows.append}
          remove={meaningRows.remove}
          move={meaningRows.move}
          disabled={submitting}
        />
        {errors.meanings?.message ? (
          <p className="text-xs text-destructive">{String(errors.meanings.message)}</p>
        ) : null}
      </div>
    );
  }

  if (id === "synonyms") {
    return (
      <StringListField<CreateEntryInput>
        control={form.control}
        name="synonyms"
        label={field.label}
        addLabel="Add synonym"
        placeholder={field.placeholder}
        disabled={submitting}
      />
    );
  }

  if (id === "antonyms") {
    return (
      <StringListField<CreateEntryInput>
        control={form.control}
        name="antonyms"
        label={field.label}
        addLabel="Add antonym"
        placeholder={field.placeholder}
        disabled={submitting}
      />
    );
  }

  if (id === "examples") {
    return (
      <StringListField<CreateEntryInput>
        control={form.control}
        name="examples"
        label={field.label}
        addLabel="Add example"
        placeholder={field.placeholder}
        disabled={submitting}
      />
    );
  }

  if (id === "commonMistakes") {
    return (
      <StringListField<CreateEntryInput>
        control={form.control}
        name="commonMistakes"
        label={field.label}
        addLabel="Add mistake"
        placeholder={field.placeholder}
        disabled={submitting}
      />
    );
  }

  if (id === "tags") {
    return (
      <StringListField<CreateEntryInput>
        control={form.control}
        name="tags"
        label={field.label}
        addLabel="Add tag"
        placeholder={field.placeholder}
        disabled={submitting}
      />
    );
  }

  if (id === "noteKind") {
    return (
      <div className="space-y-2">
        <Label htmlFor="noteKind">{field.label}</Label>
        {field.description ? (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        ) : null}
        <Controller
          control={form.control}
          name="noteKind"
          render={({ field: f }) => (
            <Select
              value={f.value ?? "None"}
              onValueChange={(v) => f.onChange(v === "None" ? undefined : v)}
              onOpenChange={(open) => {
                if (!open) f.onBlur();
              }}
            >
              <SelectTrigger id="noteKind" className="w-full min-w-0 capitalize">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                {NOTE_KINDS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {noteKindLabels[k]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>
    );
  }

  return null;
}
