import { renderToStaticMarkup } from "react-dom/server"

import { BlockRenderer } from "@/components/blocks/BlockRenderer"
import type { Block } from "@/lib/blocks/types"

function renderBlocksToHtml(blocks: Block[]): string {
  return blocks
    .map((block) => renderToStaticMarkup(<BlockRenderer block={block} />))
    .join("")
}

export { renderBlocksToHtml }
