import { CalendarDays, Clock, Copy, Link2, Share2 } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type PostPreviewContentProps = {
  title: string
  excerpt: string
  content: string
  tags: string[]
  categoryName: string
  authorName: string
  authorTitle: string
  featuredImageUrl: string
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

function readingTimeFor(html: string) {
  const text = html.replace(/<[^>]+>/g, " ").trim()
  const words = text ? text.split(/\s+/).length : 0
  return words === 0 ? 0 : Math.max(1, Math.round(words / 200))
}

function PostPreviewContent({
  title,
  excerpt,
  content,
  tags,
  categoryName,
  authorName,
  authorTitle,
  featuredImageUrl,
}: PostPreviewContentProps) {
  const readingTime = readingTimeFor(content)
  const today = new Date().toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

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

        <div className="mt-5 flex flex-col gap-4 border-b border-[#E8E8EC] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar size="lg">
              <AvatarFallback className="bg-[#FDECE3] font-semibold text-[#E97451]">
                {initialsFor(authorName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-[#161616]">
                {authorName}
              </p>
              {authorTitle && (
                <p className="text-xs text-[#8C8C8C]">{authorTitle}</p>
              )}
            </div>
            <span className="hidden h-8 w-px bg-[#E8E8EC] sm:block" />
            <div className="hidden items-center gap-1.5 text-xs text-[#8C8C8C] sm:flex">
              <CalendarDays className="size-3.5" />
              {today}
            </div>
            <div className="hidden items-center gap-1.5 text-xs text-[#8C8C8C] sm:flex">
              <Clock className="size-3.5" />
              {readingTime} min read
            </div>
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

        {content ? (
          <div
            className="prose prose-sm mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
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
