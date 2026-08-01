import { ImagePlus, LibraryBig } from "lucide-react"
import { useRef, useState, type ChangeEvent } from "react"
import { toast } from "sonner"

import { MediaLibraryDialog } from "@/components/media/MediaLibraryDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadAndRegisterImage } from "@/lib/image-upload"
import type { ImageBlock } from "@/lib/blocks/types"

function ImageBlockEditor({
  block,
  onChange,
}: {
  block: ImageBlock
  onChange: (block: ImageBlock) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) {
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadAndRegisterImage(file, block.alt || "Post image")
      onChange({ ...block, src: url })
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to upload image."
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {block.src ? (
        <div className="relative">
          <img
            src={block.src}
            alt={block.alt}
            className="aspect-video w-full rounded-lg object-cover"
          />
          <div className="absolute right-2 bottom-2 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isUploading}
              onClick={() => setIsLibraryOpen(true)}
            >
              <LibraryBig className="size-3.5" />
              Library
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? "Uploading…" : "Replace image"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#E8E8EC] text-sm text-[#8C8C8C] hover:bg-[#FAFAFA] disabled:opacity-50"
          >
            <ImagePlus className="size-6" />
            {isUploading ? "Uploading…" : "Upload an image"}
          </button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => setIsLibraryOpen(true)}
          >
            <LibraryBig className="size-3.5" />
            Choose from library
          </Button>
        </div>
      )}
      <MediaLibraryDialog
        open={isLibraryOpen}
        onOpenChange={setIsLibraryOpen}
        onSelect={(media) =>
          onChange({
            ...block,
            src: media.imageUrl ?? "",
            alt: block.alt || media.altText || "",
          })
        }
      />
      <Input
        value={block.alt}
        placeholder="Alt text"
        onChange={(event) => onChange({ ...block, alt: event.target.value })}
      />
      <Input
        value={block.caption}
        placeholder="Caption (optional)"
        onChange={(event) =>
          onChange({ ...block, caption: event.target.value })
        }
      />
    </div>
  )
}

export { ImageBlockEditor }
