import { cn } from "@/lib/utils"
import type { RichTextBlock } from "@/lib/blocks/types"

function RichTextBlockView({ block }: { block: RichTextBlock }) {
  if (!block.html) {
    return null
  }
  const isCard = block.variant === "card"
  return (
    <div
      className={cn(
        "text-[16px] text-[#5F5F66] [&_a]:text-[#E97451] [&_a]:underline [&_hr]:my-4 [&_hr]:border-t [&_hr]:border-dashed [&_hr]:border-[#E9B44C] [&_li]:text-[16px] [&_li]:text-[#5F5F66] [&_p]:text-[16px] [&_p]:text-[#5F5F66]",
        isCard &&
          "not-prose my-6 rounded-2xl border border-[#E8E4DF] bg-white p-6"
      )}
      dangerouslySetInnerHTML={{ __html: block.html }}
    />
  )
}

export { RichTextBlockView }
