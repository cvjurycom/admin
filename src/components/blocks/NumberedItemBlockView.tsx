import type { NumberedItemBlock } from "@/lib/blocks/types"

function NumberedItemBlockView({ block }: { block: NumberedItemBlock }) {
  if (!block.title && !block.body) {
    return null
  }
  return (
    <div className="not-prose my-6 rounded-[12px] border border-[#E8E4DF] bg-white p-6">
      <p className="mb-4 text-[24px] leading-none font-medium text-[#FFB19A]">
        {block.number}
      </p>
      {block.title && (
        <p className="mb-2 text-[15px] font-semibold text-[#232326]">
          {block.title}
        </p>
      )}
      {block.body && <p className="text-[13px] text-[#5F5F66]">{block.body}</p>}
    </div>
  )
}

export { NumberedItemBlockView }
