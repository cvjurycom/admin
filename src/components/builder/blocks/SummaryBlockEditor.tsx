import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { SummaryBlock } from "@/lib/blocks/types"

function SummaryBlockEditor({
  block,
  onChange,
}: {
  block: SummaryBlock
  onChange: (block: SummaryBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.label}
        placeholder="Label (e.g. Summary)"
        onChange={(event) => onChange({ ...block, label: event.target.value })}
      />
      <Textarea
        value={block.text}
        placeholder="Summary text"
        onChange={(event) => onChange({ ...block, text: event.target.value })}
      />
      <Label className="flex w-fit items-center gap-2 text-sm font-normal text-[#4A4A4A]">
        <Checkbox
          checked={block.hasMore ?? false}
          onCheckedChange={(checked) =>
            onChange({ ...block, hasMore: checked === true })
          }
        />
        Show &ldquo;… more&rdquo; affordance
      </Label>
    </div>
  )
}

export { SummaryBlockEditor }
