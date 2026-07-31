import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { NumberedItemBlock } from "@/lib/blocks/types"

function NumberedItemBlockEditor({
  block,
  onChange,
}: {
  block: NumberedItemBlock
  onChange: (block: NumberedItemBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.number}
        placeholder="Number (e.g. 01)"
        onChange={(event) => onChange({ ...block, number: event.target.value })}
      />
      <Input
        value={block.title}
        placeholder="Title"
        onChange={(event) => onChange({ ...block, title: event.target.value })}
      />
      <Textarea
        value={block.body}
        placeholder="Body text"
        onChange={(event) => onChange({ ...block, body: event.target.value })}
      />
    </div>
  )
}

export { NumberedItemBlockEditor }
