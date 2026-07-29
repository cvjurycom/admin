import { ChevronDown } from "lucide-react"
import { useState } from "react"

import type { FaqBlock } from "@/lib/blocks/types"

function FaqBlockView({ block }: { block: FaqBlock }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const items = block.items.filter((item) => item.question || item.answer)
  if (items.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6">
      {block.title && (
        <p className="mb-6 text-2xl font-bold text-[#232326]">
          {block.title}
        </p>
      )}
      <div className="divide-y divide-[#D8D8DC]">
        {items.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div key={index}>
              <button
                type="button"
                className="flex w-full items-center justify-between py-5 text-left"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="text-base text-[#232326]">
                  {item.question}
                </span>
                <ChevronDown
                  className={`ml-3 size-4 shrink-0 text-[#5F5F66] transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="pb-5">
                  <p className="text-sm text-[#5F5F66]">{item.answer}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { FaqBlockView }
