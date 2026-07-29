import { RepeatingRows } from "@/components/builder/inputs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { AtsMatchMapBlock } from "@/lib/blocks/types"

function AtsMatchMapBlockEditor({
  block,
  onChange,
}: {
  block: AtsMatchMapBlock
  onChange: (block: AtsMatchMapBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.title}
        placeholder="Title (e.g. ATS MATCH MAP)"
        onChange={(event) => onChange({ ...block, title: event.target.value })}
      />
      <Input
        value={block.subtitle}
        placeholder="Subtitle"
        onChange={(event) =>
          onChange({ ...block, subtitle: event.target.value })
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
        items={block.signals}
        onChange={(signals) => onChange({ ...block, signals })}
        createItem={() => ({ title: "", body: "", wide: false })}
        addLabel="Add signal"
        renderRow={(signal, update) => (
          <div className="flex flex-col gap-2">
            <Input
              value={signal.title}
              placeholder="Signal title"
              onChange={(event) =>
                update({ ...signal, title: event.target.value })
              }
            />
            <Textarea
              value={signal.body}
              placeholder="Signal description"
              onChange={(event) =>
                update({ ...signal, body: event.target.value })
              }
            />
            <Button
              type="button"
              variant={signal.wide ? "default" : "outline"}
              size="sm"
              className="w-fit"
              onClick={() => update({ ...signal, wide: !signal.wide })}
            >
              {signal.wide ? "Wide card" : "Narrow card"}
            </Button>
          </div>
        )}
      />
    </div>
  )
}

export { AtsMatchMapBlockEditor }
