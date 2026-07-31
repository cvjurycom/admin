import { ImagePlus } from "lucide-react"
import { useRef, useState, type ChangeEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadAndRegisterImage } from "@/lib/image-upload"
import type { AtsScoreCardBlock } from "@/lib/blocks/types"

function AtsScoreCardBlockEditor({
  block,
  onChange,
}: {
  block: AtsScoreCardBlock
  onChange: (block: AtsScoreCardBlock) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) {
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadAndRegisterImage(
        file,
        block.imageAlt || "Screenshot"
      )
      onChange({ ...block, imageSrc: url })
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to upload screenshot."
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
      {block.imageSrc ? (
        <div className="relative">
          <img
            src={block.imageSrc}
            alt={block.imageAlt}
            className="w-full rounded-lg border border-[#E8E8EC] object-cover"
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="absolute right-2 bottom-2"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? "Uploading…" : "Replace screenshot"}
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#E8E8EC] text-sm text-[#8C8C8C] hover:bg-[#FAFAFA] disabled:opacity-50"
        >
          <ImagePlus className="size-6" />
          {isUploading ? "Uploading…" : "Upload a screenshot"}
        </button>
      )}
      <Input
        value={block.url}
        placeholder="URL shown in browser bar (e.g. cvjury.com/resume-scanner/result)"
        onChange={(event) => onChange({ ...block, url: event.target.value })}
      />
      <Input
        value={block.badge}
        placeholder="Corner badge text (e.g. ILLUSTRATIVE EXAMPLE)"
        onChange={(event) => onChange({ ...block, badge: event.target.value })}
      />
      <Input
        value={block.imageAlt}
        placeholder="Alt text for the screenshot"
        onChange={(event) =>
          onChange({ ...block, imageAlt: event.target.value })
        }
      />
    </div>
  )
}

export { AtsScoreCardBlockEditor }
