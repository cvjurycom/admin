import type { CitationsBlock } from "@/lib/blocks/types"

function CitationsBlockView({ block }: { block: CitationsBlock }) {
  const items = block.items.filter((item) => item.org || item.title)
  if (items.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 flex flex-col gap-4">
      {items.map((item, index) => {
        const sourceLink = item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-[#E97451] underline"
          >
            View source
          </a>
        ) : null
        return (
          <div
            key={index}
            className="rounded-xl border border-[#E8E8EC] bg-[#FAFAFA] p-6"
          >
            <p className="text-base font-bold text-[#232326]">
              {item.org}
              {item.title && <span>, &ldquo;{item.title}&rdquo;</span>}
            </p>
            {item.usage && (
              <p className="mt-2 text-sm text-[#8C8C8C]">
                {item.usage}
                {!item.date && sourceLink && <> {sourceLink}</>}
              </p>
            )}
            {item.date && (
              <p className="mt-1 text-sm text-[#8C8C8C]">
                {item.date} {sourceLink}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { CitationsBlockView }
