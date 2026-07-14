import { Check } from "lucide-react"

import type { CalloutBlock } from "@/lib/blocks/types"

function CalloutBlockView({ block }: { block: CalloutBlock }) {
  const items = block.items.filter(Boolean)
  if (!block.title && items.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 rounded-xl border border-[#F3D9C7] bg-[#FDF3EC] p-5">
      {block.title && (
        <p className="text-sm font-semibold tracking-wide text-[#E97451] uppercase">
          {block.title}
        </p>
      )}
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm text-[#4A4A4A]"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-[#E97451]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { CalloutBlockView }
