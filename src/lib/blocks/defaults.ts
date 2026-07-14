import { DEFAULT_COLOR } from "@/lib/colors"
import type { Block, BlockType } from "@/lib/blocks/types"

function newId() {
  return crypto.randomUUID()
}

export function createBlock(type: BlockType): Block {
  const id = newId()

  switch (type) {
    case "richtext":
      return { id, type, html: "" }
    case "heading":
      return { id, type, text: "", level: 2 }
    case "image":
      return { id, type, src: "", alt: "", caption: "" }
    case "quote":
      return { id, type, text: "", source: "" }
    case "callout":
      return { id, type, title: "Key Takeaways", items: [""] }
    case "summary":
      return { id, type, label: "Summary", text: "" }
    case "scanStrip":
      return { id, type, badgeText: "", title: "", description: "" }
    case "statRow":
      return {
        id,
        type,
        stats: [{ value: "", label: "", color: DEFAULT_COLOR }],
      }
    case "statGrid":
      return { id, type, stats: [{ value: "", label: "", source: "" }] }
    case "dosDonts":
      return { id, type, dos: [""], donts: [""] }
    case "table":
      return { id, type, headers: ["", ""], rows: [["", ""]] }
    case "featureGrid":
      return { id, type, items: [{ title: "", description: "" }] }
    case "checklist":
      return { id, type, title: "", items: [""] }
    case "stepFlow":
      return { id, type, title: "", steps: [{ title: "", description: "" }] }
    case "numberedList":
      return { id, type, items: [{ title: "", description: "" }] }
    case "authorBio":
      return {
        id,
        type,
        name: "",
        title: "",
        avatarUrl: "",
        bio: "",
        badges: [],
      }
  }
}
