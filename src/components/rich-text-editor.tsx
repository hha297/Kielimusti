"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  id?: string;
  value: string;
  onChange: (html: string) => void;
  onBlur: () => void;
  disabled?: boolean;
  placeholder?: string;
  "aria-invalid"?: boolean;
};

export function RichTextEditor({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  placeholder = "Main text, sentence, or explanation",
  "aria-invalid": ariaInvalid,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: { class: "my-2 list-disc pl-6 [&_p]:my-0" },
        },
        orderedList: {
          HTMLAttributes: { class: "my-2 list-decimal pl-6 [&_p]:my-0" },
        },
        paragraph: {
          HTMLAttributes: { class: "my-1 min-h-[1em]" },
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "<p></p>",
    editable: !disabled,
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        ...(ariaInvalid ? { "aria-invalid": "true" as const } : {}),
        class: cn(
          "min-h-[140px] px-3 py-2 text-sm outline-none",
          "focus-visible:outline-none",
          "[&_li]:my-0.5",
        ),
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  if (!editor) {
    return (
      <div
        className={cn(
          "min-h-[180px] rounded-lg border border-input bg-transparent",
          "animate-pulse bg-muted/30",
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-input bg-transparent shadow-xs",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40",
        ariaInvalid && "border-destructive ring-2 ring-destructive/20",
      )}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          onBlur();
        }
      }}
    >
      <div className="flex flex-wrap gap-0.5 border-b border-border/80 bg-muted/30 px-1 py-1">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="sm"
          className="size-8 p-0"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="sm"
          className="size-8 p-0"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          size="sm"
          className="size-8 p-0"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list"
        >
          <List className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          size="sm"
          className="size-8 p-0"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Numbered list"
        >
          <ListOrdered className="size-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="rich-text-editor" />
    </div>
  );
}
