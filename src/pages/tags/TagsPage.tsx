import { Check, Hash, Plus, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api-client"
import { createTag, listTags, type Tag } from "@/lib/tags"

const colorSwatches = [
  "#E97451",
  "#2563EB",
  "#16A34A",
  "#7C3AED",
  "#D97706",
  "#0EA5E9",
  "#92400E",
  "#DB2777",
  "#0D9488",
  "#4F46E5",
  "#F87171",
  "#059669",
  "#DC2626",
  "#6B7280",
]

const DEFAULT_TAG_COLOR = "#6B7280"

function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [tagName, setTagName] = useState("")
  const [selectedColor, setSelectedColor] = useState(colorSwatches[0])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    listTags()
      .then((data) => {
        if (!cancelled) {
          setTags(data)
        }
      })
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load tags."
        )
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredTags = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return tags
    }
    return tags.filter((tag) => (tag.name ?? "").toLowerCase().includes(query))
  }, [tags, search])

  const mostUsed = useMemo(
    () =>
      [...tags]
        .sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0))
        .slice(0, 8),
    [tags]
  )
  const maxCount = mostUsed[0]?.usageCount ?? 1

  const resetForm = () => {
    setTagName("")
    setSelectedColor(colorSwatches[0])
  }

  const handleAddTag = async () => {
    const name = tagName.trim().toLowerCase().replace(/\s+/g, "-")
    if (!name || tags.some((tag) => tag.name === name)) {
      return
    }

    setIsSubmitting(true)
    try {
      const created = await createTag({ name, color: selectedColor })
      setTags((current) => [...current, created])
      resetForm()
      setDialogOpen(false)
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Unable to create tag."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#161616] sm:text-[28px]">
              Tags
            </h1>
            {isLoading ? (
              <Skeleton className="mt-1.5 h-4 w-40" />
            ) : (
              <p className="mt-1 text-sm text-[#6B6B6B]">
                {tags.length} tags across all posts
              </p>
            )}
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open)
              if (!open) {
                resetForm()
              }
            }}
          >
            <Button
              size="lg"
              onClick={() => setDialogOpen(true)}
              className="h-11 w-fit shrink-0 rounded-full bg-[#E97451] px-5 text-sm font-semibold text-white hover:bg-[#E0552A]"
            >
              <Plus />
              Add Tag
            </Button>
            <DialogContent className="sm:max-w-md" showCloseButton>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#161616]">
                  Add New Tag
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-2">
                <Label htmlFor="tag-name" className="text-sm font-medium text-[#161616]">
                  Tag Name
                </Label>
                <Input
                  id="tag-name"
                  value={tagName}
                  onChange={(event) => setTagName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleAddTag()
                    }
                  }}
                  placeholder="e.g. remote-work"
                  className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-[#161616]">
                  Tag Color
                </Label>
                <div className="grid grid-cols-7 gap-2">
                  {colorSwatches.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Use color ${color}`}
                      onClick={() => setSelectedColor(color)}
                      className="flex size-9 items-center justify-center rounded-xl"
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor.toLowerCase() === color.toLowerCase() && (
                        <Check className="size-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <span
                    className="size-9 shrink-0 rounded-xl"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <Input
                    value={selectedColor}
                    onChange={(event) => {
                      const hex = event.target.value
                        .replace(/[^0-9a-fA-F]/g, "")
                        .slice(0, 6)
                      setSelectedColor(`#${hex}`)
                    }}
                    maxLength={7}
                    placeholder="#000000"
                    className="h-9 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA] font-mono text-sm"
                  />
                  <span className="shrink-0 text-sm text-[#8C8C8C]">
                    Custom
                  </span>
                </div>
              </div>

              <DialogFooter className="-mx-0 -mb-0 rounded-none border-t-0 bg-transparent p-0 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="h-10 rounded-full border border-[#E8E8EC] px-5 text-sm font-semibold text-[#4A4A4A] hover:bg-[#F7F8FA]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={isSubmitting}
                  className="h-10 rounded-full bg-[#E97451] px-5 text-sm font-semibold text-white hover:bg-[#E0552A] disabled:opacity-50"
                >
                  {isSubmitting ? "Adding…" : "Add Tag"}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="rounded-[16px] border border-[#E8E8EC] bg-white p-5 lg:col-span-2">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8C8C8C]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tags..."
                className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA] pl-9"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {isLoading &&
                Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-9 w-24 rounded-full" />
                ))}

              {!isLoading &&
                filteredTags.map((tag) => (
                  <span
                    key={tag._id ?? tag.name}
                    className="flex items-center gap-2 rounded-full border border-[#E8E8EC] py-2 pr-3 pl-3 text-sm hover:bg-[#FAFAFA]"
                  >
                    <Hash
                      className="size-3.5"
                      style={{ color: tag.color ?? DEFAULT_TAG_COLOR }}
                    />
                    <span className="font-medium text-[#161616]">
                      {tag.name}
                    </span>
                  </span>
                ))}

              {!isLoading && filteredTags.length === 0 && (
                <p className="py-6 text-sm text-[#8C8C8C]">
                  No tags match your search.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[16px] border border-[#E8E8EC] bg-white p-5">
            <h2 className="text-base font-bold text-[#161616]">Most Used</h2>
            <ol className="mt-4 flex flex-col gap-4">
              {isLoading &&
                Array.from({ length: 5 }).map((_, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-0.5 w-4 shrink-0 text-sm text-[#B0B0B0]">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="mt-1.5 h-1.5 w-full rounded-full" />
                    </div>
                  </li>
                ))}

              {!isLoading &&
                mostUsed.map((tag, index) => (
                  <li key={tag._id ?? tag.name} className="flex items-start gap-3">
                    <span className="mt-0.5 w-4 shrink-0 text-sm text-[#B0B0B0]">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[#161616]">
                          #{tag.name}
                        </span>
                        <span className="text-[#8C8C8C]">
                          {tag.usageCount ?? 0}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F1F3]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${((tag.usageCount ?? 0) / maxCount) * 100}%`,
                            backgroundColor: tag.color ?? DEFAULT_TAG_COLOR,
                          }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TagsPage
