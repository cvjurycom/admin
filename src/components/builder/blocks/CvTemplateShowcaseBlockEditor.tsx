import { ImagePlus } from "lucide-react"
import { useRef, useState, type ChangeEvent } from "react"
import { toast } from "sonner"

import { RepeatingRows } from "@/components/builder/inputs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadAndRegisterImage } from "@/lib/image-upload"
import type { CvTemplateShowcaseBlock } from "@/lib/blocks/types"

type TemplateImage = CvTemplateShowcaseBlock["images"][number]

function TemplateImageUpload({
  image,
  onChange,
}: {
  image: TemplateImage
  onChange: (next: TemplateImage) => void
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
        image.alt || "CV template screenshot"
      )
      onChange({ ...image, src: url })
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to upload screenshot."
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {image.src ? (
        <div className="relative">
          <img
            src={image.src}
            alt={image.alt}
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
            {isUploading ? "Uploading…" : "Replace"}
          </Button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-4/5 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#E8E8EC] text-sm text-[#8C8C8C] hover:bg-[#FAFAFA] disabled:opacity-50"
        >
          <ImagePlus className="size-6" />
          {isUploading ? "Uploading…" : "Upload template screenshot"}
        </button>
      )}
      <Input
        value={image.alt}
        placeholder="Alt text"
        onChange={(event) => onChange({ ...image, alt: event.target.value })}
      />
    </div>
  )
}

function CvTemplateShowcaseBlockEditor({
  block,
  onChange,
}: {
  block: CvTemplateShowcaseBlock
  onChange: (block: CvTemplateShowcaseBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.label}
        placeholder="Label (e.g. CVJury Template (2 in 1))"
        onChange={(event) => onChange({ ...block, label: event.target.value })}
      />
      <Input
        value={block.name}
        placeholder="Person name shown on the right"
        onChange={(event) => onChange({ ...block, name: event.target.value })}
      />
      <RepeatingRows
        items={block.images}
        onChange={(images) => onChange({ ...block, images })}
        createItem={() => ({ src: "", alt: "" })}
        addLabel="Add template screenshot"
        renderRow={(image, update) => (
          <TemplateImageUpload image={image} onChange={update} />
        )}
      />
    </div>
  )
}

export { CvTemplateShowcaseBlockEditor }
