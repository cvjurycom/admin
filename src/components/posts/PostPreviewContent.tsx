import {
  CalendarDays,
  Clock,
  Copy,
  Link2,
  RefreshCw,
  Share2,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BlockRenderer } from "@/components/blocks/BlockRenderer"
import { renderBlocksToHtml } from "@/lib/blocks/render-html"
import type { Block } from "@/lib/blocks/types"

type PostPreviewContentProps = {
  title: string
  excerpt: string
  blocks: Block[]
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

function PostPreviewContent({
  title,
  excerpt,
  blocks,
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
}: PostPreviewContentProps) {
  const readingTime = readingTimeFor(blocks)
  const publishedLabel = formatDate(publishedAt)
  const updatedLabel = updatedAt ? formatDate(updatedAt) : null

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 rounded-t-xl border border-b-0 border-[#E8E8EC] bg-[#FAFAFA] px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#F87171]" />
        <span className="size-2.5 rounded-full bg-[#FBBF24]" />
        <span className="size-2.5 rounded-full bg-[#4ADE80]" />
        <span className="ml-3 flex-1 truncate rounded-md bg-white px-3 py-1 text-xs text-[#8C8C8C]">
          cvjury.com/blog/{slugify(title) || "untitled-post"}
        </span>
      </div>

      <article className="rounded-b-xl border border-[#E8E8EC] bg-white p-6 sm:p-10">
        {categoryName && (
          <span className="inline-flex rounded-full bg-[#E3F5E9] px-3 py-1 text-xs font-semibold tracking-wide text-[#16A34A] uppercase">
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

        {blocks.length > 0 ? (
          <div className="prose prose-sm mt-8 max-w-none">
            {blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-[#8C8C8C]">
            Nothing written yet — head back to the editor to add content.
          </p>
        )}
      </article>
    </div>
  )
}

export { PostPreviewContent }
