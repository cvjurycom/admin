import { RepeatingRows } from "@/components/builder/inputs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { InfographicStepsBlock } from "@/lib/blocks/types"

function InfographicStepsBlockEditor({
  block,
  onChange,
}: {
  block: InfographicStepsBlock
  onChange: (block: InfographicStepsBlock) => void
}) {
  const layout = block.layout ?? "cards"
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {(["cards", "flow"] as const).map((option) => (
          <Button
            key={option}
            type="button"
            variant={layout === option ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ ...block, layout: option })}
          >
            {option === "cards" ? "Badge-in-card" : "Connected step flow"}
          </Button>
        ))}
      </div>
      <Input
        value={block.eyebrow}
        placeholder="Eyebrow (e.g. INFOGRAPHIC)"
        onChange={(event) =>
          onChange({ ...block, eyebrow: event.target.value })
        }
      />
      <Input
        value={block.title}
        placeholder="Title"
        onChange={(event) => onChange({ ...block, title: event.target.value })}
      />
      <RepeatingRows
        items={block.steps}
        onChange={(steps) => onChange({ ...block, steps })}
        createItem={() => ({ number: "", title: "", body: "" })}
        addLabel="Add step"
        renderRow={(step, update) => (
          <div className="flex flex-col gap-2">
            <Input
              value={step.number}
              placeholder="Number (e.g. 1)"
              onChange={(event) =>
                update({ ...step, number: event.target.value })
              }
            />
            <Input
              value={step.title}
              placeholder="Step title"
              onChange={(event) =>
                update({ ...step, title: event.target.value })
              }
            />
            <Textarea
              value={step.body}
              placeholder="Step description"
              onChange={(event) =>
                update({ ...step, body: event.target.value })
              }
            />
          </div>
        )}
      />
      <Input
        value={block.result}
        placeholder="Result label (optional)"
        onChange={(event) => onChange({ ...block, result: event.target.value })}
      />
    </div>
  )
}

export { InfographicStepsBlockEditor }
