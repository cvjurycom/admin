import type { AtsVisualFlowBlock } from "@/lib/blocks/types"

function ArrowDivider() {
  return (
    <svg
      width="28"
      height="10"
      viewBox="0 0 28 10"
      className="hidden shrink-0 sm:block"
    >
      <line
        x1="0"
        y1="5"
        x2="22"
        y2="5"
        stroke="#F5A090"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      <polyline
        points="18,1 26,5 18,9"
        fill="none"
        stroke="#F5A090"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function AtsVisualFlowBlockView({ block }: { block: AtsVisualFlowBlock }) {
  const tags = block.tags.filter(Boolean)
  if (!block.label && !block.nextStep) {
    return null
  }
  const circumference = 2 * Math.PI * 24
  const dash = (Math.min(Math.max(block.score, 0), 100) / 100) * circumference

  return (
    <div className="not-prose my-6 rounded-2xl border border-[#F3D9C7] bg-[#FDF3EC] p-6">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="w-full max-w-32 shrink-0 rounded-xl bg-white p-3 shadow-sm">
          <div className="mb-3 flex flex-col gap-1.5">
            {[90, 75, 85, 60, 80].map((w, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full bg-[#F1F1F3]"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          <div className="h-8 rounded-lg bg-[#FDECE3]" />
        </div>

        <ArrowDivider />

        <div className="flex w-full max-w-40 shrink-0 flex-col items-center rounded-xl bg-white px-4 pt-3 pb-3 shadow-sm">
          <p className="mb-2 self-start text-xs font-semibold text-[#4A4A4A]">
            {block.label}
          </p>
          <div className="relative mb-2 size-16">
            <svg viewBox="0 0 60 60" className="size-16 -rotate-90">
              <circle
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke="#FBE0CE"
                strokeWidth="7"
              />
              <circle
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke="#E97451"
                strokeWidth="7"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-[#161616]">
                {block.score}%
              </span>
            </div>
          </div>
          <div className="mb-3 w-full space-y-1">
            {[100, 85, 70].map((w, i) => (
              <div
                key={i}
                className="h-1 rounded-full bg-[#F1F1F3]"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          {block.status && (
            <div className="flex items-center gap-1.5 rounded-full bg-[#E97451] px-3 py-1.5 text-[10px] font-semibold text-white">
              <span className="size-1.5 rounded-full bg-white/80" />
              {block.status}
            </div>
          )}
        </div>

        <ArrowDivider />

        <div className="w-full max-w-40 shrink-0 rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="size-3 shrink-0 rounded-full bg-[#E97451]" />
            <p className="text-[10px] font-semibold tracking-wide text-[#E97451] uppercase">
              Next step
            </p>
          </div>
          <p className="mb-1 text-sm font-bold text-[#161616]">
            {block.nextStep}
          </p>
          {tags.length > 0 && (
            <p className="text-[10px] leading-snug text-[#8C8C8C]">
              {tags.join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export { AtsVisualFlowBlockView }
