import type { HeadingBlock } from "@/lib/blocks/types"

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function HeadingBlockView({ block }: { block: HeadingBlock }) {
  if (!block.text) {
    return null
  }
  const id = slugify(block.text)
  return block.level === 2 ? (
    <h2 id={id}>{block.text}</h2>
  ) : (
    <h3 id={id}>{block.text}</h3>
  )
}

export { HeadingBlockView }
