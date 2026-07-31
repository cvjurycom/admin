import { RepeatingRows } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FeatureGridBlock } from "@/lib/blocks/types"

function FeatureGridBlockEditor({
  block,
  onChange,
}: {
  block: FeatureGridBlock
  onChange: (block: FeatureGridBlock) => void
}) {
  return (
    <RepeatingRows
      items={block.items}
      onChange={(items) => onChange({ ...block, items })}
      createItem={() => ({ title: "", description: "" })}
      addLabel="Add feature"
      renderRow={(item, update) => (
        <div className="flex flex-col gap-2">
          <Input
            value={item.title}
            placeholder="Feature title"
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

export { FeatureGridBlockEditor }
