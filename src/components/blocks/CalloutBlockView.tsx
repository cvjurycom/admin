import { BadgeCheck } from "lucide-react"

import type { CalloutBlock } from "@/lib/blocks/types"

function CalloutBlockView({ block }: { block: CalloutBlock }) {
  const items = block.items.filter(Boolean)
  if (!block.title && items.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 rounded-xl border border-[#E8E8EC] bg-white p-6">
      {block.title && (
        <p className="mb-4 text-xl font-bold text-[#232326]">
          {block.title}
        </p>
      )}
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-base text-[#5F5F66]"
          >
            <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[#E97451]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { CalloutBlockView }
