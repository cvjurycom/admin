import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CompactScanBlock } from "@/lib/blocks/types"

function CompactScanBlockEditor({
  block,
  onChange,
}: {
  block: CompactScanBlock
  onChange: (block: CompactScanBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.label}
        placeholder="Label (e.g. ATS Scan)"
        onChange={(event) => onChange({ ...block, label: event.target.value })}
      />
      <Input
        value={block.status}
        placeholder="Status (e.g. Passed Clearly)"
        onChange={(event) => onChange({ ...block, status: event.target.value })}
      />
      <Input
        value={block.nextStep}
        placeholder="Next step (e.g. human review)"
        onChange={(event) =>
          onChange({ ...block, nextStep: event.target.value })
        }
      />
      <Textarea
        value={block.description}
        placeholder="Description"
        onChange={(event) =>
          onChange({ ...block, description: event.target.value })
        }
      />
    </div>
  )
}

export { CompactScanBlockEditor }
