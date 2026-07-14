import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useState } from "react"

import { AddBlockMenu } from "@/components/builder/AddBlockMenu"
import { SortableBlockCard } from "@/components/builder/SortableBlockCard"
import { createBlock } from "@/lib/blocks/defaults"
import type { Block, BlockType } from "@/lib/blocks/types"

function BlockList({
  blocks,
  onChange,
}: {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  )

  const updateAt = (index: number, block: Block) => {
    onChange(blocks.map((b, i) => (i === index ? block : b)))
  }

  const removeAt = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index))
  }

  const duplicateAt = (index: number) => {
    const copy = { ...blocks[index], id: crypto.randomUUID() }
    onChange([
      ...blocks.slice(0, index + 1),
      copy,
      ...blocks.slice(index + 1),
    ])
  }

  const moveAt = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= blocks.length) {
      return
    }
    const next = [...blocks]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const addBlock = (type: BlockType) => {
    onChange([...blocks, createBlock(type)])
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }
    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    if (oldIndex === -1 || newIndex === -1) {
      return
    }
    onChange(arrayMove(blocks, oldIndex, newIndex))
  }

  return (
    <div className="flex flex-col gap-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, index) => (
            <SortableBlockCard
              key={block.id}
              block={block}
              isFirst={index === 0}
              isLast={index === blocks.length - 1}
              isCollapsed={collapsed[block.id] ?? false}
              onToggleCollapse={() =>
                setCollapsed((c) => ({ ...c, [block.id]: !c[block.id] }))
              }
              onMoveUp={() => moveAt(index, -1)}
              onMoveDown={() => moveAt(index, 1)}
              onDuplicate={() => duplicateAt(index)}
              onRemove={() => removeAt(index)}
              onChange={(next) => updateAt(index, next)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {blocks.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#E8E8EC] p-8 text-center text-sm text-[#8C8C8C]">
          No blocks yet — add your first block below.
        </div>
      )}

      <AddBlockMenu onAdd={addBlock} />
    </div>
  )
}

export { BlockList }
