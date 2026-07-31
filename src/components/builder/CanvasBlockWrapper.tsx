import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ChevronDown, ChevronUp, Copy, GripVertical, Trash2 } from "lucide-react"

import { BlockRenderer } from "@/components/blocks/BlockRenderer"
import { BLOCK_LABELS } from "@/lib/blocks/types"
import type { Block } from "@/lib/blocks/types"

function CanvasBlockWrapper({
  block,
  isSelected,
  isPreview,
  canMoveUp,
  canMoveDown,
  onSelect,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
}: {
  block: Block
  isSelected: boolean
  isPreview: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  onSelect: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id, disabled: isPreview })

  if (isPreview) {
    return (
      <div className="mb-6">
        <BlockRenderer block={block} />
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className={`group relative mb-6 cursor-pointer rounded-xl transition-all ${
        isSelected
          ? "ring-2 ring-[#E97451] ring-offset-2"
          : "hover:ring-1 hover:ring-[#D8D8DC] hover:ring-offset-1"
      }`}
      onClick={onSelect}
    >
      <BlockRenderer block={block} />

      <div
        className={`absolute top-2 right-2 flex items-center gap-1 transition-opacity ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="flex size-6 cursor-grab items-center justify-center rounded border border-[#E8E8EC] bg-white text-[#8C8C8C] shadow-sm transition-colors hover:bg-[#FAFAFA] active:cursor-grabbing"
        >
          <GripVertical className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          aria-label="Move up"
          className="flex size-6 items-center justify-center rounded border border-[#E8E8EC] bg-white shadow-sm transition-colors hover:bg-[#FAFAFA] disabled:opacity-30"
        >
          <ChevronUp className="size-3.5 text-[#4A4A4A]" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          aria-label="Move down"
          className="flex size-6 items-center justify-center rounded border border-[#E8E8EC] bg-white shadow-sm transition-colors hover:bg-[#FAFAFA] disabled:opacity-30"
        >
          <ChevronDown className="size-3.5 text-[#4A4A4A]" />
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          aria-label="Duplicate block"
          className="flex size-6 items-center justify-center rounded border border-[#E8E8EC] bg-white shadow-sm transition-colors hover:bg-[#FAFAFA]"
        >
          <Copy className="size-3.5 text-[#4A4A4A]" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Delete block"
          className="flex size-6 items-center justify-center rounded border border-[#F9D7D7] bg-white shadow-sm transition-colors hover:bg-[#FDF1F1]"
        >
          <Trash2 className="size-3.5 text-[#E11D48]" />
        </button>
      </div>

      {isSelected && (
        <div className="absolute top-2 left-2">
          <span className="rounded border border-[#F3D9C7] bg-[#FDF3EC] px-1.5 py-0.5 text-[10px] font-semibold text-[#E97451]">
            {BLOCK_LABELS[block.type]}
          </span>
        </div>
      )}
    </div>
  )
}

export { CanvasBlockWrapper }
