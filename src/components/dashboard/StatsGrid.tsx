import {
  CalendarDays,
  CheckCircle2,
  FileCheck,
  FileText,
  Folder,
  Image as ImageIcon,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api-client"
import { getDashboardStats, type DashboardStats } from "@/lib/dashboard-stats"

type StatCard = {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  badge: string
  badgeTone: "positive" | "neutral"
  value: number
  label: string
}

function formatOrdinalDate(dateString: string) {
  const date = new Date(dateString)
  const day = date.getDate()
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th"
  const month = date.toLocaleDateString(undefined, { month: "long" })
  return `${month} ${day}${suffix}`
}

function buildStatCards(stats: DashboardStats): StatCard[] {
  return [
    {
      icon: FileText,
      iconBg: "#FDECE3",
      iconColor: "#E97451",
      badge: `+${stats.postsThisWeek} this week`,
      badgeTone: stats.postsThisWeek > 0 ? "positive" : "neutral",
      value: stats.totalPosts,
      label: "Total Posts",
    },
    {
      icon: CheckCircle2,
      iconBg: "#E3F5E9",
      iconColor: "#16A34A",
      badge: `+${stats.publishedThisWeek} this week`,
      badgeTone: stats.publishedThisWeek > 0 ? "positive" : "neutral",
      value: stats.published,
      label: "Published",
    },
    {
      icon: FileCheck,
      iconBg: "#E5F0FC",
      iconColor: "#2563EB",
      badge: "Needs review",
      badgeTone: "neutral",
      value: stats.drafts,
      label: "Drafts",
    },
    {
      icon: CalendarDays,
      iconBg: "#F1E9FB",
      iconColor: "#7C3AED",
      badge: stats.nextScheduledAt
        ? `Next: ${formatOrdinalDate(stats.nextScheduledAt)}`
        : "Nothing scheduled",
      badgeTone: "neutral",
      value: stats.scheduled,
      label: "Scheduled",
    },
    {
      icon: Folder,
      iconBg: "#FDF3DC",
      iconColor: "#D97706",
      badge: "Across all posts",
      badgeTone: "neutral",
      value: stats.categories,
      label: "Categories",
    },
    {
      icon: ImageIcon,
      iconBg: "#E1F6F1",
      iconColor: "#0D9488",
      badge: `+${stats.mediaThisMonth} this month`,
      badgeTone: stats.mediaThisMonth > 0 ? "positive" : "neutral",
      value: stats.mediaAssets,
      label: "Media Assets",
    },
  ]
}

function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="rounded-[16px] border border-[#E8E8EC] p-5"
        >
          <CardContent className="flex flex-col gap-4 px-0">
            <div className="flex items-center justify-between">
              <Skeleton className="size-10 rounded-xl" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function StatsGrid() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    getDashboardStats()
      .then((data) => {
        if (!cancelled) {
          setStats(data)
        }
      })
      .catch((err) => {
        toast.error(
          err instanceof ApiError
            ? err.message
            : "Unable to load dashboard stats."
        )
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading || !stats) {
    return <StatsGridSkeleton />
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {buildStatCards(stats).map((stat) => (
        <Card
          key={stat.label}
          className="rounded-[16px] border border-[#E8E8EC] p-5"
        >
          <CardContent className="flex flex-col gap-4 px-0">
            <div className="flex items-center justify-between">
              <span
                className="flex size-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: stat.iconBg }}
              >
                <stat.icon className="size-5" style={{ color: stat.iconColor }} />
              </span>
              <Badge
                className={
                  stat.badgeTone === "positive"
                    ? "bg-[#E3F5E9] text-[#16A34A]"
                    : "bg-[#F1F1F3] text-[#6B6B6B]"
                }
              >
                {stat.badge}
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#161616]">{stat.value}</p>
              <p className="text-sm text-[#6B6B6B]">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export { StatsGrid }
