import { ArrowLeft, Edit3, Eye, Save, Zap } from "lucide-react"
import { Link } from "react-router-dom"

type ViewMode = "edit" | "preview"

type PostEditorHeaderProps = {
  isEditing: boolean
  isSaving: boolean
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onSaveDraft: () => void
  onPublish: () => void
}

function PostEditorHeader({
  isEditing,
  isSaving,
  viewMode,
  onViewModeChange,
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
        <div className="flex items-center rounded-lg border border-[#E8E8EC] bg-[#FAFAFA] p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange("edit")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              viewMode === "edit"
                ? "bg-white text-[#161616] shadow-sm"
                : "text-[#8C8C8C] hover:text-[#4A4A4A]"
            }`}
          >
            <Edit3 className="size-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("preview")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              viewMode === "preview"
                ? "bg-white text-[#161616] shadow-sm"
                : "text-[#8C8C8C] hover:text-[#4A4A4A]"
            }`}
          >
            <Eye className="size-3.5" />
            Preview
          </button>
        </div>
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
