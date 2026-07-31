import { AlertTriangle, Lightbulb } from "lucide-react"

import type { GuidanceNoteBlock } from "@/lib/blocks/types"

function GuidanceNoteBlockView({ block }: { block: GuidanceNoteBlock }) {
  if (!block.text) {
    return null
  }
  const isWarning = block.tone === "warning"
  return (
    <div
      className={
        isWarning
          ? "not-prose my-6 flex gap-3 rounded-xl border border-[#FFEFE4] bg-[#FFF7F2] px-5 py-4"
          : "not-prose my-6 flex gap-3 rounded-xl border border-[#FFF1D9] bg-[#FFF9EE] px-5 py-4"
      }
    >
      <div
        className={
          isWarning
            ? "flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#FFE9DA]"
            : "flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#FFECCA]"
        }
      >
        {isWarning ? (
          <AlertTriangle className="size-4 text-[#E97451]" />
        ) : (
          <Lightbulb className="size-4 text-[#D99A2B]" />
        )}
      </div>
      <p
        className={
          isWarning
            ? "self-center text-sm leading-relaxed text-[#E97451]"
            : "self-center text-sm leading-relaxed text-[#D99A2B]"
        }
      >
        {block.text}
      </p>
    </div>
  )
}

export { GuidanceNoteBlockView }
