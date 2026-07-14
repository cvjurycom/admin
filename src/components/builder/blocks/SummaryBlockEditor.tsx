import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { SummaryBlock } from "@/lib/blocks/types"

function SummaryBlockEditor({
  block,
  onChange,
}: {
  block: SummaryBlock
  onChange: (block: SummaryBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.label}
        placeholder="Label (e.g. Summary)"
        onChange={(event) => onChange({ ...block, label: event.target.value })}
      />
      <Textarea
        value={block.text}
        placeholder="Summary text"
        onChange={(event) => onChange({ ...block, text: event.target.value })}
      />
    </div>
  )
}

export { SummaryBlockEditor }
