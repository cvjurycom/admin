import { CheckSquare } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ChecklistBlock } from "@/lib/blocks/types"

function ChecklistBlockView({ block }: { block: ChecklistBlock }) {
  const items = block.items.filter(Boolean)
  if (items.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 rounded-xl border border-[#F3D9C7] bg-[#FDF3EC] p-5">
      {block.title && (
        <p className="text-sm font-semibold text-[#161616]">{block.title}</p>
      )}
      <ul
        className={cn(
          "flex flex-col gap-2.5",
          block.title && "mt-3"
        )}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-2.5 text-sm text-[#4A4A4A]"
          >
            <CheckSquare className="mt-0.5 size-4 shrink-0 text-[#E97451]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { ChecklistBlockView }
