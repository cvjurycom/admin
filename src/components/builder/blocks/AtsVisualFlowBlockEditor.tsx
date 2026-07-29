import { StringListEditor } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AtsVisualFlowBlock } from "@/lib/blocks/types"

function AtsVisualFlowBlockEditor({
  block,
  onChange,
}: {
  block: AtsVisualFlowBlock
  onChange: (block: AtsVisualFlowBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <Label>Score (0–100)</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={block.score}
            onChange={(event) =>
              onChange({ ...block, score: Number(event.target.value) })
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Panel label</Label>
          <Input
            value={block.label}
            onChange={(event) =>
              onChange({ ...block, label: event.target.value })
            }
          />
        </div>
      </div>
      <Input
        value={block.status}
        placeholder="Status badge text (e.g. Parsed Clearly)"
        onChange={(event) => onChange({ ...block, status: event.target.value })}
      />
      <Input
        value={block.nextStep}
        placeholder="Next step label (e.g. Human review)"
        onChange={(event) =>
          onChange({ ...block, nextStep: event.target.value })
        }
      />
      <div className="flex flex-col gap-2">
        <Label>Description tags</Label>
        <StringListEditor
          items={block.tags}
          onChange={(tags) => onChange({ ...block, tags })}
          placeholder="Clear proof"
        />
      </div>
    </div>
  )
}

export { AtsVisualFlowBlockEditor }
