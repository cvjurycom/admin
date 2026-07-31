import {
  AlertTriangle,
  AlignLeft,
  Award,
  BarChart3,
  BookMarked,
  BookOpen,
  CheckSquare,
  Columns,
  GitBranch,
  GitCompare,
  Hash,
  Heading as HeadingIcon,
  HelpCircle,
  Image as ImageIcon,
  LayoutGrid,
  LayoutTemplate,
  Lightbulb,
  ListChecks,
  ListOrdered,
  Map,
  Megaphone,
  MessageCircle,
  Monitor,
  Quote as QuoteIcon,
  RefreshCw,
  ScanEye,
  ScanLine,
  Sparkles,
  Table2,
  Target,
  TrendingUp,
  Trophy,
  User,
  Workflow,
  type LucideIcon,
} from "lucide-react"

type BlockBase = { id: string }

export type RichTextBlock = BlockBase & { type: "richtext"; html: string }
export type HeadingBlock = BlockBase & {
  type: "heading"
  text: string
  level: 2 | 3
}
export type ImageBlock = BlockBase & {
  type: "image"
  src: string
  alt: string
  caption: string
}
export type QuoteBlock = BlockBase & {
  type: "quote"
  text: string
  source: string
}
export type CalloutBlock = BlockBase & {
  type: "callout"
  title: string
  items: string[]
}
export type SummaryBlock = BlockBase & {
  type: "summary"
  label: string
  text: string
  hasMore?: boolean
}
export type ScanStripBlock = BlockBase & {
  type: "scanStrip"
  badgeText: string
  title: string
  description: string
}
export type StatRowBlock = BlockBase & {
  type: "statRow"
  stats: { value: string; label: string; color: string }[]
}
export type StatGridBlock = BlockBase & {
  type: "statGrid"
  stats: { value: string; label: string; variant?: "green" | "orange" }[]
}
export type DosDontsBlock = BlockBase & {
  type: "dosDonts"
  dos: string[]
  donts: string[]
  layout?: "table" | "cards"
}
export type TableBlock = BlockBase & {
  type: "table"
  headers: string[]
  rows: string[][]
}
export type FeatureGridBlock = BlockBase & {
  type: "featureGrid"
  items: { title: string; description: string }[]
}
export type ChecklistBlock = BlockBase & {
  type: "checklist"
  title: string
  items: string[]
}
export type StepFlowBlock = BlockBase & {
  type: "stepFlow"
  title: string
  steps: { title: string; description: string }[]
}
export type NumberedListBlock = BlockBase & {
  type: "numberedList"
  items: { title: string; description: string }[]
}
export type AuthorBioBlock = BlockBase & {
  type: "authorBio"
  name: string
  title: string
  avatarUrl: string
  bio: string
  bioLinkLabel: string
  bioLinkUrl: string
  badges: string[]
  links?: { label: string; url: string }[]
}

