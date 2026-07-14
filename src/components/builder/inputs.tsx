import { Check, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { COLOR_SWATCHES } from "@/lib/colors"

function ColorSwatchPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (color: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COLOR_SWATCHES.map((color) => (
        <button
          key={color}
          type="button"
          aria-label={`Use color ${color}`}
          onClick={() => onChange(color)}
          className="flex size-6 items-center justify-center rounded-full"
          style={{ backgroundColor: color }}
        >
          {value.toLowerCase() === color.toLowerCase() && (
            <Check className="size-3 text-white" />
          )}
        </button>
      ))}
    </div>
  )
}

type StringListEditorProps = {
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  addLabel?: string
}

function StringListEditor({
  items,
  onChange,
  placeholder,
  addLabel = "Add item",
}: StringListEditorProps) {
  const updateAt = (index: number, value: string) => {
    onChange(items.map((item, i) => (i === index ? value : item)))
  }
  const removeAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={item}
            placeholder={placeholder}
            onChange={(event) => updateAt(index, event.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => removeAt(index)}
            aria-label="Remove item"
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, ""])}
        className="w-fit"
      >
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  )
}

type RepeatingRowsProps<T> = {
  items: T[]
  onChange: (items: T[]) => void
  createItem: () => T
  renderRow: (item: T, update: (next: T) => void) => React.ReactNode
  addLabel?: string
}

function RepeatingRows<T>({
  items,
  onChange,
  createItem,
  renderRow,
  addLabel = "Add row",
}: RepeatingRowsProps<T>) {
  const updateAt = (index: number, next: T) => {
    onChange(items.map((item, i) => (i === index ? next : item)))
  }
  const removeAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-2 rounded-lg border border-[#E8E8EC] p-3"
        >
          <div className="flex-1">
            {renderRow(item, (next) => updateAt(index, next))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => removeAt(index)}
            aria-label="Remove row"
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, createItem()])}
        className="w-fit"
      >
        <Plus className="size-4" />
        {addLabel}
      </Button>
    </div>
  )
}

export { ColorSwatchPicker, RepeatingRows, StringListEditor }
