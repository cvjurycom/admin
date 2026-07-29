import { AchievementCardsBlockView } from "@/components/blocks/AchievementCardsBlockView"
import { AtsMatchMapBlockView } from "@/components/blocks/AtsMatchMapBlockView"
import { AtsScoreCardBlockView } from "@/components/blocks/AtsScoreCardBlockView"
import { AtsVisualFlowBlockView } from "@/components/blocks/AtsVisualFlowBlockView"
import { AuthorBioBlockView } from "@/components/blocks/AuthorBioBlockView"
import { BeforeAfterBlockView } from "@/components/blocks/BeforeAfterBlockView"
import { CalloutBlockView } from "@/components/blocks/CalloutBlockView"
import { ChecklistBlockView } from "@/components/blocks/ChecklistBlockView"
import { CitationsBlockView } from "@/components/blocks/CitationsBlockView"
import { CompactScanBlockView } from "@/components/blocks/CompactScanBlockView"
import { CvTemplateShowcaseBlockView } from "@/components/blocks/CvTemplateShowcaseBlockView"
import { DarkCtaBlockView } from "@/components/blocks/DarkCtaBlockView"
import { DosDontsBlockView } from "@/components/blocks/DosDontsBlockView"
import { EditorialTipBlockView } from "@/components/blocks/EditorialTipBlockView"
import { FaqBlockView } from "@/components/blocks/FaqBlockView"
import { FeatureGridBlockView } from "@/components/blocks/FeatureGridBlockView"
import { GuidanceNoteBlockView } from "@/components/blocks/GuidanceNoteBlockView"
import { HeadingBlockView } from "@/components/blocks/HeadingBlockView"
import { ImageBlockView } from "@/components/blocks/ImageBlockView"
import { InfographicStepsBlockView } from "@/components/blocks/InfographicStepsBlockView"
import { InsightsDataBlockView } from "@/components/blocks/InsightsDataBlockView"
import { NumberedItemBlockView } from "@/components/blocks/NumberedItemBlockView"
import { NumberedListBlockView } from "@/components/blocks/NumberedListBlockView"
import { ProofCardsBlockView } from "@/components/blocks/ProofCardsBlockView"
import { PullQuoteBlockView } from "@/components/blocks/PullQuoteBlockView"
import { QuoteBlockView } from "@/components/blocks/QuoteBlockView"
import { RichTextBlockView } from "@/components/blocks/RichTextBlockView"
import { SafeHeadingsBlockView } from "@/components/blocks/SafeHeadingsBlockView"
import { ScanStripBlockView } from "@/components/blocks/ScanStripBlockView"
import { ShortAnswerBlockView } from "@/components/blocks/ShortAnswerBlockView"
import { StatGridBlockView } from "@/components/blocks/StatGridBlockView"
import { StatRowBlockView } from "@/components/blocks/StatRowBlockView"
import { StepFlowBlockView } from "@/components/blocks/StepFlowBlockView"
import { SummaryBlockView } from "@/components/blocks/SummaryBlockView"
import { TableBlockView } from "@/components/blocks/TableBlockView"
import { UpdateLogBlockView } from "@/components/blocks/UpdateLogBlockView"
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
    case "shortAnswer":
      return <ShortAnswerBlockView block={block} />
    case "atsScoreCard":
      return <AtsScoreCardBlockView block={block} />
    case "atsVisualFlow":
      return <AtsVisualFlowBlockView block={block} />
    case "compactScan":
      return <CompactScanBlockView block={block} />
    case "pullQuote":
      return <PullQuoteBlockView block={block} />
    case "beforeAfter":
      return <BeforeAfterBlockView block={block} />
    case "editorialTip":
      return <EditorialTipBlockView block={block} />
    case "atsMatchMap":
      return <AtsMatchMapBlockView block={block} />
    case "safeHeadings":
      return <SafeHeadingsBlockView block={block} />
    case "guidanceNote":
      return <GuidanceNoteBlockView block={block} />
    case "cvTemplateShowcase":
      return <CvTemplateShowcaseBlockView block={block} />
    case "achievementCards":
      return <AchievementCardsBlockView block={block} />
    case "infographicSteps":
      return <InfographicStepsBlockView block={block} />
    case "numberedItem":
      return <NumberedItemBlockView block={block} />
    case "proofCards":
      return <ProofCardsBlockView block={block} />
    case "darkCta":
      return <DarkCtaBlockView block={block} />
    case "faq":
      return <FaqBlockView block={block} />
    case "citations":
      return <CitationsBlockView block={block} />
    case "updateLog":
      return <UpdateLogBlockView block={block} />
    case "insightsData":
      return <InsightsDataBlockView block={block} />
  }
}

export { BlockRenderer }
