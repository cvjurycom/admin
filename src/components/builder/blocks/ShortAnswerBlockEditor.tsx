import { RepeatingRows } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ShortAnswerBlock } from "@/lib/blocks/types"

function ShortAnswerBlockEditor({
  block,
  onChange,
}: {
  block: ShortAnswerBlock
  onChange: (block: ShortAnswerBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.title}
        placeholder="Title (e.g. The Short Answer)"
        onChange={(event) => onChange({ ...block, title: event.target.value })}
      />
      <Textarea
        value={block.body}
        placeholder="Body text"
        onChange={(event) => onChange({ ...block, body: event.target.value })}
      />
      <RepeatingRows
        items={block.cards}
        onChange={(cards) => onChange({ ...block, cards })}
        createItem={() => ({ heading: "", body: "" })}
        addLabel="Add outcome card"
        renderRow={(card, update) => (
          <div className="flex flex-col gap-2">
            <Input
              value={card.heading}
              placeholder="Card heading"
              onChange={(event) =>
                update({ ...card, heading: event.target.value })
              }
            />
            <Textarea
              value={card.body}
              placeholder="Card text"
              onChange={(event) =>
                update({ ...card, body: event.target.value })
              }
            />
          </div>
        )}
      />
    </div>
  )
}

export { ShortAnswerBlockEditor }
