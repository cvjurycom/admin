import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { DarkCtaBlock } from "@/lib/blocks/types"

function DarkCtaBlockEditor({
  block,
  onChange,
}: {
  block: DarkCtaBlock
  onChange: (block: DarkCtaBlock) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Input
        value={block.badge}
        placeholder="Badge text"
        onChange={(event) => onChange({ ...block, badge: event.target.value })}
      />
      <Textarea
        value={block.title}
        placeholder="Headline"
        onChange={(event) => onChange({ ...block, title: event.target.value })}
      />
      <Textarea
        value={block.body}
        placeholder="Body text"
        onChange={(event) => onChange({ ...block, body: event.target.value })}
      />
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={block.primaryCta}
          placeholder="Primary button"
          onChange={(event) =>
            onChange({ ...block, primaryCta: event.target.value })
          }
        />
        <Input
          value={block.secondaryCta}
          placeholder="Secondary button"
          onChange={(event) =>
            onChange({ ...block, secondaryCta: event.target.value })
          }
        />
      </div>
      <Input
        value={block.bestNextStepLabel}
        placeholder="Best next step label (e.g. Best Next Step)"
        onChange={(event) =>
          onChange({ ...block, bestNextStepLabel: event.target.value })
        }
      />
      <Textarea
        value={block.bestNextStep}
        placeholder="Best next step"
        onChange={(event) =>
          onChange({ ...block, bestNextStep: event.target.value })
        }
      />
      <Input
        value={block.tagline}
        placeholder="Tagline"
        onChange={(event) => onChange({ ...block, tagline: event.target.value })}
      />
    </div>
  )
}

export { DarkCtaBlockEditor }
