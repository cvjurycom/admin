import { RepeatingRows } from "@/components/builder/inputs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { InsightsDataBlock } from "@/lib/blocks/types"

function InsightsDataBlockEditor({
  block,
  onChange,
}: {
  block: InsightsDataBlock
  onChange: (block: InsightsDataBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.eyebrow}
        placeholder="Eyebrow (e.g. INSIGHTS FROM THE DATA)"
        onChange={(event) =>
          onChange({ ...block, eyebrow: event.target.value })
        }
      />
      <Textarea
        value={block.description}
        placeholder="Description"
        onChange={(event) =>
          onChange({ ...block, description: event.target.value })
        }
      />
      <RepeatingRows
        items={block.stats}
        onChange={(stats) => onChange({ ...block, stats })}
        createItem={() => ({
          value: "",
          label: "",
          source: "",
          highlighted: false,
        })}
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
                value={stat.source}
                placeholder="Source"
                onChange={(event) =>
                  update({ ...stat, source: event.target.value })
                }
              />
            </div>
            <Input
              value={stat.label}
              placeholder="Label"
              onChange={(event) =>
                update({ ...stat, label: event.target.value })
              }
            />
            <Button
              type="button"
              variant={stat.highlighted ? "default" : "outline"}
              size="sm"
              className="w-fit"
              onClick={() =>
                update({ ...stat, highlighted: !stat.highlighted })
              }
            >
              {stat.highlighted ? "Highlighted" : "Normal"}
            </Button>
          </div>
        )}
      />
      <Textarea
        value={block.quote}
        placeholder="Pull quote (optional)"
        onChange={(event) => onChange({ ...block, quote: event.target.value })}
      />
      <Input
        value={block.quoteSource}
        placeholder="Quote source (optional)"
        onChange={(event) =>
          onChange({ ...block, quoteSource: event.target.value })
        }
      />
    </div>
  )
}

export { InsightsDataBlockEditor }
