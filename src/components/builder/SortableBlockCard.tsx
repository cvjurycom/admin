import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Copy,
  GripVertical,
  Trash2,
} from "lucide-react"

import { BlockEditor } from "@/components/builder/BlockEditor"
import { Button } from "@/components/ui/button"
import { BLOCK_ICONS, BLOCK_LABELS } from "@/lib/blocks/types"
import type { Block } from "@/lib/blocks/types"

function SortableBlockCard({
  block,
  isFirst,
  isLast,
  isCollapsed,
  onToggleCollapse,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
  onChange,
}: {
  block: Block
  isFirst: boolean
  isLast: boolean
  isCollapsed: boolean
  onToggleCollapse: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDuplicate: () => void
  onRemove: () => void
  onChange: (block: Block) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })
  const Icon = BLOCK_ICONS[block.type]

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="rounded-xl border border-[#E8E8EC] bg-white"
    >
      <div className="flex items-center justify-between gap-2 border-b border-[#E8E8EC] px-4 py-2.5">
        <div className="flex items-center gap-1">
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab touch-none text-[#B0B0B0] hover:text-[#6B6B6B] active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            <GripVertical className="size-4" />
          </button>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex items-center gap-2 text-sm font-medium text-[#161616]"
          >
            {isCollapsed ? (
              <ChevronRight className="size-4 text-[#8C8C8C]" />
            ) : (
              <ChevronDown className="size-4 text-[#8C8C8C]" />
            )}
            <Icon className="size-4 text-[#6B6B6B]" />
            {BLOCK_LABELS[block.type]}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isFirst}
            onClick={onMoveUp}
            aria-label="Move up"
          >
            <ArrowUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={isLast}
            onClick={onMoveDown}
            aria-label="Move down"
          >
            <ArrowDown className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onDuplicate}
            aria-label="Duplicate block"
          >
            <Copy className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label="Delete block"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="p-4">
          <BlockEditor block={block} onChange={onChange} />
        </div>
      )}
    </div>
  )
}

export { SortableBlockCard }
