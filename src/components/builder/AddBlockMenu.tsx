import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BLOCK_ICONS, BLOCK_LABELS, BLOCK_TYPES } from "@/lib/blocks/types"
import type { BlockType } from "@/lib/blocks/types"

function AddBlockMenu({
  onAdd,
  label = "Add block",
}: {
  onAdd: (type: BlockType) => void
  label?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Plus className="size-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
        {BLOCK_TYPES.map((type) => {
          const Icon = BLOCK_ICONS[type]
          return (
            <DropdownMenuItem key={type} onSelect={() => onAdd(type)}>
              <Icon className="size-4 text-[#6B6B6B]" />
              {BLOCK_LABELS[type]}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { AddBlockMenu }
