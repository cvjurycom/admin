import { BadgeCheck } from "lucide-react"

import type { ChecklistBlock } from "@/lib/blocks/types"

function ChecklistBlockView({ block }: { block: ChecklistBlock }) {
  const items = block.items.filter(Boolean)
  if (items.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6">
      {block.title && (
        <p className="mb-4 text-base font-bold text-[#232326]">
          {block.title}
        </p>
      )}
      <ul className="flex flex-col gap-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-sm text-[#5F5F66]">
            <BadgeCheck className="mt-0.5 size-5 shrink-0 text-[#E97451]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { ChecklistBlockView }
