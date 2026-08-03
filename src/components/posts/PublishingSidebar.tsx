import { Globe, ImagePlus, LibraryBig, X, Zap } from "lucide-react"
import { useRef, useState, type ChangeEvent } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { InlineRichTextInput } from "@/components/builder/inputs"
import { MediaLibraryDialog } from "@/components/media/MediaLibraryDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { uploadAndRegisterImage } from "@/lib/image-upload"
import type { Category } from "@/lib/categories"
import type { Tag } from "@/lib/tags"
import type { AuthorUser } from "@/lib/users"

function fullNameOf(user: AuthorUser) {
  return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "—"
}

const NO_REVIEWER = "none"

type PublishStatus = "draft" | "schedule" | "publish"

type PublishingSidebarProps = {
  title: string
  onTitleChange: (value: string) => void
  excerpt: string
  onExcerptChange: (value: string) => void
  status: PublishStatus
  onStatusChange: (status: PublishStatus) => void
  scheduleDate: string
  onScheduleDateChange: (value: string) => void
  scheduleTime: string
  onScheduleTimeChange: (value: string) => void
  onConfirmSchedule: () => void
  onPublishNow: () => void
  categories: Category[]
  isLoadingCategories: boolean
  categoryId: string
  onCategoryChange: (value: string) => void
  tags: string[]
  availableTags: Tag[]
  isLoadingTags: boolean
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  featuredImageUrl: string
  onFeaturedImageChange: (url: string) => void
  reviewers: AuthorUser[]
  isLoadingReviewers: boolean
  reviewerId: string
  onReviewerIdChange: (value: string) => void
  audienceNote: string
  onAudienceNoteChange: (value: string) => void
}

const DEFAULT_TAG_COLOR = "#E97451"

