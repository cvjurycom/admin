import { StringListEditor } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import type { CalloutBlock } from "@/lib/blocks/types"

function CalloutBlockEditor({
  block,
  onChange,
}: {
  block: CalloutBlock
  onChange: (block: CalloutBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.title}
        placeholder="Title (e.g. Key Takeaways)"
        onChange={(event) => onChange({ ...block, title: event.target.value })}
      />
      <StringListEditor
        items={block.items}
        onChange={(items) => onChange({ ...block, items })}
        placeholder="Takeaway"
        addLabel="Add takeaway"
      />
    </div>
  )
}

export { CalloutBlockEditor }
