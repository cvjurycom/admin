import { RepeatingRows } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { AchievementCardsBlock } from "@/lib/blocks/types"

function AchievementCardsBlockEditor({
  block,
  onChange,
}: {
  block: AchievementCardsBlock
  onChange: (block: AchievementCardsBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={block.weakLabel}
          placeholder="Weak column label"
          onChange={(event) =>
            onChange({ ...block, weakLabel: event.target.value })
          }
        />
        <Input
          value={block.strongLabel}
          placeholder="Strong column label"
          onChange={(event) =>
            onChange({ ...block, strongLabel: event.target.value })
          }
        />
      </div>
      <RepeatingRows
        items={block.pairs}
        onChange={(pairs) => onChange({ ...block, pairs })}
        createItem={() => ({ weak: "", strong: "" })}
        addLabel="Add pair"
        renderRow={(pair, update) => (
          <div className="flex flex-col gap-2">
            <Textarea
              value={pair.weak}
              placeholder="Weak duty (before)"
              onChange={(event) =>
                update({ ...pair, weak: event.target.value })
              }
            />
            <Textarea
              value={pair.strong}
              placeholder="Strong achievement (after)"
              onChange={(event) =>
                update({ ...pair, strong: event.target.value })
              }
            />
          </div>
        )}
      />
    </div>
  )
}

export { AchievementCardsBlockEditor }
