import type { ShortAnswerBlock } from "@/lib/blocks/types"

function ShortAnswerBlockView({ block }: { block: ShortAnswerBlock }) {
  const cards = block.cards.filter((card) => card.heading || card.body)
  if (!block.title && !block.body && cards.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 overflow-hidden">
      {(block.title || block.body) && (
        <div className="rounded-[12px] border border-[#E8E4DF] bg-[#FAFAF9] px-6 pt-6 pb-5">
          {block.title && (
            <p className="text-[24px] font-semibold text-[#232326]">
              {block.title}
            </p>
          )}
          {block.body && (
            <p className="mt-6 text-sm whitespace-pre-line text-[#5F5F66]">
              {block.body}
            </p>
          )}
        </div>
      )}
      {cards.length > 0 && (
        <div className="mt-3 grid grid-cols-1 divide-y divide-[#E8E4DF] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {cards.map((card, index) => (
            <div key={index} className="px-5 py-4">
              <p className="text-base font-semibold text-[#232326]">
                {card.heading}
              </p>
              <div className="mb-1.5 h-1 w-10 rounded-full bg-[#E6BF67]" />
              <p className="text-sm text-[#5F5F66]">{card.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { ShortAnswerBlockView }
