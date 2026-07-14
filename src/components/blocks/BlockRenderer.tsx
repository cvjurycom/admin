import { AuthorBioBlockView } from "@/components/blocks/AuthorBioBlockView"
import { CalloutBlockView } from "@/components/blocks/CalloutBlockView"
import { ChecklistBlockView } from "@/components/blocks/ChecklistBlockView"
import { DosDontsBlockView } from "@/components/blocks/DosDontsBlockView"
import { FeatureGridBlockView } from "@/components/blocks/FeatureGridBlockView"
import { HeadingBlockView } from "@/components/blocks/HeadingBlockView"
import { ImageBlockView } from "@/components/blocks/ImageBlockView"
import { NumberedListBlockView } from "@/components/blocks/NumberedListBlockView"
import { QuoteBlockView } from "@/components/blocks/QuoteBlockView"
import { RichTextBlockView } from "@/components/blocks/RichTextBlockView"
import { ScanStripBlockView } from "@/components/blocks/ScanStripBlockView"
import { StatGridBlockView } from "@/components/blocks/StatGridBlockView"
import { StatRowBlockView } from "@/components/blocks/StatRowBlockView"
import { StepFlowBlockView } from "@/components/blocks/StepFlowBlockView"
import { SummaryBlockView } from "@/components/blocks/SummaryBlockView"
import { TableBlockView } from "@/components/blocks/TableBlockView"
import type { Block } from "@/lib/blocks/types"

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "richtext":
      return <RichTextBlockView block={block} />
    case "heading":
      return <HeadingBlockView block={block} />
    case "image":
      return <ImageBlockView block={block} />
    case "quote":
      return <QuoteBlockView block={block} />
    case "callout":
      return <CalloutBlockView block={block} />
    case "summary":
      return <SummaryBlockView block={block} />
    case "scanStrip":
      return <ScanStripBlockView block={block} />
    case "statRow":
      return <StatRowBlockView block={block} />
    case "statGrid":
      return <StatGridBlockView block={block} />
    case "dosDonts":
      return <DosDontsBlockView block={block} />
    case "table":
      return <TableBlockView block={block} />
    case "featureGrid":
      return <FeatureGridBlockView block={block} />
    case "checklist":
      return <ChecklistBlockView block={block} />
    case "stepFlow":
      return <StepFlowBlockView block={block} />
    case "numberedList":
      return <NumberedListBlockView block={block} />
    case "authorBio":
      return <AuthorBioBlockView block={block} />
  }
}

export { BlockRenderer }
