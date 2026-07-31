import { FileBadge, FileText, HandHeart, Share2 } from "lucide-react"

import type { AtsMatchMapBlock } from "@/lib/blocks/types"

const SIGNAL_ICONS = [FileText, Share2, HandHeart, FileBadge]

function AtsMatchMapBlockView({ block }: { block: AtsMatchMapBlock }) {
  const signals = block.signals.filter((signal) => signal.title || signal.body)
  if (!block.title && signals.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6">
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          {block.title && (
            <p className="mb-1 text-xs font-semibold tracking-widest text-[#E97451] uppercase">
              {block.title}
            </p>
          )}
          {block.subtitle && (
            <p className="text-[20px] font-semibold text-[#232326]">
              {block.subtitle}
            </p>
          )}
        </div>
        {block.description && (
          <p className="max-w-xs text-xs text-[#8A8580] sm:text-right">
            {block.description}
          </p>
        )}
      </div>

      {signals.length > 0 && (
        <div className="flex flex-col gap-4">
          {Array.from(
            { length: Math.ceil(signals.length / 2) },
            (_, rowIndex) => signals.slice(rowIndex * 2, rowIndex * 2 + 2)
          ).map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-col gap-4 sm:flex-row">
              {row.map((signal, colIndex) => {
                const index = rowIndex * 2 + colIndex
                const Icon = SIGNAL_ICONS[index % SIGNAL_ICONS.length]
                return (
                  <div
                    key={index}
                    className={`rounded-[12px] border border-[#E8E4DF] bg-white p-5 ${
                      signal.wide ? "sm:flex-4" : "sm:flex-3"
                    }`}
                  >
                    <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-[#F5F4F2]">
                      <Icon className="size-5 text-[#5F5F66]" />
                    </div>
                    <p className="mb-2 text-[14px] font-bold text-[#232326]">
                      {signal.title}
                    </p>
                    <p className="text-xs text-[#5F5F66]">{signal.body}</p>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { AtsMatchMapBlockView }