function PublishingSidebar({
  title,
  onTitleChange,
  excerpt,
  onExcerptChange,
  status,
  onStatusChange,
  scheduleDate,
  onScheduleDateChange,
  scheduleTime,
  onScheduleTimeChange,
  onConfirmSchedule,
  onPublishNow,
  categories,
  isLoadingCategories,
  categoryId,
  onCategoryChange,
  tags,
  availableTags,
  isLoadingTags,
  onAddTag,
  onRemoveTag,
  featuredImageUrl,
  onFeaturedImageChange,
  reviewers,
  isLoadingReviewers,
  reviewerId,
  onReviewerIdChange,
  audienceNote,
  onAudienceNoteChange,
}: PublishingSidebarProps) {
  const [isUploadingFeaturedImage, setIsUploadingFeaturedImage] =
    useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)
  const featuredImageInputRef = useRef<HTMLInputElement>(null)

  const selectableTags = availableTags.filter(
    (item) => item.name && !tags.includes(item.name)
  )

  const handleFeaturedImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) {
      return
    }

    setIsUploadingFeaturedImage(true)
    try {
      const url = await uploadAndRegisterImage(file, "Post featured image")
      onFeaturedImageChange(url)
      toast.success("Featured image uploaded")
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to upload image."
      )
    } finally {
      setIsUploadingFeaturedImage(false)
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label className="mb-2 text-sm font-medium text-[#161616]">
          Article Title
        </Label>
        <Textarea
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Post title..."
          className="min-h-16 resize-none rounded-[10px] border border-[#E8E8EC] bg-white"
        />
      </div>

      <div>
        <Label className="mb-2 text-sm font-medium text-[#161616]">
          Subtitle
        </Label>
        <InlineRichTextInput
          value={excerpt}
          onChange={onExcerptChange}
          placeholder="Write a short excerpt that summarizes this post..."
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#9A9A9A] uppercase">
          Publishing
        </p>
        <RadioGroup
          value={status}
          onValueChange={(value) => onStatusChange(value as PublishStatus)}
          className="gap-2"
        >
          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border border-[#E8E8EC] p-3",
              status === "draft" && "border-[#FBE0CE] bg-[#FDF3EC]"
            )}
          >
            <RadioGroupItem
              value="draft"
              className="mt-0.5 data-checked:border-[#E97451]! data-checked:bg-[#E97451]!"
            />
            <div>
              <p className="text-sm font-semibold text-[#161616]">Draft</p>
              <p className="text-xs text-[#8C8C8C]">Saved, not visible</p>
            </div>
          </label>

          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border border-[#E8E8EC] p-3",
              status === "schedule" && "border-[#BFDBFE] bg-[#EAF2FE]"
            )}
          >
            <RadioGroupItem
              value="schedule"
              className="mt-0.5 data-checked:border-[#F26D4F]! data-checked:bg-[#F26D4F]!"
            />
            <div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  status === "schedule" ? "text-[#F26D4F]" : "text-[#161616]"
                )}
              >
                Schedule
              </p>
              <p className="text-xs text-[#8C8C8C]">Pick a date below</p>
            </div>
          </label>

          {status === "schedule" && (
            <div className="rounded-2xl border border-[#FBE0CE] bg-[#FDF3EC] p-3">
              <p className="mb-2 text-xs font-semibold tracking-wide text-[#E97451] uppercase">
                Publish On
              </p>
              <div className="flex flex-col gap-2">
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(event) => onScheduleDateChange(event.target.value)}
                  className="h-10 rounded-full border border-[#E8E8EC] bg-white px-4"
                />
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={(event) => onScheduleTimeChange(event.target.value)}
                  className="h-10 rounded-full border border-[#E8E8EC] bg-white px-4"
                />
              </div>
              <button
                type="button"
                onClick={onConfirmSchedule}
                className="mt-3 h-10 w-full rounded-full bg-[#E97451] text-sm font-semibold text-white hover:bg-[#E0552A]"
              >
                Confirm Schedule
              </button>
            </div>
          )}

          <label
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border border-[#E8E8EC] p-3",
              status === "publish" && "border-[#E97451] bg-[#E97451]"
            )}
          >
            <RadioGroupItem
              value="publish"
              className={cn(
                "mt-0.5",
                status === "publish"
                  ? "border-white! bg-white!"
                  : "data-checked:border-[#E97451]! data-checked:bg-[#E97451]!"
              )}
            />
            <div>
              <p
                className={cn(
                  "text-sm font-semibold",
                  status === "publish" ? "text-white" : "text-[#161616]"
                )}
              >
                Publish
              </p>
              <p
                className={cn(
                  "text-xs",
                  status === "publish" ? "text-white/80" : "text-[#8C8C8C]"
                )}
              >
                Goes live immediately
              </p>
            </div>
          </label>

          {status === "publish" && (
            <div className="rounded-lg border border-[#FBE0CE] bg-[#FDF3EC] p-3">
              <p className="text-xs font-semibold tracking-wide text-[#161616] uppercase">
                Ready to publish?
              </p>
              <p className="mt-1 text-sm text-[#6B6B6B]">
                This post will be immediately visible to all visitors.
              </p>
              <button
                type="button"
                onClick={onPublishNow}
                className="mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-[#E97451] text-sm font-semibold text-white hover:bg-[#E0552A]"
              >
                <Zap className="size-4" />
                Publish Now
              </button>
            </div>
          )}
        </RadioGroup>
      </div>

      <div className="rounded-lg bg-[#F7F8FA] p-3">
        <p className="text-xs text-[#8C8C8C]">Visibility</p>
        <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-[#161616]">
          <Globe className="size-4 text-[#6B6B6B]" />
          Public
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#9A9A9A] uppercase">
          Featured Image
        </p>
        <input
          ref={featuredImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFeaturedImageChange}
        />
        <button
          type="button"
          onClick={() => featuredImageInputRef.current?.click()}
          disabled={isUploadingFeaturedImage}
          className={cn(
            "relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#D8D8DC] bg-white hover:bg-[#FAFAFA] disabled:opacity-50",
            featuredImageUrl
              ? "h-40"
              : "flex-col gap-2 py-8 text-sm text-[#8C8C8C]"
          )}
        >
          {featuredImageUrl ? (
            <>
              <img
                src={featuredImageUrl}
                alt="Featured preview"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-black/50 py-1.5 text-xs font-medium text-white">
                {isUploadingFeaturedImage ? "Uploading…" : "Replace image"}
              </span>
            </>
          ) : (
            <>
              <ImagePlus className="size-5" />
              {isUploadingFeaturedImage
                ? "Uploading…"
                : "Click to upload or drag & drop"}
            </>
          )}
        </button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2 w-full"
          onClick={() => setIsLibraryOpen(true)}
        >
          <LibraryBig className="size-3.5" />
          Choose from library
        </Button>
        <MediaLibraryDialog
          open={isLibraryOpen}
          onOpenChange={setIsLibraryOpen}
          onSelect={(media) => onFeaturedImageChange(media.imageUrl ?? "")}
        />
      </div>

      <div>
        <Label className="mb-2 text-sm font-medium text-[#161616]">
          Category
        </Label>
        {isLoadingCategories ? (
          <Skeleton className="h-10! w-full rounded-[10px]" />
        ) : (
          <Select value={categoryId} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-10! w-full rounded-[10px] border border-[#E8E8EC] bg-white">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((item) => (
                <SelectItem key={item._id} value={item._id ?? ""}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div>
        <Label className="mb-2 text-sm font-medium text-[#161616]">Tags</Label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const tagColor =
              availableTags.find((item) => item.name === tag)?.color ??
              DEFAULT_TAG_COLOR
            return (
              <span
                key={tag}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: `${tagColor}1A`, color: tagColor }}
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={() => onRemoveTag(tag)}
                  className="hover:opacity-70"
                >
                  <X className="size-3" />
                </button>
              </span>
            )
          })}
        </div>

        {isLoadingTags ? (
          <Skeleton className="mt-2 h-10! w-full rounded-[10px]" />
        ) : (
          <Select
            value=""
            onValueChange={onAddTag}
            disabled={availableTags.length === 0}
          >
            <SelectTrigger className="mt-2 h-10! w-full rounded-[10px] border border-[#E8E8EC] bg-white">
              <SelectValue
                placeholder={
                  availableTags.length === 0
                    ? "No tags created yet"
                    : selectableTags.length === 0
                      ? "All tags added"
                      : "Add tag..."
                }
              />
            </SelectTrigger>
            <SelectContent>
              {selectableTags.map((item) => (
                <SelectItem key={item._id ?? item.name} value={item.name ?? ""}>
                  <span className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-[10px]"
                      style={{
                        backgroundColor: item.color ?? DEFAULT_TAG_COLOR,
                      }}
                    />
                    {item.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div>
        <Label className="mb-2 text-sm font-medium text-[#161616]">
          Reviewer Name
        </Label>
        {isLoadingReviewers ? (
          <Skeleton className="h-10! w-full rounded-[10px]" />
        ) : (
          <Select
            value={reviewerId || NO_REVIEWER}
            onValueChange={onReviewerIdChange}
          >
            <SelectTrigger className="h-10! w-full rounded-[10px] border border-[#E8E8EC] bg-white">
              <SelectValue placeholder="No reviewer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_REVIEWER}>No reviewer</SelectItem>
              {reviewers.map((reviewer) => (
                <SelectItem key={reviewer._id} value={reviewer._id ?? ""}>
                  {fullNameOf(reviewer)}
                  {reviewer.title ? ` — ${reviewer.title}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {!isLoadingReviewers && reviewers.length === 0 && (
          <p className="mt-1.5 text-xs text-[#8C8C8C]">
            No reviewer accounts yet — add one on the Authors page with type
            "Reviewer".
          </p>
        )}
      </div>

      <div>
        <Label className="mb-2 text-sm font-medium text-[#161616]">
          Audience
        </Label>
        <Input
          value={audienceNote}
          onChange={(event) => onAudienceNoteChange(event.target.value)}
          placeholder="Primarily for a US resume audience"
          className="h-10 rounded-[10px] border border-[#E8E8EC] bg-white"
        />
      </div>
    </div>
  )
}

export { PublishingSidebar }
