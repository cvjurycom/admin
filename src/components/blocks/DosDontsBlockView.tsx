import { BadgeCheck, BadgeX, UserCheck, UserX } from "lucide-react"

import type { DosDontsBlock } from "@/lib/blocks/types"

function DosDontsBlockView({ block }: { block: DosDontsBlock }) {
  const dos = block.dos.filter(Boolean)
  const donts = block.donts.filter(Boolean)
  if (dos.length === 0 && donts.length === 0) {
    return null
  }

  if (block.layout === "table") {
    return (
      <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-[#E8E8EC] bg-white">
          <div className="border-b border-[#BBF0D4] bg-[#DCFCE7] px-5 py-4">
            <p className="text-xl font-bold text-[#16A34A]">Dos</p>
          </div>
          <div className="flex flex-col gap-4 p-5">
            {dos.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-[#5F5F66]" />
                <p className="text-sm text-[#4A4A4A]">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#E8E8EC] bg-white">
          <div className="border-b border-[#FECACA] bg-[#FEE2E2] px-5 py-4">
            <p className="text-xl font-bold text-[#DC2626]">Don&apos;ts</p>
          </div>
          <div className="flex flex-col gap-4 p-5">
            {donts.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <BadgeX className="mt-0.5 size-5 shrink-0 text-[#5F5F66]" />
                <p className="text-sm text-[#4A4A4A]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-[#E8DCC0] bg-[#FCFAF8] p-5">
        <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-[#DCFCE7]">
          <UserCheck className="size-5 text-[#16A34A]" />
        </div>
        <p className="mb-3 text-lg font-bold text-[#232326]">Dos</p>
        <ul className="flex flex-col gap-2">
          {dos.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-[#4A4A4A]"
            >
              <span className="mt-2 size-1 shrink-0 bg-[#8C8C8C]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-[#E8DCC0] bg-[#FCFAF8] p-5">
        <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-[#FEE2E2]">
          <UserX className="size-5 text-[#DC2626]" />
        </div>
        <p className="mb-3 text-lg font-bold text-[#232326]">Don&apos;ts</p>
        <ul className="flex flex-col gap-2">
          {donts.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-[#4A4A4A]"
            >
              <span className="mt-2 size-1 shrink-0 bg-[#8C8C8C]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { DosDontsBlockView }
