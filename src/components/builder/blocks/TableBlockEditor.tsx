import { Plus, X } from "lucide-react"

import { RepeatingRows } from "@/components/builder/inputs"
import { Button } from "@/components/ui/button"
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
  const columnCount = block.headers.length

  const updateHeader = (index: number, value: string) => {
    onChange({
      ...block,
      headers: block.headers.map((h, i) => (i === index ? value : h)),
    })
  }

  const addColumn = () => {
    onChange({
      ...block,
      headers: [...block.headers, ""],
      rows: block.rows.map((row) => [...row, ""]),
    })
  }

  const removeColumn = (index: number) => {
    if (columnCount <= 1) {
      return
    }
    onChange({
      ...block,
      headers: block.headers.filter((_, i) => i !== index),
      rows: block.rows.map((row) => row.filter((_, i) => i !== index)),
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label>Columns</Label>
        <div className="flex flex-col gap-2">
          {block.headers.map((header, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={header}
                placeholder={`Column ${index + 1} header`}
                onChange={(event) => updateHeader(index, event.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={columnCount <= 1}
                onClick={() => removeColumn(index)}
                aria-label="Remove column"
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addColumn}
          className="w-fit"
        >
          <Plus className="size-4" />
          Add column
        </Button>
      </div>
      <RepeatingRows
        items={block.rows}
        onChange={(rows) => onChange({ ...block, rows })}
        createItem={() => Array(columnCount).fill("")}
        addLabel="Add row"
        renderRow={(row, update) => (
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
            }}
          >
            {row.map((cell, cellIndex) => (
              <Input
                key={cellIndex}
                value={cell}
                onChange={(event) =>
                  update(
                    row.map((c, i) =>
                      i === cellIndex ? event.target.value : c
                    )
                  )
                }
              />
            ))}
          </div>
        )}
      />
    </div>
  )
}

export { TableBlockEditor }
