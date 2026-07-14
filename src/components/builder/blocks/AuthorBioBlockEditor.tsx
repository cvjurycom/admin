import { StringListEditor } from "@/components/builder/inputs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AuthorBioBlock } from "@/lib/blocks/types"

function AuthorBioBlockEditor({
  block,
  onChange,
}: {
  block: AuthorBioBlock
  onChange: (block: AuthorBioBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Input
          value={block.name}
          placeholder="Name"
          onChange={(event) => onChange({ ...block, name: event.target.value })}
        />
        <Input
          value={block.title}
          placeholder="Title (e.g. Senior Career Strategist)"
          onChange={(event) =>
            onChange({ ...block, title: event.target.value })
          }
        />
      </div>
      <Input
        value={block.avatarUrl}
        placeholder="Avatar URL (optional)"
        onChange={(event) =>
          onChange({ ...block, avatarUrl: event.target.value })
        }
      />
      <Textarea
        value={block.bio}
        placeholder="Bio"
        onChange={(event) => onChange({ ...block, bio: event.target.value })}
      />
      <div className="flex flex-col gap-2">
        <Label>Badges</Label>
        <StringListEditor
          items={block.badges}
          onChange={(badges) => onChange({ ...block, badges })}
          placeholder="CPRW Certified"
          addLabel="Add badge"
        />
      </div>
    </div>
  )
}

export { AuthorBioBlockEditor }
