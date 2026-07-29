import { StringListEditor } from "@/components/builder/inputs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { DosDontsBlock } from "@/lib/blocks/types"

function DosDontsBlockEditor({
  block,
  onChange,
}: {
  block: DosDontsBlock
  onChange: (block: DosDontsBlock) => void
}) {
  const layout = block.layout ?? "cards"
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {(["cards", "table"] as const).map((option) => (
          <Button
            key={option}
            type="button"
            variant={layout === option ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ ...block, layout: option })}
          >
            {option === "cards" ? "Cards layout" : "Table layout"}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Dos</Label>
          <StringListEditor
            items={block.dos}
            onChange={(dos) => onChange({ ...block, dos })}
            placeholder="Do this"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Don&apos;ts</Label>
          <StringListEditor
            items={block.donts}
            onChange={(donts) => onChange({ ...block, donts })}
            placeholder="Don't do this"
          />
        </div>
      </div>
    </div>
  )
}

export { DosDontsBlockEditor }
