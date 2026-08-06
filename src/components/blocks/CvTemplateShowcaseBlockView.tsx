import { ImageIcon } from "lucide-react"

import { cloudinaryAuto } from "@/lib/cloudinary"
import type { CvTemplateShowcaseBlock } from "@/lib/blocks/types"

function CvTemplateShowcaseBlockView({
  block,
}: {
  block: CvTemplateShowcaseBlock
}) {
  const images = block.images.filter((image) => image.src)
  if (!block.label && !block.name && images.length === 0) {
    return null
  }

  return (
    <div className="not-prose my-6">
      {(block.label || block.name) && (
        <div className="mb-3 flex items-center justify-between gap-4">
          {block.label && (
            <p className="text-xs font-bold tracking-widest text-[#161616] uppercase">
              {block.label}
            </p>
          )}
          {block.name && (
            <p className="text-xs font-semibold tracking-widest text-[#8C8C8C] uppercase">
              {block.name}
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-dashed border-[#E0E0E4] bg-[#FAFAFA] p-4 sm:p-6">
        <div
          className={`grid gap-6 ${
            images.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {images.length > 0 ? (
            images.map((image, index) => (
              <img
                key={index}
                src={cloudinaryAuto(image.src)}
                alt={image.alt}
                className="w-full rounded-lg border border-[#E8E8EC] bg-white object-contain shadow-sm"
              />
            ))
          ) : (
            <div className="flex aspect-4/5 w-full flex-col items-center justify-center gap-2 rounded-lg border border-[#E8E8EC] bg-white text-sm text-[#B0B0B0]">
              <ImageIcon className="size-6" />
              No template screenshot uploaded yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { CvTemplateShowcaseBlockView }
