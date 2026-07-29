import type { QuoteBlock } from "@/lib/blocks/types"

function QuoteBlockView({ block }: { block: QuoteBlock }) {
  if (!block.text) {
    return null
  }
  return (
    <div className="not-prose my-6 border-l-4 border-[#AAA8A7] bg-linear-to-r from-[#F6F4F1] to-white py-6 pr-6 pl-6">
      <div className="mb-2 text-4xl leading-none font-bold text-[#4A4A4A]">
        &rdquo;
      </div>
      <blockquote className="text-lg leading-relaxed font-semibold text-[#161616] italic">
        {block.text}
      </blockquote>
      {block.source && (
        <cite className="mt-3 block text-sm font-normal text-[#8C8C8C] not-italic">
          -{block.source}
        </cite>
      )}
    </div>
  )
}

export { QuoteBlockView }
