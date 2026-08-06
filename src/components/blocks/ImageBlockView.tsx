import { cloudinaryAuto } from "@/lib/cloudinary"
import type { ImageBlock } from "@/lib/blocks/types"

function ImageBlockView({ block }: { block: ImageBlock }) {
  if (!block.src) {
    return null
  }
  return (
    <figure className="not-prose my-6">
      <img
        src={cloudinaryAuto(block.src)}
        alt={block.alt}
        className="aspect-video w-full rounded-xl object-cover"
      />
      {block.caption && (
        <figcaption className="mt-2 text-center text-sm text-[#8C8C8C]">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

export { ImageBlockView }
