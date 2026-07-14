import type { QuoteBlock } from "@/lib/blocks/types"

function QuoteBlockView({ block }: { block: QuoteBlock }) {
  if (!block.text) {
    return null
  }
  return (
    <blockquote className="not-prose my-6 rounded-xl border-l-4 border-[#E97451] bg-[#FDF3EC] px-6 py-5">
      <p className="text-lg font-medium text-[#161616] italic">
        &ldquo;{block.text}&rdquo;
      </p>
      {block.source && (
        <cite className="mt-3 block text-sm font-normal text-[#8C8C8C] not-italic">
          — {block.source}
        </cite>
      )}
    </blockquote>
  )
}

export { QuoteBlockView }
