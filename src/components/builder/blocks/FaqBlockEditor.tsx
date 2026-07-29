import { RepeatingRows } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { FaqBlock } from "@/lib/blocks/types"

function FaqBlockEditor({
  block,
  onChange,
}: {
  block: FaqBlock
  onChange: (block: FaqBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.title}
        placeholder="Section title"
        onChange={(event) => onChange({ ...block, title: event.target.value })}
      />
      <RepeatingRows
        items={block.items}
        onChange={(items) => onChange({ ...block, items })}
        createItem={() => ({ question: "", answer: "" })}
        addLabel="Add question"
        renderRow={(item, update) => (
          <div className="flex flex-col gap-2">
            <Input
              value={item.question}
              placeholder="Question"
              onChange={(event) =>
                update({ ...item, question: event.target.value })
              }
            />
            <Textarea
              value={item.answer}
              placeholder="Answer"
              onChange={(event) =>
                update({ ...item, answer: event.target.value })
              }
            />
          </div>
        )}
      />
    </div>
  )
}

export { FaqBlockEditor }