export type ShortAnswerBlock = BlockBase & {
  type: "shortAnswer"
  title: string
  body: string
  cards: { heading: string; body: string }[]
}
export type AtsScoreCardBlock = BlockBase & {
  type: "atsScoreCard"
  url: string
  badge: string
  imageSrc: string
  imageAlt: string
}
export type AtsVisualFlowBlock = BlockBase & {
  type: "atsVisualFlow"
  score: number
  label: string
  nextStep: string
  tags: string[]
  status: string
}
export type CompactScanBlock = BlockBase & {
  type: "compactScan"
  label: string
  status: string
  nextStep: string
  description: string
}
export type PullQuoteBlock = BlockBase & {
  type: "pullQuote"
  quote: string
  attribution: string
}
export type BeforeAfterBlock = BlockBase & {
  type: "beforeAfter"
  title: string
  subtitle: string
  beforeText: string
  beforeNote: string
  afterText: string
  afterTags: string[]
}
export type EditorialTipBlock = BlockBase & {
  type: "editorialTip"
  heading: string
  note: string
  leftLabel: string
  rightLabel: string
  rows: { left: string; right: string }[]
}
export type AtsMatchMapBlock = BlockBase & {
  type: "atsMatchMap"
  title: string
  subtitle: string
  description: string
  signals: { title: string; body: string; wide?: boolean }[]
}
export type SafeHeadingsBlock = BlockBase & {
  type: "safeHeadings"
  safeLabel: string
  avoidLabel: string
  rows: { safe: string; avoid: string }[]
  layout?: "colored" | "alt"
}
export type GuidanceNoteBlock = BlockBase & {
  type: "guidanceNote"
  tone: "tip" | "warning"
  text: string
}
export type CvTemplateShowcaseBlock = BlockBase & {
  type: "cvTemplateShowcase"
  label: string
  name: string
  images: { src: string; alt: string }[]
}
export type AchievementCardsBlock = BlockBase & {
  type: "achievementCards"
  weakLabel: string
  strongLabel: string
  pairs: { weak: string; strong: string }[]
}
export type AchievementLevelsBlock = BlockBase & {
  type: "achievementLevels"
  items: { label: string; body: string; tone: "weak" | "strong" }[]
}
export type InfographicStepsBlock = BlockBase & {
  type: "infographicSteps"
  eyebrow: string
  title: string
  steps: { number: string; title: string; body: string }[]
  result: string
  layout?: "cards" | "flow"
}
export type NumberedItemBlock = BlockBase & {
  type: "numberedItem"
  number: string
  title: string
  body: string
}
export type ProofCardsBlock = BlockBase & {
  type: "proofCards"
  cards: { type: string; value: string; description: string }[]
}
export type DarkCtaBlock = BlockBase & {
  type: "darkCta"
  badge: string
  title: string
  body: string
  primaryCta: string
  secondaryCta: string
  bestNextStepLabel: string
  bestNextStep: string
  tagline: string
}
export type FaqBlock = BlockBase & {
  type: "faq"
  title: string
  items: { question: string; answer: string }[]
}
export type CitationsBlock = BlockBase & {
  type: "citations"
  items: {
    org: string
    title: string
    usage: string
    date: string
    url: string
  }[]
}
export type UpdateLogBlock = BlockBase & {
  type: "updateLog"
  title: string
  text: string
}
export type InsightsDataBlock = BlockBase & {
  type: "insightsData"
  eyebrow: string
  description: string
  stats: {
    value: string
    label: string
    source: string
    highlighted?: boolean
  }[]
  quote: string
  quoteSource: string
}

export type Block =
  | RichTextBlock
  | HeadingBlock
  | ImageBlock
  | QuoteBlock
  | CalloutBlock
  | SummaryBlock
  | ScanStripBlock
  | StatRowBlock
  | StatGridBlock
  | DosDontsBlock
  | TableBlock
  | FeatureGridBlock
  | ChecklistBlock
  | StepFlowBlock
  | NumberedListBlock
  | AuthorBioBlock
  | ShortAnswerBlock
  | AtsScoreCardBlock
  | AtsVisualFlowBlock
  | CompactScanBlock
  | PullQuoteBlock
  | BeforeAfterBlock
  | EditorialTipBlock
  | AtsMatchMapBlock
  | SafeHeadingsBlock
  | GuidanceNoteBlock
  | CvTemplateShowcaseBlock
  | AchievementCardsBlock
  | AchievementLevelsBlock
  | InfographicStepsBlock
  | NumberedItemBlock
  | ProofCardsBlock
  | DarkCtaBlock
  | FaqBlock
  | CitationsBlock
  | UpdateLogBlock
  | InsightsDataBlock

export type BlockType = Block["type"]

