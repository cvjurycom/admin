import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { BlockPalette } from "@/components/posts/BlockPalette"
import { PostEditorCanvas } from "@/components/posts/PostEditorCanvas"
import { PostEditorHeader } from "@/components/posts/PostEditorHeader"
import { PostInspector, type InspectorTab } from "@/components/posts/PostInspector"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api-client"
import {
  createBlog,
  getBlog,
  getReviewerId,
  updateBlog,
  type BlogCreateBody,
} from "@/lib/blogs"
import { listCategories, type Category } from "@/lib/categories"
import { listTags, type Tag } from "@/lib/tags"
import { listUsers, type AuthorUser } from "@/lib/users"
import { getStoredUser } from "@/lib/auth"
import { blocksFromLegacyContent, parseContentBlocks } from "@/lib/blocks/legacy"
import { createBlock } from "@/lib/blocks/defaults"
import { renderBlocksToHtml } from "@/lib/blocks/render-html"
import type { Block, BlockType } from "@/lib/blocks/types"
import {
  ATS_TEMPLATE_EXCERPT,
  ATS_TEMPLATE_TITLE,
  createAtsGuideTemplateBlocks,
} from "@/lib/blocks/atsTemplate"

type PublishStatus = "draft" | "schedule" | "publish"
type ViewMode = "edit" | "preview"

const statusToApi: Record<PublishStatus, BlogCreateBody["status"]> = {
  draft: "draft",
  schedule: "scheduled",
  publish: "published",
}

const apiToStatus: Record<string, PublishStatus> = {
  draft: "draft",
  scheduled: "schedule",
  published: "publish",
}

