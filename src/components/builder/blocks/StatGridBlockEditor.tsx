import { RepeatingRows } from "@/components/builder/inputs"
import { Button } from "@/components/ui/button"
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
      createItem={() => ({ value: "", label: "", variant: "green" as const })}
      addLabel="Add stat"
      renderRow={(stat, update) => (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
          <div className="flex items-center gap-2">
            {(["green", "orange"] as const).map((variant) => (
              <Button
                key={variant}
                type="button"
                variant={
                  (stat.variant ?? "green") === variant ? "default" : "outline"
                }
                size="sm"
                onClick={() => update({ ...stat, variant })}
              >
                {variant === "green" ? "Green" : "Orange"}
              </Button>
            ))}
          </div>
        </div>
      )}
    />
  )
}

export { StatGridBlockEditor }
