"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  SquareCode,
  Strikethrough,
  Undo2,
} from "lucide-react";

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
  placeholder = "Main text, sentence, or explanation...",
  "aria-invalid": ariaInvalid,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: {
          HTMLAttributes: { class: "my-2 list-disc pl-6 [&_p]:my-0" },
        },
        orderedList: {
          HTMLAttributes: { class: "my-2 list-decimal pl-6 [&_p]:my-0" },
        },
        paragraph: {
          HTMLAttributes: { class: "my-1 min-h-[1em]" },
        },
        blockquote: {
          HTMLAttributes: { class: "my-2 border-l-2 border-border pl-3 text-muted-foreground" },
        },
        codeBlock: {
          HTMLAttributes: { class: "my-2 rounded-lg bg-muted px-3 py-2 font-mono text-xs" },
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
          "min-h-[120px] px-3 py-2 text-sm font-normal outline-none",
          "focus-visible:outline-none",
          "[&_li]:my-0.5",
          "[&_h1]:mt-3 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1:first-child]:mt-0",
          "[&_h2]:mt-3 [&_h2]:mb-1 [&_h2]:text-lg [&_h2]:font-semibold [&_h2:first-child]:mt-0",
          "[&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-base [&_h3]:font-semibold [&_h3:first-child]:mt-0",
          "[&_hr]:my-4 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-border",
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
          "h-[260px] min-h-[200px] max-h-[85vh] resize-y overflow-hidden rounded-[1.25rem] border border-input bg-white",
          "animate-pulse bg-muted/30",
        )}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-[260px] min-h-[200px] max-h-[85vh] flex-col overflow-hidden rounded-[1.25rem] border border-input bg-white shadow-[var(--shadow-float)]",
        "resize-y focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/35",
        ariaInvalid && "border-destructive ring-2 ring-destructive/25",
        disabled && "resize-none",
      )}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          onBlur();
        }
      }}
    >
      <div className="flex shrink-0 flex-wrap gap-0.5 border-b border-border bg-muted/40 px-1 py-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 p-0"
          disabled={disabled || !editor.can().undo()}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().undo().run()}
          aria-label="Undo"
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 p-0"
          disabled={disabled || !editor.can().redo()}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().redo().run()}
          aria-label="Redo"
        >
          <Redo2 className="size-4" />
        </Button>
        <span className="mx-0.5 hidden w-px self-stretch bg-border sm:block" aria-hidden />
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
          variant={editor.isActive("strike") ? "secondary" : "ghost"}
          size="sm"
          className="size-8 p-0"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
        >
          <Strikethrough className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("code") ? "secondary" : "ghost"}
          size="sm"
          className="size-8 p-0"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleCode().run()}
          aria-label="Inline code"
        >
          <Code className="size-4" />
        </Button>
        <span className="mx-0.5 hidden w-px self-stretch bg-border sm:block" aria-hidden />
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
          size="sm"
          className="size-8 p-0"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          aria-label="Heading 1"
        >
          <Heading1 className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
          size="sm"
          className="size-8 p-0"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Heading 2"
        >
          <Heading2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
          size="sm"
          className="size-8 p-0"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          aria-label="Heading 3"
        >
          <Heading3 className="size-4" />
        </Button>
        <span className="mx-0.5 hidden w-px self-stretch bg-border sm:block" aria-hidden />
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
        <span className="mx-0.5 hidden w-px self-stretch bg-border sm:block" aria-hidden />
        <Button
          type="button"
          variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
          size="sm"
          className="size-8 p-0"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote"
        >
          <Quote className="size-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("codeBlock") ? "secondary" : "ghost"}
          size="sm"
          className="size-8 p-0"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          aria-label="Code block"
        >
          <SquareCode className="size-4" />
        </Button>
        <span className="mx-0.5 hidden w-px self-stretch bg-border sm:block" aria-hidden />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 p-0"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          aria-label="Horizontal rule"
        >
          <Minus className="size-4" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="rich-text-editor" />
      </div>
    </div>
  );
}
