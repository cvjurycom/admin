import { RepeatingRows } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import type { EditorialTipBlock } from "@/lib/blocks/types"

function EditorialTipBlockEditor({
  block,
  onChange,
}: {
  block: EditorialTipBlock
  onChange: (block: EditorialTipBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.heading}
        placeholder="Heading"
        onChange={(event) =>
          onChange({ ...block, heading: event.target.value })
        }
      />
      <Input
        value={block.note}
        placeholder="Note"
        onChange={(event) => onChange({ ...block, note: event.target.value })}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={block.leftLabel}
          placeholder="Left column label (e.g. Job Advert)"
          onChange={(event) =>
            onChange({ ...block, leftLabel: event.target.value })
          }
        />
        <Input
          value={block.rightLabel}
          placeholder="Right column label (e.g. Resume Phrase)"
          onChange={(event) =>
            onChange({ ...block, rightLabel: event.target.value })
          }
        />
      </div>
      <RepeatingRows
        items={block.rows}
        onChange={(rows) => onChange({ ...block, rows })}
        createItem={() => ({ left: "", right: "" })}
        addLabel="Add row"
        renderRow={(row, update) => (
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={row.left}
              placeholder="Job advert wording"
              onChange={(event) =>
                update({ ...row, left: event.target.value })
              }
            />
            <Input
              value={row.right}
              placeholder="Resume phrase"
              onChange={(event) =>
                update({ ...row, right: event.target.value })
              }
            />
          </div>
        )}
      />
    </div>
  )
}

export { EditorialTipBlockEditor }
