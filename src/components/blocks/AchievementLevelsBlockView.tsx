import type { AchievementLevelsBlock } from "@/lib/blocks/types"

function AchievementLevelsBlockView({
  block,
}: {
  block: AchievementLevelsBlock
}) {
  const items = block.items.filter((item) => item.label || item.body)
  if (items.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 flex flex-col gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className={
            item.tone === "weak"
              ? "rounded-xl border border-[#F9D7D7] bg-linear-to-br from-[#FDF1EF] to-white p-5"
              : "rounded-xl border border-[#BBF0D4] bg-linear-to-br from-[#EAFBF3] to-white p-5"
          }
        >
          <p
            className={`mb-2 text-xs font-bold tracking-widest uppercase ${
              item.tone === "weak" ? "text-[#B54D45]" : "text-[#18825B]"
            }`}
          >
            {item.label}
          </p>
          <p className="text-base text-[#5F5F66]">{item.body}</p>
        </div>
      ))}
    </div>
  )
}

export { AchievementLevelsBlockView }
