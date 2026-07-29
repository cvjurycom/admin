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
import {
  CalendarDays,
  Clock,
  Copy,
  Link2,
  RefreshCw,
  Share2,
} from "lucide-react"
import { useState } from "react"

import { CanvasBlockWrapper } from "@/components/builder/CanvasBlockWrapper"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { renderBlocksToHtml } from "@/lib/blocks/render-html"
import type { Block } from "@/lib/blocks/types"

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?"
}

function readingTimeFor(blocks: Block[]) {
  const text = renderBlocksToHtml(blocks)
    .replace(/<[^>]+>/g, " ")
    .trim()
  const words = text ? text.split(/\s+/).length : 0
  return words === 0 ? 0 : Math.max(1, Math.round(words / 200))
}

function formatDate(value: string) {
  const date = value ? new Date(value) : new Date()
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function tocItemsFor(blocks: Block[]) {
  return blocks
    .filter(
      (block): block is Extract<Block, { type: "heading" }> =>
        block.type === "heading" && block.level === 2 && Boolean(block.text)
    )
    .map((block) => ({ id: slugify(block.text), text: block.text }))
}

function ArticleToc({
  items,
  activeIndex,
  onSelect,
}: {
  items: { id: string; text: string }[]
  activeIndex: number
  onSelect: (index: number, id: string) => void
}) {
  return (
    <div className="w-44 shrink-0 pt-1 pr-6">
      <p className="mb-3 text-[10px] font-bold tracking-widest text-[#B0B0B0] uppercase">
        In this article
      </p>
      <ol className="space-y-0.5">
        {items.map((item, index) => {
          const isActive = index === activeIndex
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  onSelect(index, item.id)
                }}
                className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors ${
                  isActive
                    ? "bg-[#FDF3EC] font-semibold text-[#E97451]"
                    : "text-[#6B6B6B] hover:bg-[#FAFAFA] hover:text-[#161616]"
                }`}
              >
                <span
                  className={`mt-0.5 w-3 shrink-0 text-[10px] ${
                    isActive ? "text-[#E97451]" : "text-[#B0B0B0]"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="leading-snug">{item.text}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

type PostEditorCanvasProps = {
  isPreview: boolean
  title: string
  excerpt: string
  blocks: Block[]
  onBlocksChange: (blocks: Block[]) => void
  selectedBlockId: string | null
  onSelectBlock: (id: string | null) => void
  tags: string[]
  categoryName: string
  authorName: string
  authorTitle: string
  featuredImageUrl: string
  reviewerName: string
  reviewerTitle: string
  audienceNote: string
  publishedAt: string
  updatedAt: string
}

function PostEditorCanvas({
  isPreview,
  title,
  excerpt,
  blocks,
  onBlocksChange,
  selectedBlockId,
  onSelectBlock,
  tags,
  categoryName,
  authorName,
  authorTitle,
  featuredImageUrl,
  reviewerName,
  reviewerTitle,
  audienceNote,
  publishedAt,
  updatedAt,
}: PostEditorCanvasProps) {
  const [activeTocIndex, setActiveTocIndex] = useState(0)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  )
  const tocItems = tocItemsFor(blocks)

  const moveAt = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= blocks.length) {
      return
    }
    const next = [...blocks]
    ;[next[index], next[target]] = [next[target], next[index]]
    onBlocksChange(next)
  }

  const duplicateAt = (index: number) => {
    const copy = { ...blocks[index], id: crypto.randomUUID() }
    onBlocksChange([
      ...blocks.slice(0, index + 1),
      copy,
      ...blocks.slice(index + 1),
    ])
  }

  const removeAt = (index: number) => {
    const removedId = blocks[index].id
    onBlocksChange(blocks.filter((_, i) => i !== index))
    if (selectedBlockId === removedId) {
      onSelectBlock(null)
    }
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
    onBlocksChange(arrayMove(blocks, oldIndex, newIndex))
  }

  const readingTime = readingTimeFor(blocks)
  const publishedLabel = formatDate(publishedAt)
  const updatedLabel = updatedAt ? formatDate(updatedAt) : null

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#E8E8EC] bg-white ${
        isPreview ? "w-full" : "mx-auto w-full max-w-3xl"
      }`}
    >
      {isPreview && (
        <div className="flex items-center gap-2 border-b border-[#E8E8EC] bg-[#FAFAFA] px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-[#F87171]" />
          <span className="size-2.5 rounded-full bg-[#FBBF24]" />
          <span className="size-2.5 rounded-full bg-[#4ADE80]" />
          <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-xs text-[#8C8C8C]">
            cvjury.com/blog/{slugify(title) || "untitled-post"}
          </span>
        </div>
      )}

      <div className="p-6 sm:p-10">
        <div className="mb-4 flex items-center gap-1.5 text-xs text-[#B0B0B0]">
          <span>←</span>
          <span className="cursor-pointer hover:text-[#6B6B6B]">Blog</span>
          <span className="text-[#D8D8DC]">/</span>
          <span className="font-medium text-[#6B6B6B]">
            {categoryName || "Uncategorized"}
          </span>
        </div>

        {categoryName && (
          <span className="mb-4 inline-block rounded-full border border-[#F5A090] px-3 py-1 text-[11px] font-semibold tracking-widest text-[#E97451] uppercase">
            {categoryName}
          </span>
        )}
        <h1 className="mt-4 text-3xl font-bold text-[#161616] sm:text-4xl">
          {title || "Untitled Post"}
        </h1>
        {excerpt && <p className="mt-4 text-base text-[#6B6B6B]">{excerpt}</p>}

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2.5">
              <Avatar size="lg">
                <AvatarFallback className="bg-[#FDECE3] font-semibold text-[#E97451]">
                  {initialsFor(authorName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs text-[#8C8C8C]">
                  Written By{" "}
                  <span className="font-semibold text-[#161616]">
                    {authorName}
                  </span>
                </p>
                {authorTitle && (
                  <p className="text-xs text-[#8C8C8C]">{authorTitle}</p>
                )}
              </div>
            </div>

            {reviewerName && (
              <div className="flex items-center gap-2.5">
                <Avatar size="lg">
                  <AvatarFallback className="bg-[#161616] font-semibold text-white">
                    {initialsFor(reviewerName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-[#8C8C8C]">
                    Reviewed By{" "}
                    <span className="font-semibold text-[#161616]">
                      {reviewerName}
                    </span>
                  </p>
                  {reviewerTitle && (
                    <p className="text-xs text-[#8C8C8C]">{reviewerTitle}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8C8C8C]">Share:</span>
            <button
              type="button"
              aria-label="Share on X"
              className="flex size-7 items-center justify-center rounded-full bg-[#F1F1F3] text-[#4A4A4A] hover:bg-[#E8E8EC]"
            >
              <Share2 className="size-3.5" />
            </button>
            <button
              type="button"
              aria-label="Share on LinkedIn"
              className="flex size-7 items-center justify-center rounded-full bg-[#F1F1F3] text-[#4A4A4A] hover:bg-[#E8E8EC]"
            >
              <Link2 className="size-3.5" />
            </button>
            <button
              type="button"
              className="flex h-7 items-center gap-1.5 rounded-full border border-[#E8E8EC] px-2.5 text-xs font-medium text-[#4A4A4A] hover:bg-[#F7F8FA]"
            >
              <Copy className="size-3.5" />
              Copy link
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#E8E8EC] pb-5 text-xs text-[#8C8C8C]">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            Published <span className="font-medium">{publishedLabel}</span>
          </div>
          {updatedLabel && (
            <>
              <span className="h-3 w-px bg-[#E8E8EC]" />
              <div className="flex items-center gap-1.5">
                <RefreshCw className="size-3.5" />
                Updated <span className="font-medium">{updatedLabel}</span>
              </div>
            </>
          )}
          <span className="h-3 w-px bg-[#E8E8EC]" />
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {readingTime} min read
          </div>
          {audienceNote && (
            <>
              <span className="h-3 w-px bg-[#E8E8EC]" />
              <span className="font-medium text-[#4A4A4A]">
                {audienceNote}
              </span>
            </>
          )}
        </div>

        {featuredImageUrl && (
          <img
            src={featuredImageUrl}
            alt={title || "Featured image"}
            className="mt-6 aspect-video w-full rounded-xl object-cover"
          />
        )}

        {tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F1F1F3] px-3 py-1 text-xs font-medium text-[#6B6B6B]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className={tocItems.length > 0 ? "flex items-start gap-0" : ""}>
          {tocItems.length > 0 && (
            <ArticleToc
              items={tocItems}
              activeIndex={activeTocIndex}
              onSelect={(index, id) => {
                setActiveTocIndex(index)
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }}
            />
          )}

          <div className="prose prose-sm mt-8 min-w-0 max-w-none flex-1">
            {blocks.length === 0 ? (
              <div className="not-prose rounded-xl border-2 border-dashed border-[#E8E8EC] p-12 text-center">
                <p className="mb-1 text-sm font-medium text-[#8C8C8C]">
                  No blocks yet
                </p>
                <p className="text-xs text-[#B0B0B0]">
                  {isPreview
                    ? "Head back to the editor to add content."
                    : "Click any component in the left panel to add it here."}
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={blocks.map((block) => block.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {blocks.map((block, index) => (
                    <CanvasBlockWrapper
                      key={block.id}
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      isPreview={isPreview}
                      canMoveUp={index > 0}
                      canMoveDown={index < blocks.length - 1}
                      onSelect={() => onSelectBlock(block.id)}
                      onMoveUp={() => moveAt(index, -1)}
                      onMoveDown={() => moveAt(index, 1)}
                      onDuplicate={() => duplicateAt(index)}
                      onRemove={() => removeAt(index)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { PostEditorCanvas }
