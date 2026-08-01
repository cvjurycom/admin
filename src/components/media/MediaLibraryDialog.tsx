import { ImageOff, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ApiError } from "@/lib/api-client"
import { cloudinaryThumbnail } from "@/lib/cloudinary"
import { listMedia, type Media } from "@/lib/media"

function MediaLibraryDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (media: Media) => void
}) {
  const [mediaItems, setMediaItems] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!open) {
      return
    }
    setIsLoading(true)
    listMedia()
      .then(setMediaItems)
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load media."
        )
      })
      .finally(() => setIsLoading(false))
  }, [open])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return mediaItems
    }
    return mediaItems.filter((item) =>
      (item.filename ?? "").toLowerCase().includes(query)
    )
  }, [mediaItems, search])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose from Media Library</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#B0B0B0]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search media…"
            className="h-10 rounded-lg border border-[#E8E8EC] bg-[#F7F8FA] pl-9"
          />
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square animate-pulse rounded-lg bg-[#F1F1F3]"
                />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-sm text-[#8C8C8C]">
              <ImageOff className="size-6" />
              No media found.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {filteredItems.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => {
                    onSelect(item)
                    onOpenChange(false)
                  }}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-[#E8E8EC] hover:ring-2 hover:ring-[#E97451]"
                >
                  {item.imageUrl && (
                    <img
                      src={cloudinaryThumbnail(item.imageUrl, 200)}
                      alt={item.altText || item.filename || ""}
                      className="size-full object-cover"
                    />
                  )}
                  <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1.5 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100">
                    {item.filename}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { MediaLibraryDialog }
