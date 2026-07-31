import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ScanStripBlock } from "@/lib/blocks/types"

function ScanStripBlockEditor({
  block,
  onChange,
}: {
  block: ScanStripBlock
  onChange: (block: ScanStripBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Textarea
        value={block.badgeText}
        placeholder={"Badge text (e.g. \"ATS\\nScan\")"}
        onChange={(event) =>
          onChange({ ...block, badgeText: event.target.value })
        }
      />
      <Input
        value={block.title}
        placeholder="Title (e.g. Parsed Clearly)"
        onChange={(event) => onChange({ ...block, title: event.target.value })}
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

export { ScanStripBlockEditor }
