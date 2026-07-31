import { RepeatingRows } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { NumberedListBlock } from "@/lib/blocks/types"

function NumberedListBlockEditor({
  block,
  onChange,
}: {
  block: NumberedListBlock
  onChange: (block: NumberedListBlock) => void
}) {
  return (
    <RepeatingRows
      items={block.items}
      onChange={(items) => onChange({ ...block, items })}
      createItem={() => ({ title: "", description: "" })}
      addLabel="Add item"
      renderRow={(item, update) => (
        <div className="flex flex-col gap-2">
          <Input
            value={item.title}
            placeholder="Item title"
            onChange={(event) =>
              update({ ...item, title: event.target.value })
            }
          />
          <Textarea
            value={item.description}
            placeholder="Description"
            onChange={(event) =>
              update({ ...item, description: event.target.value })
            }
          />
        </div>
      )}
    />
  )
}

export { NumberedListBlockEditor }
