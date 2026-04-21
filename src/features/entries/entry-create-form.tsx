"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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
import { MeaningRowsField } from "@/features/entries/meaning-rows-field";
import { createEntrySchema, entryTypes, type CreateEntryInput } from "@/lib/validation";

const labels: Record<(typeof entryTypes)[number], string> = {
  vocab: "Vocab",
  grammar: "Grammar",
  note: "Note",
  example: "Example",
  mistake: "Mistake",
};

export function EntryCreateForm() {
  const router = useRouter();
  const form = useForm<CreateEntryInput>({
    resolver: zodResolver(createEntrySchema),
    defaultValues: {
      type: "note",
      title: "",
      content: "",
      meaning: [{ meaning: "", example: "" }],
      notes: "",
      source: "",
    },
  });

  const meaningRows = useFieldArray({
    control: form.control,
    name: "meaning",
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

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <Select
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              onOpenChange={(open) => {
                if (!open) field.onBlur();
              }}
            >
              <SelectTrigger id="type" className="w-full min-w-0">
                <SelectValue className="capitalize" />
              </SelectTrigger>
              <SelectContent>
                {entryTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {labels[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.type?.message ? (
          <p className="text-xs text-destructive">{form.formState.errors.type.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Headline or term" {...form.register("title")} />
        {form.formState.errors.title?.message ? (
          <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Controller
          name="content"
          control={form.control}
          render={({ field }) => (
            <RichTextEditor
              id="content"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={form.formState.isSubmitting}
              aria-invalid={Boolean(form.formState.errors.content)}
            />
          )}
        />
        {form.formState.errors.content?.message ? (
          <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <MeaningRowsField
          fields={meaningRows.fields}
          register={form.register}
          append={meaningRows.append}
          remove={meaningRows.remove}
          move={meaningRows.move}
          disabled={form.formState.isSubmitting}
        />
        {form.formState.errors.meaning?.message ? (
          <p className="text-xs text-destructive">{String(form.formState.errors.meaning.message)}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="source">Source</Label>
        <Input id="source" placeholder="Book, URL, speaker…" {...form.register("source")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="Extra context"
          className="resize-y font-mono text-sm"
          {...form.register("notes")}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : "Save entry"}
        </Button>
      </div>
    </form>
  );
}
