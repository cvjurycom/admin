import type { StatGridBlock } from "@/lib/blocks/types"

function StatGridBlockView({ block }: { block: StatGridBlock }) {
  const stats = block.stats.filter((stat) => stat.value || stat.label)
  if (stats.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat, index) => {
        const isOrange = stat.variant === "orange"
        return (
          <div
            key={index}
            className={`rounded-[12px] border px-4 py-4 text-center ${
              isOrange
                ? "border-[#FFCFC1] bg-[#FCF0E8]"
                : "border-[#D2E5DA] bg-[#F0FDF4]"
            }`}
          >
            <p
              className={`mb-4 text-[32px] leading-none font-semibold ${
                isOrange ? "text-[#E97451]" : "text-[#378A64]"
              }`}
            >
              {stat.value}
            </p>
            <p className="mx-auto max-w-40 text-center text-sm leading-snug text-[#5F5F66]">
              {stat.label}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export { StatGridBlockView }
