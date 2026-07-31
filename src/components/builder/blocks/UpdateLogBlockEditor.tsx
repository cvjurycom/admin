import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { UpdateLogBlock } from "@/lib/blocks/types"

function UpdateLogBlockEditor({
  block,
  onChange,
}: {
  block: UpdateLogBlock
  onChange: (block: UpdateLogBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.title}
        placeholder="Title (e.g. Update Note)"
        onChange={(event) => onChange({ ...block, title: event.target.value })}
      />
      <Textarea
        value={block.text}
        placeholder="Message"
        onChange={(event) => onChange({ ...block, text: event.target.value })}
      />
    </div>
  )
}

export { UpdateLogBlockEditor }
