import type { NumberedListBlock } from "@/lib/blocks/types"

function NumberedListBlockView({ block }: { block: NumberedListBlock }) {
  const items = block.items.filter((item) => item.title || item.description)
  if (items.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 flex flex-col gap-4">
      {items.map((item, index) => (
        <div key={index} className="flex gap-3">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#FDECE3] text-sm font-semibold text-[#E97451]">
            {index + 1}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#161616]">
              {item.title}
            </p>
            {item.description && (
              <p className="mt-1 text-sm text-[#6B6B6B]">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export { NumberedListBlockView }
