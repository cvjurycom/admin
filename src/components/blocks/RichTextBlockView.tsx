import type { RichTextBlock } from "@/lib/blocks/types"

function RichTextBlockView({ block }: { block: RichTextBlock }) {
  if (!block.html) {
    return null
  }
  return <div dangerouslySetInnerHTML={{ __html: block.html }} />
}

export { RichTextBlockView }
