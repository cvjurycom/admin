import { BarChart3, Quote } from "lucide-react"

import type { InsightsDataBlock } from "@/lib/blocks/types"

function InsightsDataBlockView({ block }: { block: InsightsDataBlock }) {
  const stats = block.stats.filter((stat) => stat.value || stat.label)
  if (stats.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl bg-[#2E2E30]">
      <div className="px-6 py-5">
        <div className="mb-2 flex items-center gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#E97451]">
            <BarChart3 className="size-4 text-white" />
          </div>
          {block.eyebrow && (
            <p className="text-xs font-bold tracking-widest text-[#FF9778] uppercase">
              {block.eyebrow}
            </p>
          )}
        </div>
        {block.description && (
          <p className="text-sm text-[#E8E4DF]">{block.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-px border-t border-[#3A3A3C] bg-[#3A3A3C] sm:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`px-6 py-6 ${
              stat.highlighted ? "bg-[#E97451]" : "bg-[#2E2E30]"
            }`}
          >
            <p
              className={`mb-2 text-4xl font-bold ${
                stat.highlighted ? "text-white" : "text-[#FF9778]"
              }`}
            >
              {stat.value}
            </p>
            <p className="text-sm text-white">{stat.label}</p>
            {stat.source && (
              <p
                className={`mt-1 text-xs ${
                  stat.highlighted ? "text-white/80" : "text-[#BBBAB9]"
                }`}
              >
                — {stat.source}
              </p>
            )}
          </div>
        ))}
      </div>

      {block.quote && (
        <div className="border-t border-[#3A3A3C] px-6 py-5">
          <div className="flex gap-2.5">
            <Quote className="mt-0.5 size-4 shrink-0 text-[#E97451]" />
            <div>
              <p className="text-sm text-white italic">
                &ldquo;{block.quote}&rdquo;
              </p>
              {block.quoteSource && (
                <p className="mt-1 text-xs text-[#BBBAB9]">
                  — {block.quoteSource}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { InsightsDataBlockView }
