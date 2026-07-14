import {
  AlignLeft,
  BarChart3,
  BookOpen,
  CheckSquare,
  Columns,
  Heading as HeadingIcon,
  Image as ImageIcon,
  LayoutGrid,
  ListOrdered,
  Quote as QuoteIcon,
  ScanLine,
  Sparkles,
  Table2,
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
  stats: { value: string; label: string; source: string }[]
}
export type DosDontsBlock = BlockBase & {
  type: "dosDonts"
  dos: string[]
  donts: string[]
}
export type TableBlock = BlockBase & {
  type: "table"
  headers: [string, string]
  rows: [string, string][]
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
  badges: string[]
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

export type BlockType = Block["type"]

export const BLOCK_LABELS: Record<BlockType, string> = {
  richtext: "Text",
  heading: "Heading",
  image: "Image",
  quote: "Quote",
  callout: "Callout",
  summary: "Summary",
  scanStrip: "Scan strip",
  statRow: "Stat row",
  statGrid: "Stat grid",
  dosDonts: "Dos & don'ts",
  table: "Table",
  featureGrid: "Feature grid",
  checklist: "Checklist",
  stepFlow: "Step flow",
  numberedList: "Numbered list",
  authorBio: "Author bio",
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
}

export const BLOCK_TYPES = Object.keys(BLOCK_LABELS) as BlockType[]
