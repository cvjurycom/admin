import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { AuthorBioBlock } from "@/lib/blocks/types"

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?"
}

function AuthorBioBlockView({ block }: { block: AuthorBioBlock }) {
  if (!block.name && !block.bio) {
    return null
  }
  const badges = block.badges.filter(Boolean)
  return (
    <div className="not-prose my-6 rounded-xl border border-[#E8E8EC] bg-[#FAFAFA] p-6">
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          {block.avatarUrl && (
            <AvatarImage src={block.avatarUrl} alt={block.name} />
          )}
          <AvatarFallback className="bg-[#FDECE3] font-semibold text-[#E97451]">
            {initialsFor(block.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-[#161616]">
            {block.name}
          </p>
          {block.title && (
            <p className="text-xs text-[#8C8C8C]">{block.title}</p>
          )}
        </div>
      </div>
      {block.bio && <p className="mt-4 text-sm text-[#4A4A4A]">{block.bio}</p>}
      {badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <span
              key={index}
              className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#6B6B6B] ring-1 ring-[#E8E8EC]"
            >
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export { AuthorBioBlockView }
