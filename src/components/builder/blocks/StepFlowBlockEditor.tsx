import { RepeatingRows } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { StepFlowBlock } from "@/lib/blocks/types"

function StepFlowBlockEditor({
  block,
  onChange,
}: {
  block: StepFlowBlock
  onChange: (block: StepFlowBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.title}
        placeholder="Title (optional)"
        onChange={(event) => onChange({ ...block, title: event.target.value })}
      />
      <RepeatingRows
        items={block.steps}
        onChange={(steps) => onChange({ ...block, steps })}
        createItem={() => ({ title: "", description: "" })}
        addLabel="Add step"
        renderRow={(step, update) => (
          <div className="flex flex-col gap-2">
            <Input
              value={step.title}
              placeholder="Step title"
              onChange={(event) =>
                update({ ...step, title: event.target.value })
              }
            />
            <Textarea
              value={step.description}
              placeholder="Description"
              onChange={(event) =>
                update({ ...step, description: event.target.value })
              }
            />
          </div>
        )}
      />
    </div>
  )
}

export { StepFlowBlockEditor }
