import { ImagePlus, LibraryBig } from "lucide-react"
import { useRef, useState, type ChangeEvent } from "react"
import { toast } from "sonner"

import { RepeatingRows, StringListEditor } from "@/components/builder/inputs"
import { MediaLibraryDialog } from "@/components/media/MediaLibraryDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { uploadAndRegisterImage } from "@/lib/image-upload"
import type { AuthorBioBlock } from "@/lib/blocks/types"

function AuthorBioBlockEditor({
  block,
  onChange,
}: {
  block: AuthorBioBlock
  onChange: (block: AuthorBioBlock) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLibraryOpen, setIsLibraryOpen] = useState(false)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) {
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadAndRegisterImage(file, block.name || "Author avatar")
      onChange({ ...block, avatarUrl: url })
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to upload image."
      )
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Input
          value={block.name}
          placeholder="Name"
          onChange={(event) => onChange({ ...block, name: event.target.value })}
        />
        <Input
          value={block.title}
          placeholder="Title (e.g. Senior Career Strategist)"
          onChange={(event) =>
            onChange({ ...block, title: event.target.value })
          }
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex items-center gap-3">
        {block.avatarUrl ? (
          <img
            src={block.avatarUrl}
            alt={block.name}
            className="size-16 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-dashed border-[#E8E8EC] text-[#8C8C8C]">
            <ImagePlus className="size-5" />
          </div>
        )}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading
            ? "Uploading…"
            : block.avatarUrl
              ? "Replace photo"
              : "Upload photo"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsLibraryOpen(true)}
        >
          <LibraryBig className="size-3.5" />
          Library
        </Button>
      </div>
      <MediaLibraryDialog
        open={isLibraryOpen}
        onOpenChange={setIsLibraryOpen}
        onSelect={(media) =>
          onChange({ ...block, avatarUrl: media.imageUrl ?? "" })
        }
      />
      <Textarea
        value={block.bio}
        placeholder="Bio"
        onChange={(event) => onChange({ ...block, bio: event.target.value })}
      />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Input
          value={block.bioLinkLabel}
          placeholder="Inline link text (e.g. Read his story)"
          onChange={(event) =>
            onChange({ ...block, bioLinkLabel: event.target.value })
          }
        />
        <Input
          value={block.bioLinkUrl}
          placeholder="Inline link URL"
          onChange={(event) =>
            onChange({ ...block, bioLinkUrl: event.target.value })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Badges</Label>
        <StringListEditor
          items={block.badges}
          onChange={(badges) => onChange({ ...block, badges })}
          placeholder="CPRW Certified"
          addLabel="Add badge"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Social links</Label>
        <RepeatingRows
          items={block.links ?? []}
          onChange={(links) => onChange({ ...block, links })}
          createItem={() => ({ label: "", url: "" })}
          addLabel="Add link"
          renderRow={(link, update) => (
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={link.label}
                placeholder="Link label (e.g. LinkedIn)"
                onChange={(event) =>
                  update({ ...link, label: event.target.value })
                }
              />
              <Input
                value={link.url}
                placeholder="URL"
                onChange={(event) =>
                  update({ ...link, url: event.target.value })
                }
              />
            </div>
          )}
        />
      </div>
    </div>
  )
}

export { AuthorBioBlockEditor }
