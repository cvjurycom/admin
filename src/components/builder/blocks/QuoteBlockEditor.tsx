import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { QuoteBlock } from "@/lib/blocks/types"

function QuoteBlockEditor({
  block,
  onChange,
}: {
  block: QuoteBlock
  onChange: (block: QuoteBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Textarea
        value={block.text}
        placeholder="Quote text"
        onChange={(event) => onChange({ ...block, text: event.target.value })}
      />
      <Input
        value={block.source}
        placeholder="Source (e.g. Glassdoor HR Research)"
        onChange={(event) =>
          onChange({ ...block, source: event.target.value })
        }
      />
    </div>
  )
}

export { QuoteBlockEditor }
