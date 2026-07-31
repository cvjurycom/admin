import type { PullQuoteBlock } from "@/lib/blocks/types"

function PullQuoteBlockView({ block }: { block: PullQuoteBlock }) {
  if (!block.quote) {
    return null
  }
  return (
    <div className="not-prose my-6 border-l-4 border-[#E6BF67] bg-linear-to-r from-[#FFF9ED] to-white py-6 pr-6 pl-6">
      <div className="mb-2 text-4xl leading-none font-bold text-[#4A4A4A]">
        &rdquo;
      </div>
      <blockquote className="text-lg leading-relaxed font-semibold text-[#161616] italic">
        {block.quote}
      </blockquote>
      {block.attribution && (
        <cite className="mt-3 block text-sm font-normal text-[#E6BF67] not-italic">
          {block.attribution}
        </cite>
      )}
    </div>
  )
}

export { PullQuoteBlockView }
