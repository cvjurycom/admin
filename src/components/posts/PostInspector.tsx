import { Trash2 } from "lucide-react"

import { BlockEditor } from "@/components/builder/BlockEditor"
import { PublishingSidebar } from "@/components/posts/PublishingSidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BLOCK_ICONS, BLOCK_LABELS } from "@/lib/blocks/types"
import type { Block } from "@/lib/blocks/types"
import type { ComponentProps } from "react"

type InspectorTab = "article" | "element"

type PostInspectorProps = {
  activeTab: InspectorTab
  onActiveTabChange: (tab: InspectorTab) => void
  selectedBlock: Block | null
  onSelectedBlockChange: (block: Block) => void
  onRemoveSelectedBlock: () => void
  blockCount: number
  publishingProps: ComponentProps<typeof PublishingSidebar>
}

function PostInspector({
  activeTab,
  onActiveTabChange,
  selectedBlock,
  onSelectedBlockChange,
  onRemoveSelectedBlock,
  blockCount,
  publishingProps,
}: PostInspectorProps) {
  const SelectedIcon = selectedBlock ? BLOCK_ICONS[selectedBlock.type] : null

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E8E8EC] bg-white">
      <div className="border-b border-[#E8E8EC] p-3">
        <Tabs
          value={activeTab}
          onValueChange={(value) => onActiveTabChange(value as InspectorTab)}
        >
          <TabsList className="h-9! w-full rounded-[12px] border border-[#E8E8EC] bg-white p-1">
            <TabsTrigger
              value="article"
              className="rounded-[9px] text-[#6B6B6B] data-active:bg-[#E97451] data-active:text-white data-active:shadow-none"
            >
              Article
            </TabsTrigger>
            <TabsTrigger
              value="element"
              disabled={!selectedBlock}
              className="rounded-[9px] text-[#6B6B6B] data-active:bg-[#E97451] data-active:text-white data-active:shadow-none"
            >
              Element
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "article" && <PublishingSidebar {...publishingProps} />}
        {activeTab === "element" &&
          (selectedBlock ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[#E8E8EC] pb-3">
                {SelectedIcon && (
                  <SelectedIcon className="size-4 text-[#6B6B6B]" />
                )}
                <p className="flex-1 text-xs font-semibold text-[#161616]">
                  {BLOCK_LABELS[selectedBlock.type]}
                </p>
              </div>
              <BlockEditor block={selectedBlock} onChange={onSelectedBlockChange} />
            </div>
          ) : (
            <p className="text-xs text-[#8C8C8C]">
              Click a block on the canvas to inspect and edit its content.
            </p>
          ))}
      </div>

      <div className="flex items-center justify-between border-t border-[#E8E8EC] px-4 py-3">
        <span className="text-xs text-[#8C8C8C]">
          {blockCount} block{blockCount !== 1 ? "s" : ""}
        </span>
        {selectedBlock && activeTab === "element" && (
          <button
            type="button"
            onClick={onRemoveSelectedBlock}
            className="flex items-center gap-1 text-xs text-[#E11D48] transition-colors hover:text-[#B91C1C]"
          >
            <Trash2 className="size-3" />
            Remove
          </button>
        )}
      </div>
    </div>
  )
}

export { PostInspector }
export type { InspectorTab }
