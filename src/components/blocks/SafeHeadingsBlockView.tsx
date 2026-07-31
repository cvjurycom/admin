import { BadgeCheck, CircleX } from "lucide-react"

import type { SafeHeadingsBlock } from "@/lib/blocks/types"

function SafeHeadingsBlockView({ block }: { block: SafeHeadingsBlock }) {
  const rows = block.rows.filter((row) => row.safe || row.avoid)
  if (rows.length === 0) {
    return null
  }

  if (block.layout === "alt") {
    return (
      <div className="not-prose my-6 overflow-hidden rounded-xl border border-[#E8E8EC]">
        <div className="grid grid-cols-2 bg-[#FCFAF8] px-5 py-4">
          <p className="text-base font-bold text-[#232326]">
            {block.safeLabel}
          </p>
          <p className="text-base font-bold text-[#232326]">
            {block.avoidLabel}
          </p>
        </div>
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-2 border-t border-[#E8E4DF]"
          >
            <div className="flex items-center gap-2.5 px-5 py-4">
              <BadgeCheck className="size-5 shrink-0 text-[#2F9E8F]" />
              <p className="text-sm text-[#5F5F66]">{row.safe}</p>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-4">
              <CircleX className="size-5 shrink-0 text-[#D94A4A]" />
              <p className="text-sm text-[#5F5F66]">{row.avoid}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-[#E8E8EC]">
      <div className="grid grid-cols-2">
        <div className="bg-[#DCFCE7] px-5 py-4">
          <p className="text-base font-bold text-[#232326]">
            {block.safeLabel}
          </p>
        </div>
        <div className="bg-[#FEE2E2] px-5 py-4">
          <p className="text-base font-bold text-[#232326]">
            {block.avoidLabel}
          </p>
        </div>
      </div>
      {rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-2 border-t border-[#E8E8EC]"
        >
          <div className="border-r border-[#E8E8EC] px-5 py-4">
            <p className="text-sm text-[#5F5F66]">{row.safe}</p>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-[#5F5F66]">{row.avoid}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export { SafeHeadingsBlockView }
