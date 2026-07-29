import { RepeatingRows } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { ProofCardsBlock } from "@/lib/blocks/types"

function ProofCardsBlockEditor({
  block,
  onChange,
}: {
  block: ProofCardsBlock
  onChange: (block: ProofCardsBlock) => void
}) {
  return (
    <RepeatingRows
      items={block.cards}
      onChange={(cards) => onChange({ ...block, cards })}
      createItem={() => ({ type: "", value: "", description: "" })}
      addLabel="Add card"
      renderRow={(card, update) => (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={card.type}
              placeholder="Type label (e.g. TIME)"
              onChange={(event) =>
                update({ ...card, type: event.target.value })
              }
            />
            <Input
              value={card.value}
              placeholder="Value (e.g. 90 min)"
              onChange={(event) =>
                update({ ...card, value: event.target.value })
              }
            />
          </div>
          <Textarea
            value={card.description}
            placeholder="Description"
            onChange={(event) =>
              update({ ...card, description: event.target.value })
            }
          />
        </div>
      )}
    />
  )
}

export { ProofCardsBlockEditor }
