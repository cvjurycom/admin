import { Button } from "@/components/ui/button"
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

function PublishSlugDialog({
  open,
  onOpenChange,
  slug,
  onSlugChange,
  onConfirm,
  isPublishing,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  slug: string
  onSlugChange: (value: string) => void
  onConfirm: () => void
  isPublishing: boolean
}) {
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
