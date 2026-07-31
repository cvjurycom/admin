import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import { Bold, Check, Italic, List, ListOrdered, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { COLOR_SWATCHES } from "@/lib/colors"
import { cn } from "@/lib/utils"

function ColorSwatchPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (color: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COLOR_SWATCHES.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={`Use color ${color}`}
          onClick={() => onChange(color)}
          className="flex size-6 items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
        >
          {value.toLowerCase() === color.toLowerCase() && (
            <Check className="size-3 text-white" />
          )}
        </button>
      ))}
    </div>
  )
}

type StringListEditorProps = {
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  addLabel?: string
}

function StringListEditor({
  items,
  onChange,
  placeholder,
  addLabel = "Add item",
}: StringListEditorProps) {
  const updateAt = (index: number, value: string) => {
    onChange(items.map((item, i) => (i === index ? value : item)))
  }
  const removeAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item}
            placeholder={placeholder}
            onChange={(event) => updateAt(index, event.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => removeAt(index)}
            aria-label="Remove item"
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, ""])}
        className="w-fit"
      >
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  )
}

type RepeatingRowsProps<T> = {
  items: T[]
  onChange: (items: T[]) => void
  createItem: () => T
  renderRow: (item: T, update: (next: T) => void) => React.ReactNode
  addLabel?: string
}

function RepeatingRows<T>({
  items,
  onChange,
  createItem,
  renderRow,
  addLabel = "Add row",
}: RepeatingRowsProps<T>) {
  const updateAt = (index: number, next: T) => {
    onChange(items.map((item, i) => (i === index ? next : item)))
  }
  const removeAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-2 rounded-lg border border-[#E8E8EC] p-3"
        >
          <div className="flex-1">
            {renderRow(item, (next) => updateAt(index, next))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => removeAt(index)}
            aria-label="Remove row"
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, createItem()])}
        className="w-fit"
      >
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  )
}

function InlineRichTextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
      }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-9 px-3 py-2 text-sm focus:outline-none [&_p]:m-0 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5",
      },
    },
  })

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor?.isActive("bold") ?? false,
      isItalic: ctx.editor?.isActive("italic") ?? false,
      isBulletList: ctx.editor?.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor?.isActive("orderedList") ?? false,
    }),
  })

  return (
    <div className="rounded-md border border-[#E8E8EC] bg-white">
      <div className="flex items-center gap-1 border-b border-[#E8E8EC] px-1.5 py-1">
        <button
          type="button"
          aria-label="Bold"
          aria-pressed={editorState?.isBold}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={cn(
            "flex size-6 items-center justify-center rounded text-[#6B6B6B] hover:bg-[#F1F1F3]",
            editorState?.isBold && "bg-[#FDECE3] text-[#E97451]"
          )}
        >
          <Bold className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label="Italic"
          aria-pressed={editorState?.isItalic}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={cn(
            "flex size-6 items-center justify-center rounded text-[#6B6B6B] hover:bg-[#F1F1F3]",
            editorState?.isItalic && "bg-[#FDECE3] text-[#E97451]"
          )}
        >
          <Italic className="size-3.5" />
        </button>
        <span className="mx-1 h-4 w-px bg-[#E8E8EC]" />
        <button
          type="button"
          aria-label="Bullet list"
          aria-pressed={editorState?.isBulletList}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={cn(
            "flex size-6 items-center justify-center rounded text-[#6B6B6B] hover:bg-[#F1F1F3]",
            editorState?.isBulletList && "bg-[#FDECE3] text-[#E97451]"
          )}
        >
          <List className="size-3.5" />
        </button>
        <button
          type="button"
          aria-label="Numbered list"
          aria-pressed={editorState?.isOrderedList}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={cn(
            "flex size-6 items-center justify-center rounded text-[#6B6B6B] hover:bg-[#F1F1F3]",
            editorState?.isOrderedList && "bg-[#FDECE3] text-[#E97451]"
          )}
        >
          <ListOrdered className="size-3.5" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export { ColorSwatchPicker, InlineRichTextInput, RepeatingRows, StringListEditor }
