import { Check } from "lucide-react"

import type { InfographicStepsBlock } from "@/lib/blocks/types"

function ResultPill({ result }: { result: string }) {
  return (
    <div className="mt-5">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FBD9C4] bg-[#FFF7F2] px-4 py-1.5 text-xs font-semibold text-[#E97451]">
        <Check className="size-3" /> Result: {result}
      </span>
    </div>
  )
}

function InfographicStepsBlockView({
  block,
}: {
  block: InfographicStepsBlock
}) {
  const steps = block.steps.filter((step) => step.title || step.body)
  if (steps.length === 0) {
    return null
  }

  if (block.layout === "flow") {
    return (
      <div className="not-prose my-6">
        {block.eyebrow && (
          <p className="mb-1 text-xs font-bold tracking-widest text-[#E97451] uppercase">
            {block.eyebrow}
          </p>
        )}
        {block.title && (
          <p className="mb-6 text-2xl font-bold text-[#232326]">
            {block.title}
          </p>
        )}

        <div className="mb-4 hidden items-center sm:flex">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-1 items-center">
              <span className="shrink-0 rounded-full border border-[#FBD9C4] bg-[#FFF7F2] px-3 py-1 text-xs font-bold text-[#E97451] uppercase">
                {step.number}
              </span>
              {index < steps.length - 1 && (
                <div className="mx-2 h-px flex-1 border-t-2 border-dashed border-[#FBD9C4]" />
              )}
            </div>
          ))}
        </div>
        <div className="mb-4 flex flex-col gap-2 sm:hidden">
          {steps.map((step, index) => (
            <span
              key={index}
              className="w-fit rounded-full border border-[#FBD9C4] bg-[#FFF7F2] px-3 py-1 text-xs font-bold text-[#E97451] uppercase"
            >
              {step.number}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-1 rounded-xl border border-[#E8E8EC] bg-white p-5"
            >
              <p className="mb-2 text-base font-bold text-[#232326]">
                {step.title}
              </p>
              <p className="text-sm text-[#6B6B6B]">{step.body}</p>
            </div>
          ))}
        </div>

        {block.result && <ResultPill result={block.result} />}
      </div>
    )
  }

  return (
    <div className="not-prose my-6">
      {block.eyebrow && (
        <p className="mb-1 text-xs font-bold tracking-widest text-[#E97451] uppercase">
          {block.eyebrow}
        </p>
      )}
      {block.title && (
        <p className="mb-5 text-2xl font-bold text-[#232326]">
          {block.title}
        </p>
      )}
      <div className="flex flex-col gap-4">
        {Array.from(
          { length: Math.ceil(steps.length / 3) },
          (_, rowIndex) => steps.slice(rowIndex * 3, rowIndex * 3 + 3)
        ).map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-col gap-4 sm:flex-row">
            {row.map((step, colIndex) => (
              <div
                key={rowIndex * 3 + colIndex}
                className="flex-1 rounded-xl border border-[#E8E8EC] bg-white p-5"
              >
                <span className="mb-4 inline-block rounded-full border border-[#FBD9C4] bg-[#FFF7F2] px-3 py-1 text-xs font-bold text-[#E97451] uppercase">
                  {step.number}
                </span>
                <p className="mb-2 text-base font-bold text-[#232326]">
                  {step.title}
                </p>
                <p className="text-sm text-[#6B6B6B]">{step.body}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      {block.result && <ResultPill result={block.result} />}
    </div>
  )
}

export { InfographicStepsBlockView }
