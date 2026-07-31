import { AchievementCardsBlockEditor } from "@/components/builder/blocks/AchievementCardsBlockEditor"
import { AchievementLevelsBlockEditor } from "@/components/builder/blocks/AchievementLevelsBlockEditor"
import { AtsMatchMapBlockEditor } from "@/components/builder/blocks/AtsMatchMapBlockEditor"
import { AtsScoreCardBlockEditor } from "@/components/builder/blocks/AtsScoreCardBlockEditor"
import { AtsVisualFlowBlockEditor } from "@/components/builder/blocks/AtsVisualFlowBlockEditor"
import { AuthorBioBlockEditor } from "@/components/builder/blocks/AuthorBioBlockEditor"
import { BeforeAfterBlockEditor } from "@/components/builder/blocks/BeforeAfterBlockEditor"
import { CalloutBlockEditor } from "@/components/builder/blocks/CalloutBlockEditor"
import { ChecklistBlockEditor } from "@/components/builder/blocks/ChecklistBlockEditor"
import { CitationsBlockEditor } from "@/components/builder/blocks/CitationsBlockEditor"
import { CompactScanBlockEditor } from "@/components/builder/blocks/CompactScanBlockEditor"
import { CvTemplateShowcaseBlockEditor } from "@/components/builder/blocks/CvTemplateShowcaseBlockEditor"
import { DarkCtaBlockEditor } from "@/components/builder/blocks/DarkCtaBlockEditor"
import { DosDontsBlockEditor } from "@/components/builder/blocks/DosDontsBlockEditor"
import { EditorialTipBlockEditor } from "@/components/builder/blocks/EditorialTipBlockEditor"
import { FaqBlockEditor } from "@/components/builder/blocks/FaqBlockEditor"
import { FeatureGridBlockEditor } from "@/components/builder/blocks/FeatureGridBlockEditor"
import { GuidanceNoteBlockEditor } from "@/components/builder/blocks/GuidanceNoteBlockEditor"
import { HeadingBlockEditor } from "@/components/builder/blocks/HeadingBlockEditor"
import { ImageBlockEditor } from "@/components/builder/blocks/ImageBlockEditor"
import { InfographicStepsBlockEditor } from "@/components/builder/blocks/InfographicStepsBlockEditor"
import { InsightsDataBlockEditor } from "@/components/builder/blocks/InsightsDataBlockEditor"
import { NumberedItemBlockEditor } from "@/components/builder/blocks/NumberedItemBlockEditor"
import { NumberedListBlockEditor } from "@/components/builder/blocks/NumberedListBlockEditor"
import { ProofCardsBlockEditor } from "@/components/builder/blocks/ProofCardsBlockEditor"
import { PullQuoteBlockEditor } from "@/components/builder/blocks/PullQuoteBlockEditor"
import { QuoteBlockEditor } from "@/components/builder/blocks/QuoteBlockEditor"
import { RichTextBlockEditor } from "@/components/builder/blocks/RichTextBlockEditor"
import { SafeHeadingsBlockEditor } from "@/components/builder/blocks/SafeHeadingsBlockEditor"
import { ScanStripBlockEditor } from "@/components/builder/blocks/ScanStripBlockEditor"
import { ShortAnswerBlockEditor } from "@/components/builder/blocks/ShortAnswerBlockEditor"
import { StatGridBlockEditor } from "@/components/builder/blocks/StatGridBlockEditor"
import { StatRowBlockEditor } from "@/components/builder/blocks/StatRowBlockEditor"
import { StepFlowBlockEditor } from "@/components/builder/blocks/StepFlowBlockEditor"
import { SummaryBlockEditor } from "@/components/builder/blocks/SummaryBlockEditor"
import { TableBlockEditor } from "@/components/builder/blocks/TableBlockEditor"
import { UpdateLogBlockEditor } from "@/components/builder/blocks/UpdateLogBlockEditor"
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
    case "shortAnswer":
      return <ShortAnswerBlockEditor block={block} onChange={onChange} />
    case "atsScoreCard":
      return <AtsScoreCardBlockEditor block={block} onChange={onChange} />
    case "atsVisualFlow":
      return <AtsVisualFlowBlockEditor block={block} onChange={onChange} />
    case "compactScan":
      return <CompactScanBlockEditor block={block} onChange={onChange} />
    case "pullQuote":
      return <PullQuoteBlockEditor block={block} onChange={onChange} />
    case "beforeAfter":
      return <BeforeAfterBlockEditor block={block} onChange={onChange} />
    case "editorialTip":
      return <EditorialTipBlockEditor block={block} onChange={onChange} />
    case "atsMatchMap":
      return <AtsMatchMapBlockEditor block={block} onChange={onChange} />
    case "safeHeadings":
      return <SafeHeadingsBlockEditor block={block} onChange={onChange} />
    case "guidanceNote":
      return <GuidanceNoteBlockEditor block={block} onChange={onChange} />
    case "cvTemplateShowcase":
      return <CvTemplateShowcaseBlockEditor block={block} onChange={onChange} />
    case "achievementCards":
      return <AchievementCardsBlockEditor block={block} onChange={onChange} />
    case "achievementLevels":
      return <AchievementLevelsBlockEditor block={block} onChange={onChange} />
    case "infographicSteps":
      return <InfographicStepsBlockEditor block={block} onChange={onChange} />
    case "numberedItem":
      return <NumberedItemBlockEditor block={block} onChange={onChange} />
    case "proofCards":
      return <ProofCardsBlockEditor block={block} onChange={onChange} />
    case "darkCta":
      return <DarkCtaBlockEditor block={block} onChange={onChange} />
    case "faq":
      return <FaqBlockEditor block={block} onChange={onChange} />
    case "citations":
      return <CitationsBlockEditor block={block} onChange={onChange} />
    case "updateLog":
      return <UpdateLogBlockEditor block={block} onChange={onChange} />
    case "insightsData":
      return <InsightsDataBlockEditor block={block} onChange={onChange} />
  }
}

export { BlockEditor }
