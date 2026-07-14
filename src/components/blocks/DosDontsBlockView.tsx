import { Check, X } from "lucide-react"

import type { DosDontsBlock } from "@/lib/blocks/types"

function DosDontsBlockView({ block }: { block: DosDontsBlock }) {
  const dos = block.dos.filter(Boolean)
  const donts = block.donts.filter(Boolean)
  if (dos.length === 0 && donts.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-[#E8E8EC] bg-white p-5">
        <p className="text-sm font-semibold text-[#161616]">Dos</p>
        <ul className="mt-3 flex flex-col gap-2">
          {dos.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-[#4A4A4A]"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-[#16A34A]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-[#E8E8EC] bg-white p-5">
        <p className="text-sm font-semibold text-[#161616]">Don&apos;ts</p>
        <ul className="mt-3 flex flex-col gap-2">
          {donts.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-[#4A4A4A]"
            >
              <X className="mt-0.5 size-4 shrink-0 text-[#E11D48]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { DosDontsBlockView }
