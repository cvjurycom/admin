import { RepeatingRows } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import type { StatGridBlock } from "@/lib/blocks/types"

function StatGridBlockEditor({
  block,
  onChange,
}: {
  block: StatGridBlock
  onChange: (block: StatGridBlock) => void
}) {
  return (
    <RepeatingRows
      items={block.stats}
      onChange={(stats) => onChange({ ...block, stats })}
      createItem={() => ({ value: "", label: "", source: "" })}
      addLabel="Add stat"
      renderRow={(stat, update) => (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Input
            value={stat.value}
            placeholder="47%"
            onChange={(event) =>
              update({ ...stat, value: event.target.value })
            }
          />
          <Input
            value={stat.label}
            placeholder="ATS score boost"
            onChange={(event) =>
              update({ ...stat, label: event.target.value })
            }
          />
          <Input
            value={stat.source}
            placeholder="Source (optional)"
            onChange={(event) =>
              update({ ...stat, source: event.target.value })
            }
          />
        </div>
      )}
    />
  )
}

export { StatGridBlockEditor }
