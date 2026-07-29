import type { SummaryBlock } from "@/lib/blocks/types"

function SummaryBlockView({ block }: { block: SummaryBlock }) {
  if (!block.text) {
    return null
  }
  const paragraphs = block.text.split(/\n{2,}/).filter(Boolean)

  return (
    <div
      className="not-prose relative my-6 overflow-hidden rounded border-l-4 border-l-[#E6BF67] bg-linear-to-br from-[#FFF9ED] to-[#FFFFFF] p-6"
      style={{
        clipPath:
          "polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)",
      }}
    >
      <div
        className="absolute right-0 bottom-0 h-7 w-7 bg-[#F3D9C7]"
        style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
      />
      {block.label && (
        <p className="text-[20px] font-semibold text-[#C3901D]">
          {block.label}
        </p>
      )}
      <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-[#5F5F66]">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>
            {paragraph}
            {block.hasMore && index === paragraphs.length - 1 && (
              <span className="cursor-pointer font-medium text-[#C8860D] underline underline-offset-2">
                {" "}
                … more
              </span>
            )}
          </p>
        ))}
      </div>
    </div>
  )
}

export { SummaryBlockView }
