import type { UpdateLogBlock } from "@/lib/blocks/types"

function UpdateLogBlockView({ block }: { block: UpdateLogBlock }) {
  if (!block.text) {
    return null
  }
  return (
    <div className="not-prose my-6 overflow-hidden rounded border-t-4 border-[#F0DFB2] bg-linear-to-b from-[#FFF9ED] to-white px-6 py-6">
      {block.title && (
        <p className="mb-3 text-xl font-semibold text-[#232326]">
          {block.title}
        </p>
      )}
      <p className="text-[14px] leading-relaxed text-[#5F5F66]">{block.text}</p>
    </div>
  )
}

export { UpdateLogBlockView }
