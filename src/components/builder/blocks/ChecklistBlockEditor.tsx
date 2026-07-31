import { StringListEditor } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import type { ChecklistBlock } from "@/lib/blocks/types"

function ChecklistBlockEditor({
  block,
  onChange,
}: {
  block: ChecklistBlock
  onChange: (block: ChecklistBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.title}
        placeholder="Title (optional)"
        onChange={(event) => onChange({ ...block, title: event.target.value })}
      />
      <StringListEditor
        items={block.items}
        onChange={(items) => onChange({ ...block, items })}
        placeholder="Checklist item"
      />
    </div>
  )
}

export { ChecklistBlockEditor }
