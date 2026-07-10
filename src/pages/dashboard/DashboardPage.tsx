import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard"
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard"
import { RecentPostsCard } from "@/components/dashboard/RecentPostsCard"
import { StatsGrid } from "@/components/dashboard/StatsGrid"

function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <DashboardHeader />
        <StatsGrid />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <RecentPostsCard />

          <div className="flex flex-col gap-6">
            <QuickActionsCard />
            <RecentActivityCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
