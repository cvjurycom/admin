import { BookOpen } from "lucide-react"

import type { SummaryBlock } from "@/lib/blocks/types"

function SummaryBlockView({ block }: { block: SummaryBlock }) {
  if (!block.text) {
    return null
  }
  return (
    <div className="not-prose my-6 rounded-xl border border-[#F3D9C7] bg-[#FDF3EC] p-5">
      {block.label && (
        <div className="flex items-center gap-2 text-sm font-semibold tracking-wide text-[#E97451] uppercase">
          <BookOpen className="size-4" />
          {block.label}
        </div>
      )}
      <p className="mt-3 whitespace-pre-line text-sm text-[#4A4A4A]">
        {block.text}
      </p>
    </div>
  )
}

export { SummaryBlockView }
