import { AuthorBioBlockEditor } from "@/components/builder/blocks/AuthorBioBlockEditor"
import { CalloutBlockEditor } from "@/components/builder/blocks/CalloutBlockEditor"
import { ChecklistBlockEditor } from "@/components/builder/blocks/ChecklistBlockEditor"
import { DosDontsBlockEditor } from "@/components/builder/blocks/DosDontsBlockEditor"
import { FeatureGridBlockEditor } from "@/components/builder/blocks/FeatureGridBlockEditor"
import { HeadingBlockEditor } from "@/components/builder/blocks/HeadingBlockEditor"
import { ImageBlockEditor } from "@/components/builder/blocks/ImageBlockEditor"
import { NumberedListBlockEditor } from "@/components/builder/blocks/NumberedListBlockEditor"
import { QuoteBlockEditor } from "@/components/builder/blocks/QuoteBlockEditor"
import { RichTextBlockEditor } from "@/components/builder/blocks/RichTextBlockEditor"
import { ScanStripBlockEditor } from "@/components/builder/blocks/ScanStripBlockEditor"
import { StatGridBlockEditor } from "@/components/builder/blocks/StatGridBlockEditor"
import { StatRowBlockEditor } from "@/components/builder/blocks/StatRowBlockEditor"
import { StepFlowBlockEditor } from "@/components/builder/blocks/StepFlowBlockEditor"
import { SummaryBlockEditor } from "@/components/builder/blocks/SummaryBlockEditor"
import { TableBlockEditor } from "@/components/builder/blocks/TableBlockEditor"
import type { Block } from "@/lib/blocks/types"

function BlockEditor({
  block,
  onChange,
}: {
  block: Block
  onChange: (block: Block) => void
}) {
  switch (block.type) {
    case "richtext":
      return <RichTextBlockEditor block={block} onChange={onChange} />
    case "heading":
      return <HeadingBlockEditor block={block} onChange={onChange} />
    case "image":
      return <ImageBlockEditor block={block} onChange={onChange} />
    case "quote":
      return <QuoteBlockEditor block={block} onChange={onChange} />
    case "callout":
      return <CalloutBlockEditor block={block} onChange={onChange} />
    case "summary":
      return <SummaryBlockEditor block={block} onChange={onChange} />
    case "scanStrip":
      return <ScanStripBlockEditor block={block} onChange={onChange} />
    case "statRow":
      return <StatRowBlockEditor block={block} onChange={onChange} />
    case "statGrid":
      return <StatGridBlockEditor block={block} onChange={onChange} />
    case "dosDonts":
      return <DosDontsBlockEditor block={block} onChange={onChange} />
    case "table":
      return <TableBlockEditor block={block} onChange={onChange} />
    case "featureGrid":
      return <FeatureGridBlockEditor block={block} onChange={onChange} />
    case "checklist":
      return <ChecklistBlockEditor block={block} onChange={onChange} />
    case "stepFlow":
      return <StepFlowBlockEditor block={block} onChange={onChange} />
    case "numberedList":
      return <NumberedListBlockEditor block={block} onChange={onChange} />
    case "authorBio":
      return <AuthorBioBlockEditor block={block} onChange={onChange} />
  }
}

export { BlockEditor }
