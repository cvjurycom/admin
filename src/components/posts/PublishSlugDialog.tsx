import { format, parse } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const DATE_FORMAT = "yyyy-MM-dd"

function PublishSlugDialog({
  open,
  onOpenChange,
  slug,
  onSlugChange,
  publishDate,
  onPublishDateChange,
  publishTime,
  onPublishTimeChange,
  onConfirm,
  isPublishing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  slug: string
  onSlugChange: (value: string) => void
  publishDate: string
  onPublishDateChange: (value: string) => void
  publishTime: string
  onPublishTimeChange: (value: string) => void
  onConfirm: () => void
  isPublishing: boolean
}) {
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false)

  const selectedDate = publishDate
    ? parse(publishDate, DATE_FORMAT, new Date())
    : undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm the post URL</DialogTitle>
          <DialogDescription>
            This slug becomes the post&apos;s public URL. Review it before
            publishing — changing it later will change the live link.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="publish-slug">Slug</Label>
          <div className="flex items-center rounded-lg border border-[#E8E8EC] bg-[#F7F8FA] pl-3">
            <span className="shrink-0 text-sm text-[#8C8C8C]">
              cvjury.com/blog/
            </span>
            <Input
              id="publish-slug"
              autoFocus
              value={slug}
              onChange={(event) => onSlugChange(event.target.value)}
              className="h-10 rounded-lg border-0 bg-transparent px-1 text-[#161616] shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="publish-date">Published date</Label>
          <div className="flex gap-2">
            <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="publish-date"
                  type="button"
                  variant="outline"
                  className="h-10 flex-1 justify-start rounded-lg border-[#E8E8EC] font-normal"
                >
                  <CalendarIcon className="size-4 text-[#8C8C8C]" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    if (!date) {
                      return
                    }
                    onPublishDateChange(format(date, DATE_FORMAT))
                    setIsDatePopoverOpen(false)
                  }}
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={publishTime}
              onChange={(event) => onPublishTimeChange(event.target.value)}
              className="h-10 w-32 rounded-lg border border-[#E8E8EC]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPublishing}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!slug.trim() || isPublishing}
            onClick={onConfirm}
            className="bg-[#E97451] text-white hover:bg-[#E0552A]"
          >
            {isPublishing ? "Publishing…" : "Confirm & Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { PublishSlugDialog }
