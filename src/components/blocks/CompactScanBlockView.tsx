import { Check } from "lucide-react"

import type { CompactScanBlock } from "@/lib/blocks/types"

function CompactScanBlockView({ block }: { block: CompactScanBlock }) {
  if (!block.label && !block.status && !block.description) {
    return null
  }
  return (
    <div className="not-prose my-6 flex items-start gap-4 rounded-xl border border-[#E8E8EC] bg-white p-4">
      <div className="shrink-0">
        <p className="mb-1 text-xs font-semibold tracking-wide text-[#8C8C8C] uppercase">
          {block.label}
        </p>
        <span className="inline-flex items-center gap-1 rounded-full border border-[#BBF0D4] bg-[#E3F5E9] px-3 py-1 text-xs font-bold text-[#16A34A]">
          <Check className="size-3" /> {block.status}
        </span>
      </div>
      <div className="border-l border-[#E8E8EC] pl-4">
        {block.nextStep && (
          <p className="mb-1 text-xs font-medium text-[#4A4A4A]">
            Next step: {block.nextStep}.
          </p>
        )}
        {block.description && (
          <p className="text-xs text-[#8C8C8C]">{block.description}</p>
        )}
      </div>
    </div>
  )
}

export { CompactScanBlockView }
