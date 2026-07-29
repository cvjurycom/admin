import type { AchievementCardsBlock } from "@/lib/blocks/types"

function AchievementCardsBlockView({
  block,
}: {
  block: AchievementCardsBlock
}) {
  const pairs = block.pairs.filter((pair) => pair.weak || pair.strong)
  if (pairs.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 flex flex-col gap-4">
      {pairs.map((pair, index) => (
        <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#F9D7D7] bg-linear-to-br from-[#FDF1EF] to-white p-5">
            <p className="mb-2 text-base font-bold text-[#B54D45]">
              {block.weakLabel}
            </p>
            <p className="text-sm text-[#5F5F66]">{pair.weak}</p>
          </div>
          <div className="rounded-xl border border-[#BBF0D4] bg-linear-to-br from-[#EAFBF3] to-white p-5">
            <p className="mb-2 text-base font-bold text-[#18825B]">
              {block.strongLabel}
            </p>
            <p className="text-sm text-[#5F5F66]">{pair.strong}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export { AchievementCardsBlockView }
