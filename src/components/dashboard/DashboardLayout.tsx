import * as React from "react"

import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

function DashboardLayout({
  children,
  defaultSidebarOpen = true,
}: {
  children: React.ReactNode
  defaultSidebarOpen?: boolean
}) {
  return (
    <SidebarProvider className="bg-white" defaultOpen={defaultSidebarOpen}>
      <AppSidebar />
      <SidebarInset className="bg-white">
        <div className="flex items-center gap-2 border-b border-[#E8E8EC] px-4 py-3 md:hidden">
          <SidebarTrigger />
          <span className="text-sm font-semibold text-[#161616]">
            CVJury Admin
          </span>
        </div>
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export { DashboardLayout }
