import { ImageIcon } from "lucide-react"

import { cloudinaryAuto } from "@/lib/cloudinary"
import type { AtsScoreCardBlock } from "@/lib/blocks/types"

function AtsScoreCardBlockView({ block }: { block: AtsScoreCardBlock }) {
  if (!block.url && !block.imageSrc) {
    return null
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-[#E8E8EC] bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-[#E8E8EC] bg-[#FAFAFA] px-4 py-2.5">
        <div className="flex shrink-0 gap-1.5">
          <span className="size-3 rounded-full bg-[#F87171]" />
          <span className="size-3 rounded-full bg-[#FBBF24]" />
          <span className="size-3 rounded-full bg-[#4ADE80]" />
        </div>
        <div className="flex-1 truncate rounded-md border border-[#E8E8EC] bg-white px-3 py-1 font-mono text-xs text-[#8C8C8C]">
          {block.url}
        </div>
        {block.badge && (
          <span className="shrink-0 text-[10px] font-bold tracking-widest text-[#8C8C8C] uppercase">
            {block.badge}
          </span>
        )}
      </div>

      {block.imageSrc ? (
        <img
          src={cloudinaryAuto(block.imageSrc)}
          alt={block.imageAlt}
          className="w-full object-cover"
        />
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-[#FAFAFA] text-sm text-[#B0B0B0]">
          <ImageIcon className="size-6" />
          No screenshot uploaded yet
        </div>
      )}
    </div>
  )
}

export { AtsScoreCardBlockView }
