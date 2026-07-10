import * as React from "react"

import logo from "@/assets/images/logo.png"
import overlayTopRight from "@/assets/images/Overlay+Shadow-1.png"
import overlayBottomLeft from "@/assets/images/Overlay+Shadow-2.png"

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col items-center overflow-hidden bg-[#FFFAF7] px-4 py-12">
      <img
        src={overlayTopRight}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 w-56 sm:w-72 md:w-96"
      />
      <img
        src={overlayBottomLeft}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 w-56 sm:w-72 md:w-96"
      />

      <div className="relative z-10 flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <img src={logo} alt="CVJury" className="h-16 w-auto" />
          <p className="text-sm text-[#6B6B6B]">Admin Portal</p>
        </div>

        <div className="w-full">{children}</div>

        <p className="text-center text-xs text-[#8C8C8C]">
          CVJury Admin CMS &middot; Protected Area
        </p>
      </div>
    </div>
  )
}

export { AuthLayout }
