import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { GuidanceNoteBlock } from "@/lib/blocks/types"

function GuidanceNoteBlockEditor({
  block,
  onChange,
}: {
  block: GuidanceNoteBlock
  onChange: (block: GuidanceNoteBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {(["tip", "warning"] as const).map((tone) => (
          <Button
            key={tone}
            type="button"
            variant={block.tone === tone ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ ...block, tone })}
          >
            {tone === "tip" ? "Tip" : "Warning"}
          </Button>
        ))}
      </div>
      <Textarea
        value={block.text}
        placeholder="Message"
        onChange={(event) => onChange({ ...block, text: event.target.value })}
      />
    </div>
  )
}

export { GuidanceNoteBlockEditor }