export const BLOCK_LABELS: Record<BlockType, string> = {
  richtext: "Text",
  heading: "Heading",
  image: "Image",
  quote: "In-flow quote with attribution",
  callout: "Key Takeaways",
  summary: "Summary",
  scanStrip: "Scan strip",
  statRow: "Stat row",
  statGrid: "Stat grid",
  dosDonts: "Resume formatting: Dos & Don'ts",
  table: "Table",
  featureGrid: "Feature grid",
  checklist: "Tick-list checklist",
  stepFlow: "Step flow",
  numberedList: "Numbered list",
  authorBio: "Author Bio Panel",
  shortAnswer: "Short answer",
  atsScoreCard: "Screenshot mockup (browser frame)",
  atsVisualFlow: "ATS visual flow",
  compactScan: "Compact scan strip",
  pullQuote: "Editorial pull quote",
  beforeAfter: "Before & After sample",
  editorialTip: "Practical Editorial Tip",
  atsMatchMap: "Premium bento card of match signals",
  safeHeadings: "Safe heading Vs avoid",
  guidanceNote: "Guidance tip callout",
  cvTemplateShowcase: "CV template showcase",
  achievementCards: "Paired achievement cards",
  achievementLevels: "Achievement Levels",
  infographicSteps: "ATS resume workflow",
  numberedItem: "Single numbered item",
  proofCards: "Proof cards",
  darkCta: "Dark CTA + Best Next Step",
  faq: "FAQ Accordion",
  citations: "Citation Cards",
  updateLog: "Stackable Update Log",
  insightsData: "Insights from data",
}

export const BLOCK_ICONS: Record<BlockType, LucideIcon> = {
  richtext: AlignLeft,
  heading: HeadingIcon,
  image: ImageIcon,
  quote: QuoteIcon,
  callout: Sparkles,
  summary: BookOpen,
  scanStrip: ScanLine,
  statRow: BarChart3,
  statGrid: BarChart3,
  dosDonts: Columns,
  table: Table2,
  featureGrid: LayoutGrid,
  checklist: CheckSquare,
  stepFlow: Workflow,
  numberedList: ListOrdered,
  authorBio: User,
  shortAnswer: MessageCircle,
  atsScoreCard: Monitor,
  atsVisualFlow: Target,
  compactScan: ScanEye,
  pullQuote: QuoteIcon,
  beforeAfter: GitCompare,
  editorialTip: Lightbulb,
  atsMatchMap: Map,
  safeHeadings: ListChecks,
  guidanceNote: AlertTriangle,
  cvTemplateShowcase: LayoutTemplate,
  achievementCards: Trophy,
  achievementLevels: TrendingUp,
  infographicSteps: GitBranch,
  numberedItem: Hash,
  proofCards: Award,
  darkCta: Megaphone,
  faq: HelpCircle,
  citations: BookMarked,
  updateLog: RefreshCw,
  insightsData: BarChart3,
}

export const BLOCK_TYPES = Object.keys(BLOCK_LABELS) as BlockType[]

export const BLOCK_CATEGORIES: { label: string; types: BlockType[] }[] = [
  {
    label: "Text & Images",
    types: ["heading", "richtext", "image", "atsScoreCard"],
  },
  {
    label: "Callouts",
    types: ["shortAnswer", "summary", "callout", "guidanceNote"],
  },
  {
    label: "Stats & Data",
    types: ["statGrid", "statRow", "proofCards", "insightsData"],
  },
  { label: "Quotes", types: ["quote", "pullQuote"] },
  {
    label: "ATS Visuals",
    types: ["atsVisualFlow", "compactScan", "scanStrip"],
  },
  {
    label: "Comparisons",
    types: [
      "beforeAfter",
      "achievementCards",
      "achievementLevels",
      "editorialTip",
    ],
  },
  {
    label: "Tables",
    types: ["dosDonts", "table", "safeHeadings", "atsMatchMap"],
  },
  {
    label: "Workflows",
    types: [
      "stepFlow",
      "infographicSteps",
      "checklist",
      "numberedList",
      "numberedItem",
    ],
  },
  { label: "Templates", types: ["cvTemplateShowcase", "featureGrid"] },
  { label: "CTAs & FAQ", types: ["darkCta", "faq"] },
  { label: "Summaries", types: ["citations", "updateLog", "authorBio"] },
]
