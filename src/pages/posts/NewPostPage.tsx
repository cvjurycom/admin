import { ArrowLeft, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { PostContentEditor } from "@/components/posts/PostContentEditor"
import { PostEditorHeader } from "@/components/posts/PostEditorHeader"
import { PostPreviewContent } from "@/components/posts/PostPreviewContent"
import { PostSeoEditor } from "@/components/posts/PostSeoEditor"
import { PublishingSidebar } from "@/components/posts/PublishingSidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApiError } from "@/lib/api-client"
import {
  createBlog,
  getBlog,
  updateBlog,
  type BlogCreateBody,
} from "@/lib/blogs"
import { listCategories, type Category } from "@/lib/categories"
import { listTags, type Tag } from "@/lib/tags"
import { listUsers, type AuthorUser } from "@/lib/users"
import { getStoredUser } from "@/lib/auth"
import { blocksFromLegacyContent, parseContentBlocks } from "@/lib/blocks/legacy"
import { renderBlocksToHtml } from "@/lib/blocks/render-html"
import type { Block } from "@/lib/blocks/types"

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
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-10 w-40 rounded-lg" />

        <div className="flex flex-col gap-4 rounded-2xl bg-[#FAFAFA] p-3 sm:p-4">
          <div className="rounded-xl border border-[#E8E8EC] bg-white p-5">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="mt-4 h-20 w-full" />
          </div>
          <div className="rounded-xl border border-[#E8E8EC] bg-white p-5">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="mt-4 h-64 w-full" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <Skeleton className="h-44 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
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
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content")
  const [isLoadingPost, setIsLoadingPost] = useState(Boolean(blogId))
  const [isSaving, setIsSaving] = useState(false)

  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [blocks, setBlocks] = useState<Block[]>([])

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
        setReviewerId(blog.reviewerId ?? "")
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
      const user = getStoredUser()
      const authorName = user
        ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
        : ""

      const payload: BlogCreateBody = {
        title: title.trim(),
        content: renderBlocksToHtml(blocks),
        contentBlocks: blocks,
        author: authorName || "Admin",
        slug: slugify(title),
        status: statusToApi[targetStatus],
        visibility: "public",
        tags,
        categories: categoryId ? [categoryId] : [],
        excerpt,
        featuredImage: featuredImageUrl,
        reviewerId,
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

  const user = getStoredUser()
  const previewAuthorName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Admin"
    : "Admin"
  const previewCategoryName =
    categories.find((item) => item._id === categoryId)?.name ?? ""

  if (viewMode === "preview") {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 border-b border-[#E8E8EC] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className="flex items-center gap-1.5 text-sm font-medium text-[#4A4A4A] hover:text-[#161616]"
            >
              <ArrowLeft className="size-4" />
              Back to Editor
            </button>
            <button
              type="button"
              onClick={() => performSave("publish")}
              disabled={isSaving}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-[#E97451] px-3 text-sm font-semibold text-white hover:bg-[#E0552A] disabled:opacity-50"
            >
              <Zap className="size-4" />
              {isSaving ? "Saving…" : "Publish"}
            </button>
          </div>

          <div className="mx-auto w-full max-w-3xl">
            <PostPreviewContent
              title={title}
              excerpt={excerpt}
              blocks={blocks}
              tags={tags}
              categoryName={previewCategoryName}
              authorName={previewAuthorName}
              authorTitle={user?.title ?? ""}
              featuredImageUrl={featuredImageUrl}
              reviewerName={reviewerName}
              reviewerTitle={reviewerTitle}
              audienceNote={audienceNote}
              publishedAt={publishedAt}
              updatedAt={updatedAt}
            />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <PostEditorHeader
          isEditing={Boolean(blogId)}
          isSaving={isSaving}
          onPreview={() => setViewMode("preview")}
          onSaveDraft={() => performSave("draft")}
          onPublish={() => performSave("publish")}
        />

        {isLoadingPost ? (
          <PostEditorSkeleton />
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_320px]">
            <div className="flex flex-col gap-4">
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "content" | "seo")
                }
              >
                <TabsList className="h-11! w-fit rounded-[16px] border border-[#E8E8EC] bg-white p-1">
                  <TabsTrigger
                    value="content"
                    className="rounded-[12px] px-4 text-[#6B6B6B] data-active:bg-[#E97451] data-active:text-white data-active:shadow-none"
                  >
                    Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="seo"
                    className="rounded-[12px] px-4 text-[#6B6B6B] data-active:bg-[#E97451] data-active:text-white data-active:shadow-none"
                  >
                    SEO
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {activeTab === "content" ? (
                <PostContentEditor
                  title={title}
                  onTitleChange={setTitle}
                  excerpt={excerpt}
                  onExcerptChange={setExcerpt}
                  blocks={blocks}
                  onBlocksChange={setBlocks}
                />
              ) : (
                <PostSeoEditor
                  seoTitle={seoTitle}
                  onSeoTitleChange={setSeoTitle}
                  metaDescription={metaDescription}
                  onMetaDescriptionChange={setMetaDescription}
                  canonicalUrl={canonicalUrl}
                  onCanonicalUrlChange={setCanonicalUrl}
                />
              )}
            </div>

            <PublishingSidebar
              status={status}
              onStatusChange={setStatus}
              scheduleDate={scheduleDate}
              onScheduleDateChange={setScheduleDate}
              scheduleTime={scheduleTime}
              onScheduleTimeChange={setScheduleTime}
              onConfirmSchedule={handleConfirmSchedule}
              onPublishNow={() => performSave("publish")}
              categories={categories}
              isLoadingCategories={isLoadingCategories}
              categoryId={categoryId}
              onCategoryChange={setCategoryId}
              tags={tags}
              availableTags={availableTags}
              isLoadingTags={isLoadingTags}
              onAddTag={(tag) =>
                setTags((current) =>
                  current.includes(tag) ? current : [...current, tag]
                )
              }
              onRemoveTag={(tag) =>
                setTags((current) => current.filter((item) => item !== tag))
              }
              featuredImageUrl={featuredImageUrl}
              onFeaturedImageChange={setFeaturedImageUrl}
              reviewers={reviewers}
              isLoadingReviewers={isLoadingReviewers}
              reviewerId={reviewerId}
              onReviewerIdChange={(value) =>
                setReviewerId(value === "none" ? "" : value)
              }
              audienceNote={audienceNote}
              onAudienceNoteChange={setAudienceNote}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default NewPostPage
