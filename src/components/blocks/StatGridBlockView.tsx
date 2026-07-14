import type { StatGridBlock } from "@/lib/blocks/types"

function StatGridBlockView({ block }: { block: StatGridBlock }) {
  const stats = block.stats.filter((stat) => stat.value || stat.label)
  if (stats.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 grid grid-cols-2 gap-4 rounded-xl bg-[#161616] p-6 sm:grid-cols-3">
      {stats.map((stat, index) => (
        <div key={index}>
          <p className="text-2xl font-bold text-white">{stat.value}</p>
          <p className="mt-1 text-xs text-[#B0B0B0]">{stat.label}</p>
          {stat.source && (
            <p className="mt-2 text-[10px] text-[#6B6B6B]">— {stat.source}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export { StatGridBlockView }
