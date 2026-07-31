import { RepeatingRows } from "@/components/builder/inputs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SafeHeadingsBlock } from "@/lib/blocks/types"

function SafeHeadingsBlockEditor({
  block,
  onChange,
}: {
  block: SafeHeadingsBlock
  onChange: (block: SafeHeadingsBlock) => void
}) {
  const layout = block.layout ?? "colored"
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {(["colored", "alt"] as const).map((option) => (
          <Button
            key={option}
            type="button"
            variant={layout === option ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ ...block, layout: option })}
          >
            {option === "colored" ? "Colored header" : "Icons, plain header"}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={block.safeLabel}
          placeholder="Safe column label"
          onChange={(event) =>
            onChange({ ...block, safeLabel: event.target.value })
          }
        />
        <Input
          value={block.avoidLabel}
          placeholder="Avoid column label"
          onChange={(event) =>
            onChange({ ...block, avoidLabel: event.target.value })
          }
        />
      </div>
      <RepeatingRows
        items={block.rows}
        onChange={(rows) => onChange({ ...block, rows })}
        createItem={() => ({ safe: "", avoid: "" })}
        addLabel="Add pair"
        renderRow={(row, update) => (
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={row.safe}
              placeholder="Safe heading"
              onChange={(event) =>
                update({ ...row, safe: event.target.value })
              }
            />
            <Input
              value={row.avoid}
              placeholder="Avoid this"
              onChange={(event) =>
                update({ ...row, avoid: event.target.value })
              }
            />
          </div>
        )}
      />
    </div>
  )
}

export { SafeHeadingsBlockEditor }
