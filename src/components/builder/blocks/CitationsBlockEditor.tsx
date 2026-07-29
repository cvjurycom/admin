import { RepeatingRows } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CitationsBlock } from "@/lib/blocks/types"

function CitationsBlockEditor({
  block,
  onChange,
}: {
  block: CitationsBlock
  onChange: (block: CitationsBlock) => void
}) {
  return (
    <RepeatingRows
      items={block.items}
      onChange={(items) => onChange({ ...block, items })}
      createItem={() => ({ org: "", title: "", usage: "", date: "", url: "" })}
      addLabel="Add source"
      renderRow={(item, update) => (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={item.org}
              placeholder="Organisation"
              onChange={(event) =>
                update({ ...item, org: event.target.value })
              }
            />
            <Input
              value={item.date}
              placeholder="Date line (e.g. Date: December 9, 2024.)"
              onChange={(event) =>
                update({ ...item, date: event.target.value })
              }
            />
          </div>
          <Input
            value={item.title}
            placeholder="Title"
            onChange={(event) =>
              update({ ...item, title: event.target.value })
            }
          />
          <Textarea
            value={item.usage}
            placeholder="How it was used"
            onChange={(event) =>
              update({ ...item, usage: event.target.value })
            }
          />
          <Input
            value={item.url}
            placeholder="Source URL (for the View source link)"
            onChange={(event) =>
              update({ ...item, url: event.target.value })
            }
          />
        </div>
      )}
    />
  )
}

export { CitationsBlockEditor }
