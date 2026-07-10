import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

function PasswordInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pr-9", className)}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center justify-center text-[#8C8C8C] hover:text-[#4A4A4A]"
      >
        {visible ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  )
}

export { PasswordInput }
