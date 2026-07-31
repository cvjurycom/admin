import { ArrowRight } from "lucide-react"

import type { StepFlowBlock } from "@/lib/blocks/types"

function StepFlowBlockView({ block }: { block: StepFlowBlock }) {
  const steps = block.steps.filter((step) => step.title || step.description)
  if (steps.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6">
      {block.title && (
        <p className="mb-4 text-sm font-semibold text-[#161616]">
          {block.title}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-1 items-stretch gap-2">
            <div className="flex-1 rounded-xl border border-[#E8E8EC] bg-white p-4">
              <p className="text-xs font-semibold text-[#E97451]">
                Step {index + 1}
              </p>
              <p className="mt-1 text-sm font-medium text-[#161616]">
                {step.title}
              </p>
              {step.description && (
                <p className="mt-1 text-xs text-[#6B6B6B]">
                  {step.description}
                </p>
              )}
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="hidden size-4 shrink-0 self-center text-[#B0B0B0] sm:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { StepFlowBlockView }
