import { EditorContent, useEditor, useEditorState } from "@tiptap/react"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import {
  AlignCenter,
  AlignLeft,
  Bold,
  Code,
  Image as ImageIcon,
  Italic,
  LibraryBig,
  Link2,
  List,
  ListOrdered,
  Quote,
  type LucideIcon,
} from "lucide-react"
import { useRef, useState, type ChangeEvent } from "react"
import { toast } from "sonner"

import { MediaLibraryDialog } from "@/components/media/MediaLibraryDialog"
import { cn } from "@/lib/utils"
import { uploadAndRegisterImage } from "@/lib/image-upload"
import type { RichTextBlock } from "@/lib/blocks/types"

type ToolbarButton = {
  icon: LucideIcon
  label: string
  isActive: boolean
  disabled?: boolean
  onClick: () => void
}

function RichTextBlockEditor({
  block,
  onChange,
}: {
  block: RichTextBlock
  onChange: (block: RichTextBlock) => void
}) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
    ],
    content: block.html,
    onUpdate: ({ editor }) =>
      onChange({ ...block, html: editor.getHTML() }),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[160px] px-4 py-3 focus:outline-none [&_p]:my-2 [&_ol]:my-2 [&_ul]:my-2 [&_a]:text-[#E97451] [&_a]:underline [&_a]:decoration-[#E97451]",
      },
    },
  })

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor?.isActive("bold") ?? false,
      isItalic: ctx.editor?.isActive("italic") ?? false,
      isCentered: ctx.editor?.isActive({ textAlign: "center" }) ?? false,
      isBulletList: ctx.editor?.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor?.isActive("orderedList") ?? false,
      isLink: ctx.editor?.isActive("link") ?? false,
      isCode: ctx.editor?.isActive("code") ?? false,
      isBlockquote: ctx.editor?.isActive("blockquote") ?? false,
    }),
  })

  const handleToggleLink = () => {
    if (!editor) {
      return
    }
    if (editorState?.isLink) {
      editor.chain().focus().unsetLink().run()
      return
    }
    const url = window.prompt("Enter a URL")
    if (!url) {
      return
    }
    editor.chain().focus().setLink({ href: url }).run()
  }

  const handleToggleAlign = () => {
    if (!editor) {
      return
    }
    editor
      .chain()
      .focus()
      .setTextAlign(editorState?.isCentered ? "left" : "center")
      .run()
  }

  const handleImageFileChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || !editor) {
      return
    }

    setIsUploadingImage(true)
    try {
      const url = await uploadAndRegisterImage(file, "Post image")
      editor.chain().focus().setImage({ src: url }).run()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to upload image."
      )
    } finally {
      setIsUploadingImage(false)
    }
  }

  const toolbarButtons: ToolbarButton[] = [
    {
      icon: Bold,
      label: "Bold",
      isActive: editorState?.isBold ?? false,
      onClick: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      label: "Italic",
      isActive: editorState?.isItalic ?? false,
      onClick: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      icon: editorState?.isCentered ? AlignCenter : AlignLeft,
      label: "Align",
      isActive: editorState?.isCentered ?? false,
      onClick: handleToggleAlign,
    },
    {
      icon: List,
      label: "Bullet list",
      isActive: editorState?.isBulletList ?? false,
      onClick: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      isActive: editorState?.isOrderedList ?? false,
      onClick: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: Link2,
      label: "Insert link",
      isActive: editorState?.isLink ?? false,
      onClick: handleToggleLink,
    },
    {
      icon: Code,
      label: "Code",
      isActive: editorState?.isCode ?? false,
      onClick: () => editor?.chain().focus().toggleCode().run(),
    },
    {
      icon: Quote,
      label: "Quote",
      isActive: editorState?.isBlockquote ?? false,
      onClick: () => editor?.chain().focus().toggleBlockquote().run(),
    },
  ]

  return (
    <div className="rounded-lg border border-[#E8E8EC] bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#E8E8EC] px-2 py-1.5">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageFileChange}
        />
        {toolbarButtons.slice(0, 6).map((tool) => (
          <button
            key={tool.label}
            type="button"
            aria-label={tool.label}
            aria-pressed={tool.isActive}
            disabled={tool.disabled}
            onClick={tool.onClick}
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-[#6B6B6B] hover:bg-[#F1F1F3] hover:text-[#4A4A4A] disabled:opacity-50",
              tool.isActive &&
                "bg-[#FDECE3] text-[#E97451] hover:bg-[#FDECE3] hover:text-[#E97451]"
            )}
          >
            <tool.icon className="size-4" />
          </button>
        ))}
        <button
          type="button"
          aria-label="Insert image"
          disabled={isUploadingImage}
          onClick={() => imageInputRef.current?.click()}
          className="flex size-8 items-center justify-center rounded-md text-[#6B6B6B] hover:bg-[#F1F1F3] hover:text-[#4A4A4A] disabled:opacity-50"
        >
          <ImageIcon className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Choose image from library"
          onClick={() => setIsLibraryOpen(true)}
          className="flex size-8 items-center justify-center rounded-md text-[#6B6B6B] hover:bg-[#F1F1F3] hover:text-[#4A4A4A] disabled:opacity-50"
        >
          <LibraryBig className="size-4" />
        </button>
        <MediaLibraryDialog
          open={isLibraryOpen}
          onOpenChange={setIsLibraryOpen}
          onSelect={(media) => {
            if (media.imageUrl) {
              editor?.chain().focus().setImage({ src: media.imageUrl }).run()
            }
          }}
        />
        {toolbarButtons.slice(6).map((tool) => (
          <button
            key={tool.label}
            type="button"
            aria-label={tool.label}
            aria-pressed={tool.isActive}
            disabled={tool.disabled}
            onClick={tool.onClick}
            className={cn(
              "flex size-8 items-center justify-center rounded-md text-[#6B6B6B] hover:bg-[#F1F1F3] hover:text-[#4A4A4A] disabled:opacity-50",
              tool.isActive &&
                "bg-[#FDECE3] text-[#E97451] hover:bg-[#FDECE3] hover:text-[#E97451]"
            )}
          >
            <tool.icon className="size-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export { RichTextBlockEditor }
