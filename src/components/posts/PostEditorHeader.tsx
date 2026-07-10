import { ArrowLeft, Eye, Save, Zap } from "lucide-react"
import { Link } from "react-router-dom"

type PostEditorHeaderProps = {
  isEditing: boolean
  isSaving: boolean
  onPreview: () => void
  onSaveDraft: () => void
  onPublish: () => void
}

function PostEditorHeader({
  isEditing,
  isSaving,
  onPreview,
  onSaveDraft,
  onPublish,
}: PostEditorHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#E8E8EC] pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm">
        <Link
          to="/posts"
          aria-label="Back to posts"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[#4A4A4A] hover:bg-[#F1F1F3]"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-center gap-1.5 text-[#8C8C8C]">
          <Link to="/posts" className="hover:text-[#4A4A4A]">
            Posts
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#161616]">
            {isEditing ? "Edit Post" : "New Post"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-[#E8E8EC] px-3 text-sm font-medium text-[#4A4A4A] hover:bg-[#F7F8FA] disabled:opacity-50"
        >
          <Save className="size-4" />
          Save Draft
        </button>
        <button
          type="button"
          onClick={onPreview}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-[#E8E8EC] px-3 text-sm font-medium text-[#4A4A4A] hover:bg-[#F7F8FA]"
        >
          <Eye className="size-4" />
          Preview
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={isSaving}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-[#E97451] px-3 text-sm font-semibold text-white hover:bg-[#E0552A] disabled:opacity-50"
        >
          <Zap className="size-4" />
          {isSaving ? "Saving…" : "Publish"}
        </button>
      </div>
    </div>
  )
}

export { PostEditorHeader }
