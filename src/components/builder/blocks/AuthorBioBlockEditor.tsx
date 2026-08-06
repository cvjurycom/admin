import { RefreshCw } from "lucide-react"

import { RepeatingRows, StringListEditor } from "@/components/builder/inputs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getStoredUser } from "@/lib/auth"
import { cloudinaryAvatar } from "@/lib/cloudinary"
import type { AuthorBioBlock } from "@/lib/blocks/types"

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?"
}

function AuthorBioBlockEditor({
  block,
  onChange,
}: {
  block: AuthorBioBlock
  onChange: (block: AuthorBioBlock) => void
}) {
  const syncFromProfile = () => {
    const user = getStoredUser()
    onChange({
      ...block,
      name: user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "",
      title: user?.title ?? "",
      avatarUrl: user?.profileImage ?? "",
      bio: user?.bio ?? "",
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 rounded-lg border border-[#E8E8EC] bg-[#FAFAFA] p-3">
        <Avatar className="size-12 shrink-0">
          {block.avatarUrl && (
            <AvatarImage
              src={cloudinaryAvatar(block.avatarUrl, 96)}
              alt={block.name}
            />
          )}
          <AvatarFallback className="bg-[#FDECE3] font-semibold text-[#E97451]">
            {initialsFor(block.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#161616]">
            {block.name || "No name on file"}
          </p>
          <p className="truncate text-xs text-[#8C8C8C]">
            {block.title || "—"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={syncFromProfile}
        >
          <RefreshCw className="size-3.5" />
          Sync
        </Button>
      </div>
      <p className="-mt-1 text-xs text-[#8C8C8C]">
        Name, title, photo, and bio come from your author profile and aren't
        editable here. Update your profile, then hit Sync to pull the latest
        version into this post.
      </p>
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
