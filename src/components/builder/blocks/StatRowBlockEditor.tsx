import { ColorSwatchPicker, RepeatingRows } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { DEFAULT_COLOR } from "@/lib/colors"
import type { StatRowBlock } from "@/lib/blocks/types"

function StatRowBlockEditor({
  block,
  onChange,
}: {
  block: StatRowBlock
  onChange: (block: StatRowBlock) => void
}) {
  return (
    <RepeatingRows
      items={block.stats}
      onChange={(stats) => onChange({ ...block, stats })}
      createItem={() => ({ value: "", label: "", color: DEFAULT_COLOR })}
      addLabel="Add stat"
      renderRow={(stat, update) => (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={stat.value}
              placeholder="98%"
              onChange={(event) =>
                update({ ...stat, value: event.target.value })
              }
            />
            <Input
              value={stat.label}
              placeholder="Fortune 500 companies use ATS"
              onChange={(event) =>
                update({ ...stat, label: event.target.value })
              }
            />
          </div>
          <ColorSwatchPicker
            value={stat.color || DEFAULT_COLOR}
            onChange={(color) => update({ ...stat, color })}
          />
        </div>
      )}
    />
  )
}

export { StatRowBlockEditor }
