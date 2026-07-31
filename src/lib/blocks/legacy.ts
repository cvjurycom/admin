import type { Block } from "@/lib/blocks/types"

function blocksFromLegacyContent(html: string): Block[] {
  if (!html) {
    return []
  }
  return [{ id: crypto.randomUUID(), type: "richtext", html }]
}

function parseContentBlocks(value: unknown): Block[] | null {
  return Array.isArray(value) && value.length > 0 ? (value as Block[]) : null
}

export { blocksFromLegacyContent, parseContentBlocks }
