import { StringListEditor } from "@/components/builder/inputs"
import { Label } from "@/components/ui/label"
import type { DosDontsBlock } from "@/lib/blocks/types"

function DosDontsBlockEditor({
  block,
  onChange,
}: {
  block: DosDontsBlock
  onChange: (block: DosDontsBlock) => void
}) {
  return (
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
  )
}

export { DosDontsBlockEditor }
