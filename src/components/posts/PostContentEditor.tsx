import { BlockList } from "@/components/builder/BlockList"
import { Textarea } from "@/components/ui/textarea"
import type { Block } from "@/lib/blocks/types"

type PostContentEditorProps = {
  title: string
  onTitleChange: (value: string) => void
  excerpt: string
  onExcerptChange: (value: string) => void
  blocks: Block[]
  onBlocksChange: (blocks: Block[]) => void
}

function PostContentEditor({
  title,
  onTitleChange,
  excerpt,
  onExcerptChange,
  blocks,
  onBlocksChange,
}: PostContentEditorProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#FAFAFA] p-3 sm:p-4">
      <div className="rounded-xl border border-[#E8E8EC] bg-white">
        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Post title..."
          className="w-full border-b border-[#E8E8EC] bg-transparent px-5 py-4 text-xl font-semibold text-[#161616] placeholder:text-[#B0B0B0] focus:outline-none"
        />
        <Textarea
          value={excerpt}
          onChange={(event) => onExcerptChange(event.target.value)}
          placeholder="Write a short excerpt that summarizes this post..."
          className="min-h-20 resize-none rounded-none border-0 bg-[#FAFAFA] px-5 py-4 text-sm focus-visible:ring-0"
        />
      </div>

      <BlockList blocks={blocks} onChange={onBlocksChange} />
    </div>
  )
}

export { PostContentEditor }
