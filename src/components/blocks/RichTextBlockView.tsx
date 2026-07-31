import type { RichTextBlock } from "@/lib/blocks/types"

function RichTextBlockView({ block }: { block: RichTextBlock }) {
  if (!block.html) {
    return null
  }
  return (
    <div
      className="text-[16px] text-[#5F5F66] [&_a]:text-[#E97451] [&_a]:underline [&_li]:text-[16px] [&_li]:text-[#5F5F66] [&_p]:text-[16px] [&_p]:text-[#5F5F66]"
      dangerouslySetInnerHTML={{ __html: block.html }}
    />
  )
}

export { RichTextBlockView }