function PostEditorSkeleton() {
  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[220px_1fr_320px]">
      <Skeleton className="hidden h-96 rounded-xl xl:block" />
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[#E8E8EC] bg-white p-5">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="mt-4 h-20 w-full" />
        </div>
      </div>
      <Skeleton className="hidden h-96 rounded-xl xl:block" />
    </div>
  )
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function NewPostPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const blogId = (location.state as { blogId?: string } | null)?.blogId ?? null

  const [viewMode, setViewMode] = useState<ViewMode>("edit")
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("article")
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [isLoadingPost, setIsLoadingPost] = useState(Boolean(blogId))
  const [isSaving, setIsSaving] = useState(false)

  const [title, setTitle] = useState(() => (blogId ? "" : ATS_TEMPLATE_TITLE))
  const [excerpt, setExcerpt] = useState(() =>
    blogId ? "" : ATS_TEMPLATE_EXCERPT
  )
  const [blocks, setBlocks] = useState<Block[]>(() =>
    blogId ? [] : createAtsGuideTemplateBlocks()
  )

  const [seoTitle, setSeoTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [canonicalUrl, setCanonicalUrl] = useState("")

  const [status, setStatus] = useState<PublishStatus>("draft")
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")

  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [categoryId, setCategoryId] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(true)
  const [featuredImageUrl, setFeaturedImageUrl] = useState("")

  const [reviewers, setReviewers] = useState<AuthorUser[]>([])
  const [isLoadingReviewers, setIsLoadingReviewers] = useState(true)
  const [reviewerId, setReviewerId] = useState("")
  const [audienceNote, setAudienceNote] = useState("")
  const [publishedAt, setPublishedAt] = useState("")
  const [updatedAt, setUpdatedAt] = useState("")

  const user = getStoredUser()

  const authorName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Admin"
    : "Admin"
  const authorTitle = user?.title ?? ""

  const selectedReviewer = reviewers.find((item) => item._id === reviewerId)
  const reviewerName = selectedReviewer
    ? `${selectedReviewer.firstName ?? ""} ${selectedReviewer.lastName ?? ""}`.trim()
    : ""
  const reviewerTitle = selectedReviewer?.title ?? ""

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load categories."
        )
      })
      .finally(() => setIsLoadingCategories(false))
  }, [])

  useEffect(() => {
    listTags()
      .then(setAvailableTags)
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load tags."
        )
      })
      .finally(() => setIsLoadingTags(false))
  }, [])

  useEffect(() => {
    listUsers()
      .then((users) => setReviewers(users.filter((u) => u.__t === "reviewer")))
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load reviewers."
        )
      })
      .finally(() => setIsLoadingReviewers(false))
  }, [])

  useEffect(() => {
    if (!blogId) {
      return
    }

    let cancelled = false

    getBlog(blogId)
      .then((blog) => {
        if (cancelled) {
          return
        }
        setTitle(blog.title ?? "")
        setBlocks(
          parseContentBlocks(blog.contentBlocks) ??
            blocksFromLegacyContent(blog.content ?? "")
        )
        setExcerpt(blog.excerpt ?? "")
        setTags(blog.tags ?? [])
        setCategoryId(blog.categories?.[0]?._id ?? "")
        setStatus(apiToStatus[blog.status ?? "draft"] ?? "draft")
        setSeoTitle(blog.metaTitle ?? "")
        setMetaDescription(blog.metaDescription ?? "")
        setCanonicalUrl(blog.canonicalUrl ?? "")
        setFeaturedImageUrl(blog.featuredImage ?? "")
        setReviewerId(getReviewerId(blog))
        setAudienceNote(blog.audienceNote ?? "")
        setPublishedAt(blog.publishedAt ?? blog.createdAt ?? "")
        setUpdatedAt(blog.updatedAt ?? "")
        if (blog.scheduledAt) {
          const scheduled = new Date(blog.scheduledAt)
          setScheduleDate(scheduled.toISOString().slice(0, 10))
          setScheduleTime(scheduled.toISOString().slice(11, 16))
        }
      })
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load post."
        )
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingPost(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [blogId])

  const performSave = async (
    targetStatus: PublishStatus,
    scheduledAtIso?: string
  ) => {
    if (!title.trim() || blocks.length === 0) {
      toast.error("Title and content are required.")
      return
    }

    setIsSaving(true)
    try {
      const payload: BlogCreateBody = {
        title: title.trim(),
        content: renderBlocksToHtml(blocks),
        contentBlocks: blocks,
        author: authorName,
        slug: slugify(title),
        status: statusToApi[targetStatus],
        visibility: "public",
        tags,
        categories: categoryId ? [categoryId] : [],
        excerpt,
        featuredImage: featuredImageUrl,
        audienceNote,
        metaTitle: seoTitle,
        metaDescription,
        canonicalUrl,
        ...(targetStatus === "schedule" && scheduledAtIso
          ? { scheduledAt: scheduledAtIso }
          : {}),
      }

      if (blogId) {
        await updateBlog(blogId, payload)
      } else {
        await createBlog(payload)
      }

      toast.success(
        targetStatus === "draft"
          ? "Draft saved"
          : targetStatus === "schedule"
            ? "Post scheduled"
            : "Post published"
      )
      navigate("/posts")
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Unable to save post."
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleConfirmSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      toast.error("Pick a date and time to schedule this post.")
      return
    }
    performSave("schedule", `${scheduleDate}T${scheduleTime}:00`)
  }

  const handleAddBlock = (type: BlockType) => {
    const newBlock = createBlock(type)
    setBlocks((prev) => [...prev, newBlock])
    setSelectedBlockId(newBlock.id)
    setInspectorTab("element")
  }

  const handleSelectBlock = (id: string | null) => {
    setSelectedBlockId(id)
    if (id) {
      setInspectorTab("element")
    }
  }

  const handleSelectedBlockChange = (next: Block) => {
    setBlocks((prev) => prev.map((block) => (block.id === next.id ? next : block)))
  }

  const handleRemoveSelectedBlock = () => {
    if (!selectedBlockId) {
      return
    }
    setBlocks((prev) => prev.filter((block) => block.id !== selectedBlockId))
    setSelectedBlockId(null)
  }

  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) ?? null

  const previewCategoryName =
    categories.find((item) => item._id === categoryId)?.name ?? ""

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div
          className={
            viewMode === "preview"
              ? "sticky top-0 z-20 bg-white pt-1"
              : undefined
          }
        >
          <PostEditorHeader
            isEditing={Boolean(blogId)}
            isSaving={isSaving}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onSaveDraft={() => performSave("draft")}
            onPublish={() => performSave("publish")}
          />
        </div>

        {isLoadingPost ? (
          <PostEditorSkeleton />
        ) : viewMode === "preview" ? (
          <PostEditorCanvas
            isPreview
            title={title}
            excerpt={excerpt}
            blocks={blocks}
            onBlocksChange={setBlocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleSelectBlock}
            tags={tags}
            categoryName={previewCategoryName}
            authorName={authorName}
            authorTitle={authorTitle}
            featuredImageUrl={featuredImageUrl}
            reviewerName={reviewerName}
            reviewerTitle={reviewerTitle}
            audienceNote={audienceNote}
            publishedAt={publishedAt}
            updatedAt={updatedAt}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:h-[calc(100vh-7rem)] xl:grid-cols-[220px_1fr_320px]">
            <aside className="overflow-hidden xl:h-full">
              <BlockPalette onAdd={handleAddBlock} />
            </aside>

            <div className="xl:h-full xl:overflow-y-auto">
              <PostEditorCanvas
                isPreview={false}
                title={title}
                excerpt={excerpt}
                blocks={blocks}
                onBlocksChange={setBlocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={handleSelectBlock}
                tags={tags}
                categoryName={previewCategoryName}
                authorName={authorName}
                authorTitle={authorTitle}
                featuredImageUrl={featuredImageUrl}
                reviewerName={reviewerName}
                reviewerTitle={reviewerTitle}
                audienceNote={audienceNote}
                publishedAt={publishedAt}
                updatedAt={updatedAt}
              />
            </div>

            <aside className="overflow-hidden xl:h-full">
              <PostInspector
                activeTab={inspectorTab}
                onActiveTabChange={setInspectorTab}
                selectedBlock={selectedBlock}
                onSelectedBlockChange={handleSelectedBlockChange}
                onRemoveSelectedBlock={handleRemoveSelectedBlock}
                blockCount={blocks.length}
                publishingProps={{
                  title,
                  onTitleChange: setTitle,
                  excerpt,
                  onExcerptChange: setExcerpt,
                  status,
                  onStatusChange: setStatus,
                  scheduleDate,
                  onScheduleDateChange: setScheduleDate,
                  scheduleTime,
                  onScheduleTimeChange: setScheduleTime,
                  onConfirmSchedule: handleConfirmSchedule,
                  onPublishNow: () => performSave("publish"),
                  categories,
                  isLoadingCategories,
                  categoryId,
                  onCategoryChange: setCategoryId,
                  tags,
                  availableTags,
                  isLoadingTags,
                  onAddTag: (tag) =>
                    setTags((current) =>
                      current.includes(tag) ? current : [...current, tag]
                    ),
                  onRemoveTag: (tag) =>
                    setTags((current) => current.filter((item) => item !== tag)),
                  featuredImageUrl,
                  onFeaturedImageChange: setFeaturedImageUrl,
                  reviewers,
                  isLoadingReviewers,
                  reviewerId,
                  onReviewerIdChange: (value) =>
                    setReviewerId(value === "none" ? "" : value),
                  audienceNote,
                  onAudienceNoteChange: setAudienceNote,
                }}
              />
            </aside>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default NewPostPage
