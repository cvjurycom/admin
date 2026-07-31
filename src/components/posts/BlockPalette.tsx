import { ChevronDown, Plus } from "lucide-react"
import { useState } from "react"

import { BLOCK_CATEGORIES, BLOCK_ICONS, BLOCK_LABELS } from "@/lib/blocks/types"
import type { BlockType } from "@/lib/blocks/types"

const DEFAULT_OPEN = new Set(["Callouts", "Stats & Data"])

function BlockPalette({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    new Set(DEFAULT_OPEN)
  )

  const toggleCategory = (label: string) => {
    setOpenCategories((current) => {
      const next = new Set(current)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E8E8EC] bg-white">
      <div className="border-b border-[#E8E8EC] px-4 py-3">
        <p className="text-xs font-bold tracking-widest text-[#8C8C8C] uppercase">
          Components
        </p>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {BLOCK_CATEGORIES.map((category) => {
          const isOpen = openCategories.has(category.label)
          return (
            <div key={category.label}>
              <button
                type="button"
                onClick={() => toggleCategory(category.label)}
                className="flex w-full items-center justify-between px-4 py-2 transition-colors hover:bg-[#FAFAFA]"
              >
                <span className="text-xs font-semibold text-[#4A4A4A]">
                  {category.label}
                </span>
                <ChevronDown
                  className={`size-3.5 text-[#8C8C8C] transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="pb-1">
                  {category.types.map((type) => {
                    const Icon = BLOCK_ICONS[type]
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => onAdd(type)}
                        className="group flex w-full items-center gap-2.5 px-4 py-2 text-[#4A4A4A] transition-colors hover:bg-[#FDF3EC] hover:text-[#E97451]"
                      >
                        <Icon className="size-4 shrink-0 text-[#8C8C8C] group-hover:text-[#E97451]" />
                        <span className="text-left text-xs leading-snug">
                          {BLOCK_LABELS[type]}
                        </span>
                        <Plus className="ml-auto size-3 text-[#E97451] opacity-0 group-hover:opacity-100" />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { BlockPalette }
