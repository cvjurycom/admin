import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { HeadingBlock } from "@/lib/blocks/types"

function HeadingBlockEditor({
  block,
  onChange,
}: {
  block: HeadingBlock
  onChange: (block: HeadingBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {([2, 3] as const).map((level) => (
          <Button
            key={level}
            type="button"
            variant={block.level === level ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ ...block, level })}
          >
            H{level}
          </Button>
        ))}
      </div>
      <Input
        value={block.text}
        placeholder="Heading text"
        onChange={(event) => onChange({ ...block, text: event.target.value })}
      />
    </div>
  )
}

export { HeadingBlockEditor }
