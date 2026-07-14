import { DEFAULT_COLOR } from "@/lib/colors"
import type { StatRowBlock } from "@/lib/blocks/types"

function StatRowBlockView({ block }: { block: StatRowBlock }) {
  const stats = block.stats.filter((stat) => stat.value || stat.label)
  if (stats.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {stats.map((stat, index) => {
        const color = stat.color || DEFAULT_COLOR
        return (
          <div
            key={index}
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: `${color}1A` }}
          >
            <p className="text-2xl font-bold" style={{ color }}>
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-[#6B6B6B]">{stat.label}</p>
          </div>
        )
      })}
    </div>
  )
}

export { StatRowBlockView }
