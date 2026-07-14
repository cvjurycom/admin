import type { ScanStripBlock } from "@/lib/blocks/types"

function ScanStripBlockView({ block }: { block: ScanStripBlock }) {
  if (!block.title && !block.description) {
    return null
  }
  return (
    <div className="not-prose my-6 flex items-center gap-4 rounded-2xl bg-[#F3FAF6] p-4">
      {block.badgeText && (
        <div className="flex aspect-square w-24 shrink-0 items-center justify-center rounded-xl bg-[#161616] p-3 text-center text-sm font-bold whitespace-pre-line text-white">
          {block.badgeText}
        </div>
      )}
      <div>
        {block.title && (
          <p className="text-lg font-bold text-[#161616]">{block.title}</p>
        )}
        {block.description && (
          <p className="mt-1 text-sm text-[#6B6B6B]">{block.description}</p>
        )}
      </div>
    </div>
  )
}

export { ScanStripBlockView }
