import { InlineRichTextInput, StringListEditor } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BeforeAfterBlock } from "@/lib/blocks/types"

function BeforeAfterBlockEditor({
  block,
  onChange,
}: {
  block: BeforeAfterBlock
  onChange: (block: BeforeAfterBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.title}
        placeholder="Title (optional)"
        onChange={(event) => onChange({ ...block, title: event.target.value })}
      />
      <Input
        value={block.subtitle}
        placeholder="Subtitle (optional)"
        onChange={(event) =>
          onChange({ ...block, subtitle: event.target.value })
        }
      />
      <div className="flex flex-col gap-2">
        <Label>Before</Label>
        <InlineRichTextInput
          value={block.beforeText}
          placeholder="Before text"
          onChange={(beforeText) => onChange({ ...block, beforeText })}
        />
        <Input
          value={block.beforeNote}
          placeholder="Before note"
          onChange={(event) =>
            onChange({ ...block, beforeNote: event.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>After</Label>
        <InlineRichTextInput
          value={block.afterText}
          placeholder="After text"
          onChange={(afterText) => onChange({ ...block, afterText })}
        />
        <StringListEditor
          items={block.afterTags}
          onChange={(afterTags) => onChange({ ...block, afterTags })}
          placeholder="Tag"
          addLabel="Add tag"
        />
      </div>
    </div>
  )
}

export { BeforeAfterBlockEditor }
