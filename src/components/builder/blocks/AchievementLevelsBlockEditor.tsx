import { RepeatingRows } from "@/components/builder/inputs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { AchievementLevelsBlock } from "@/lib/blocks/types"

function AchievementLevelsBlockEditor({
  block,
  onChange,
}: {
  block: AchievementLevelsBlock
  onChange: (block: AchievementLevelsBlock) => void
}) {
  return (
    <RepeatingRows
      items={block.items}
      onChange={(items) => onChange({ ...block, items })}
      createItem={() => ({ label: "", body: "", tone: "strong" as const })}
      addLabel="Add level"
      renderRow={(item, update) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {(["weak", "strong"] as const).map((tone) => (
              <Button
                key={tone}
                type="button"
                variant={item.tone === tone ? "default" : "outline"}
                size="sm"
                onClick={() => update({ ...item, tone })}
              >
                {tone === "weak" ? "Weak" : "Strong"}
              </Button>
            ))}
          </div>
          <Input
            value={item.label}
            placeholder="Label (e.g. Weak, Stronger, Stronger with a verified result)"
            onChange={(event) =>
              update({ ...item, label: event.target.value })
            }
          />
          <Textarea
            value={item.body}
            placeholder="Bullet text"
            onChange={(event) => update({ ...item, body: event.target.value })}
          />
        </div>
      )}
    />
  )
}

export { AchievementLevelsBlockEditor }
