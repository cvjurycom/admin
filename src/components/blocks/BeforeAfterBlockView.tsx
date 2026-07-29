import type { BeforeAfterBlock } from "@/lib/blocks/types"

function DashedArrow() {
  return (
    <svg width="40" height="12" viewBox="0 0 40 12" className="shrink-0">
      <line
        x1="0"
        y1="6"
        x2="32"
        y2="6"
        stroke="#8A8580"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      <polyline
        points="28,2 36,6 28,10"
        fill="none"
        stroke="#8A8580"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BeforeAfterBlockView({ block }: { block: BeforeAfterBlock }) {
  const tags = block.afterTags.filter(Boolean)
  if (!block.beforeText && !block.afterText) {
    return null
  }
  return (
    <div className="not-prose my-6">
      {(block.title || block.subtitle) && (
        <div className="mb-4">
          {block.title && (
            <p className="text-base font-semibold text-[#161616]">
              {block.title}
            </p>
          )}
          {block.subtitle && (
            <p className="mt-1 text-sm text-[#8C8C8C]">{block.subtitle}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
        <div className="rounded-[12px] border border-[#E8E4DF] bg-white p-4">
          <span className="mb-3 flex items-center gap-1.5 text-xs font-medium tracking-widest text-[#D94A4A] uppercase">
            <span className="size-1.5 rounded-full bg-[#D94A4A]" />
            Before
          </span>
          <p className="mb-2 text-base font-semibold text-[#232326]">
            {block.beforeText}
          </p>
          {block.beforeNote && (
            <p className="text-[13px] text-[#5F5F66]">{block.beforeNote}</p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <DashedArrow />
        </div>

        <div className="rounded-[12px] border border-[#E8E4DF] bg-[#FCFAF8] p-4">
          <span className="mb-3 flex items-center gap-1.5 text-xs font-medium tracking-widest text-[#2F9E8F] uppercase">
            <span className="size-1.5 rounded-full bg-[#2F9E8F]" />
            After
          </span>
          <p className="mb-3 text-[16px] font-semibold text-[#232326]">
            {block.afterText}
          </p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full border border-[#CECBC6] px-3 py-1 text-xs text-[#5F5F66]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { BeforeAfterBlockView }
