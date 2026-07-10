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
  Link2,
  List,
  ListOrdered,
  Quote,
  type LucideIcon,
} from "lucide-react"
import { useRef, useState, type ChangeEvent } from "react"
import { toast } from "sonner"

import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { uploadAndRegisterImage } from "@/lib/image-upload"

type PostContentEditorProps = {
  title: string
  onTitleChange: (value: string) => void
  excerpt: string
  onExcerptChange: (value: string) => void
  content: string
  onContentChange: (value: string) => void
}

type ToolbarButton = {
  icon: LucideIcon
  label: string
  isActive: boolean
  disabled?: boolean
  onClick: () => void
}

function PostContentEditor({
  title,
  onTitleChange,
  excerpt,
  onExcerptChange,
  content,
  onContentChange,
}: PostContentEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Start writing your post...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => onContentChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none h-[380px] overflow-y-auto px-5 py-4 focus:outline-none [&_p]:my-2 [&_ol]:my-2 [&_ul]:my-2",
      },
    },
  })

  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      const text = ctx.editor?.state.doc.textContent.trim() ?? ""
      return {
        isBold: ctx.editor?.isActive("bold") ?? false,
        isItalic: ctx.editor?.isActive("italic") ?? false,
        isCentered: ctx.editor?.isActive({ textAlign: "center" }) ?? false,
        isBulletList: ctx.editor?.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor?.isActive("orderedList") ?? false,
        isLink: ctx.editor?.isActive("link") ?? false,
        isCode: ctx.editor?.isActive("code") ?? false,
        isBlockquote: ctx.editor?.isActive("blockquote") ?? false,
        wordCount: text ? text.split(/\s+/).length : 0,
      }
    },
  })

  const wordCount = editorState?.wordCount ?? 0
  const minutesToRead =
    wordCount === 0 ? 0 : Math.max(1, Math.round(wordCount / 200))

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
      const url = await uploadAndRegisterImage(file, title || "Post image")
      editor.chain().focus().setImage({ src: url }).run()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to upload image."
      )
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleImageButtonClick = () => {
    imageInputRef.current?.click()
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
    <div className="flex flex-col gap-4 rounded-2xl bg-[#FAFAFA] p-3 sm:p-4">
      <div className="rounded-xl border border-[#E8E8EC] bg-white">
        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Post title..."
          className="w-full border-b border-[#E8E8EC] bg-transparent px-5 py-4 text-xl font-semibold text-[#161616] placeholder:text-[#B0B0B0] focus:outline-none"
        />
        <Textarea
          value={excerpt}
          onChange={(event) => onExcerptChange(event.target.value)}
          placeholder="Write a short excerpt that summarizes this post..."
          className="min-h-20 resize-none rounded-none border-0 bg-[#FAFAFA] px-5 py-4 text-sm focus-visible:ring-0"
        />
      </div>

      <div className="rounded-xl border border-[#E8E8EC] bg-white">
        <div className="flex flex-wrap items-center gap-1 border-b border-[#E8E8EC] px-3 py-2">
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
            onClick={handleImageButtonClick}
            className="flex size-8 items-center justify-center rounded-md text-[#6B6B6B] hover:bg-[#F1F1F3] hover:text-[#4A4A4A] disabled:opacity-50"
          >
            <ImageIcon className="size-4" />
          </button>
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
        <div className="flex items-center gap-3 border-t border-[#E8E8EC] px-5 py-3 text-xs text-[#8C8C8C]">
          <span>{wordCount} words</span>
          <span>{minutesToRead} min read</span>
        </div>
      </div>
    </div>
  )
}

export { PostContentEditor }
