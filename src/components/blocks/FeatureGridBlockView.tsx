import type { FeatureGridBlock } from "@/lib/blocks/types"

function FeatureGridBlockView({ block }: { block: FeatureGridBlock }) {
  const items = block.items.filter((item) => item.title || item.description)
  if (items.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-[#E8E8EC] bg-white p-5"
        >
          <p className="text-sm font-semibold text-[#161616]">{item.title}</p>
          <p className="mt-1.5 text-sm text-[#6B6B6B]">{item.description}</p>
        </div>
      ))}
    </div>
  )
}

export { FeatureGridBlockView }
