import type { EditorialTipBlock } from "@/lib/blocks/types"

function DashedArrow() {
  return (
    <svg width="40" height="12" viewBox="0 0 40 12" className="shrink-0">
      <line
        x1="0"
        y1="6"
        x2="32"
        y2="6"
        stroke="#BB8D24"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      <polyline
        points="28,2 36,6 28,10"
        fill="none"
        stroke="#BB8D24"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EditorialTipBlockView({ block }: { block: EditorialTipBlock }) {
  const rows = block.rows.filter((row) => row.left || row.right)
  if (!block.heading && rows.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 overflow-hidden rounded border-t-2 border-[#F0DFB2] bg-linear-to-r from-[#FFF9ED] to-white p-6">
      {block.heading && (
        <p className="text-base font-medium text-[#232326]">{block.heading}</p>
      )}
      {block.note && (
        <p className="mt-1 text-sm text-[#5F5F66]">{block.note}</p>
      )}

      {rows.length > 0 && (
        <div className="mt-5 flex flex-col gap-4">
          {rows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr]"
            >
              <div className="rounded-[12px] border border-[#E8E4DF] bg-white p-4">
                <p className="mb-3 text-xs font-semibold tracking-widest text-[#BB8D24] uppercase">
                  {block.leftLabel}
                </p>
                <p className="text-base font-semibold text-[#232326]">
                  &ldquo;{row.left}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-center">
                <DashedArrow />
              </div>

              <div className="rounded-[12px] border border-[#E8E4DF] bg-white p-4">
                <p className="mb-3 text-xs font-semibold tracking-widest text-[#BB8D24] uppercase">
                  {block.rightLabel}
                </p>
                <p className="text-base font-semibold text-[#232326]">
                  &ldquo;{row.right}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { EditorialTipBlockView }
