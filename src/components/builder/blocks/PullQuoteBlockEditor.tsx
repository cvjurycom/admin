import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { PullQuoteBlock } from "@/lib/blocks/types"

function PullQuoteBlockEditor({
  block,
  onChange,
}: {
  block: PullQuoteBlock
  onChange: (block: PullQuoteBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Textarea
        value={block.quote}
        placeholder="Quote text"
        onChange={(event) => onChange({ ...block, quote: event.target.value })}
      />
      <Input
        value={block.attribution}
        placeholder="Attribution"
        onChange={(event) =>
          onChange({ ...block, attribution: event.target.value })
        }
      />
    </div>
  )
}

export { PullQuoteBlockEditor }
