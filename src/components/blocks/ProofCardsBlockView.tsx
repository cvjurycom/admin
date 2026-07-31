import { Clock, Scale, Sparkles } from "lucide-react"

import type { ProofCardsBlock } from "@/lib/blocks/types"

const CARD_ICONS = [Clock, Scale, Sparkles]

function ProofCardsBlockView({ block }: { block: ProofCardsBlock }) {
  const cards = block.cards.filter((card) => card.value || card.description)
  if (cards.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = CARD_ICONS[index % CARD_ICONS.length]
        return (
          <div
            key={index}
            className="rounded-xl border border-[#E8E4DF] bg-white p-5"
          >
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#FFF7F2]">
                <Icon className="size-4 text-[#E97451]" />
              </div>
              <p className="text-xs font-semibold tracking-widest text-[#5F5F66] uppercase">
                {card.type}
              </p>
            </div>
            <p className="mb-2 text-[32px] font-semibold text-[#232326]">
              {card.value}
            </p>
            <p className="text-[13px] text-[#5F5F66]">{card.description}</p>
          </div>
        )
      })}
    </div>
  )
}

export { ProofCardsBlockView }
