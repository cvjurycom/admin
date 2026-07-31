import type { DarkCtaBlock } from "@/lib/blocks/types"

function DarkCtaBlockView({ block }: { block: DarkCtaBlock }) {
  if (!block.title && !block.body) {
    return null
  }
  return (
    <div className="not-prose my-6 overflow-hidden rounded-[8px] bg-[#232326] p-8">
      {block.badge && (
        <p className="text-xs font-semibold tracking-widest text-[#BBBAB9BD] uppercase">
          {block.badge}
        </p>
      )}
      {block.title && (
        <h3 className="mt-3 mb-4 text-[36px] font-bold whitespace-pre-line text-white">
          {block.title}
        </h3>
      )}
      {block.body && (
        <p className="mb-6 text-[14px] leading-relaxed text-[#E8E4DF]">
          {block.body}
        </p>
      )}
      <div className="mb-6 flex flex-wrap gap-3">
        {block.primaryCta && (
          <button
            type="button"
            className="rounded-[25px] bg-[#E97451] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#E0552A]"
          >
            {block.primaryCta}
          </button>
        )}
        {block.secondaryCta && (
          <button
            type="button"
            className="rounded-[25px] border border-[#0000001A] bg-[#F7F7F7] px-6 py-3 text-sm font-medium text-[#111111] transition-colors hover:bg-white"
          >
            {block.secondaryCta}
          </button>
        )}
      </div>
      {block.tagline && (
        <div className="mb-2 w-fit rounded-tr-[10px] border-l-4 border-[#F0642F] bg-[#3B2A27] px-5 py-4">
          <p className="text-sm font-medium text-white">{block.tagline}</p>
        </div>
      )}
      {block.bestNextStep && (
        <div className="-mt-2 rounded-tr-[10px] rounded-b-[10px] border border-[#303032] bg-[#1C1C21] px-6 pt-6 pb-5">
          <p className="mb-1 text-lg font-semibold text-white">
            {block.bestNextStepLabel}
          </p>
          <p className="text-xs text-[#BBBAB9]">{block.bestNextStep}</p>
        </div>
      )}
    </div>
  )
}

export { DarkCtaBlockView }
