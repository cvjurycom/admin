import { RepeatingRows } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { TableBlock } from "@/lib/blocks/types"

function TableBlockEditor({
  block,
  onChange,
}: {
  block: TableBlock
  onChange: (block: TableBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <Label>Column 1 header</Label>
          <Input
            value={block.headers[0]}
            onChange={(event) =>
              onChange({
                ...block,
                headers: [event.target.value, block.headers[1]],
              })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Column 2 header</Label>
          <Input
            value={block.headers[1]}
            onChange={(event) =>
              onChange({
                ...block,
                headers: [block.headers[0], event.target.value],
              })
            }
          />
        </div>
      </div>
      <RepeatingRows
        items={block.rows}
        onChange={(rows) => onChange({ ...block, rows })}
        createItem={() => ["", ""] as [string, string]}
        addLabel="Add row"
        renderRow={(row, update) => (
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={row[0]}
              onChange={(event) => update([event.target.value, row[1]])}
            />
            <Input
              value={row[1]}
              onChange={(event) => update([row[0], event.target.value])}
            />
          </div>
        )}
      />
    </div>
  )
}

export { TableBlockEditor }
