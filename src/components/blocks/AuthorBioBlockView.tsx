import { User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import linkedinIcon from "@/assets/images/linkedin.svg"
import Happenstance from "@/assets/images/Happenstance.svg"
import { cloudinaryAvatar } from "@/lib/cloudinary"
import type { AuthorBioBlock } from "@/lib/blocks/types"

function LinkIcon({ label }: { label: string }) {
  if (label.toLowerCase().includes("linkedin")) {
    return <img src={linkedinIcon} alt="" className="size-6 shrink-0 rounded" />
  }
  return <img src={Happenstance} alt="" className="size-6 shrink-0 rounded" />
}

function AuthorBioBlockView({ block }: { block: AuthorBioBlock }) {
  if (!block.name && !block.bio) {
    return null
  }
  const badges = block.badges.filter(Boolean)
  const links = (block.links ?? []).filter((l) => l.label)
  return (
    <div className="not-prose my-6 rounded-[12px] border border-[#E8E4DF] bg-[#FAFAF9] p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <Avatar className="size-24 shrink-0 ring-4 ring-[#FFE2D9]">
          {block.avatarUrl && (
            <AvatarImage
              src={cloudinaryAvatar(block.avatarUrl)}
              alt={block.name}
            />
          )}
          <AvatarFallback className="bg-[#FDECE3] text-[#E97451]">
            <User className="size-8" />
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium tracking-widest text-[#8A8580] uppercase">
            About the author
          </p>
          {block.name && (
            <p className="mt-2 text-[24px] font-semibold text-[#232326]">
              {block.name}
            </p>
          )}
          {block.title && (
            <p className="mt-1 text-base font-medium text-[#E97451]">
              {block.title}
            </p>
          )}
          {block.bio && (
            <p className="mt-4 text-[14px] leading-relaxed text-[#5F5F66]">
              {block.bio}
              {block.bioLinkLabel && (
                <>
                  {" "}
                  <a
                    href={block.bioLinkUrl || "#"}
                    className="text-[#E97451] underline"
                  >
                    {block.bioLinkLabel}
                  </a>
                  .
                </>
              )}
            </p>
          )}
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
          {links.length > 0 && (
            <div className="mt-6 flex flex-col gap-2">
              <p className="text-xs font-medium tracking-widest text-[#8A8580] uppercase">
                Connect
              </p>
              <div className="flex flex-wrap gap-3">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url || "#"}
                    className="flex items-center gap-2 rounded-[8px] border border-[#E8E4DF] bg-white px-4 py-2 text-xs font-medium text-[#232326]"
                  >
                    <LinkIcon label={link.label} />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { AuthorBioBlockView }
