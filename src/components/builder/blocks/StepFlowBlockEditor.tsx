import { RepeatingRows } from "@/components/builder/inputs"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
      <Label className="flex w-fit items-center gap-2 text-sm font-normal text-[#4A4A4A]">
        <Checkbox
          checked={block.showStepNumbers ?? true}
          onCheckedChange={(checked) =>
            onChange({ ...block, showStepNumbers: checked === true })
          }
        />
        Show step numbering
      </Label>
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
