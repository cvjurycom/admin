import { FolderPlus, Plus, Rss, Upload } from "lucide-react"
import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const quickActions = [
  { label: "New Blog Post", icon: Plus, primary: true, to: "/posts/new" },
  { label: "Upload Media", icon: Upload, primary: false, to: "/media-library" },
  { label: "Add Category", icon: FolderPlus, primary: false, to: "/categories" },
  { label: "SEO Settings", icon: Rss, primary: false, to: "/seo-settings" },
]

function QuickActionsCard() {
  return (
    <Card className="rounded-[16px] border border-[#E8E8EC] p-5">
      <CardHeader className="px-0">
        <CardTitle className="text-base font-bold text-[#161616]">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 px-0">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className={
              action.primary
                ? "flex h-10 items-center gap-2 rounded-lg bg-[#E97451] px-3 text-sm font-semibold text-white hover:bg-[#E0552A]"
                : "flex h-10 items-center gap-2 rounded-lg bg-[#F7F8FA] px-3 text-sm font-medium text-[#4A4A4A] hover:bg-[#F1F1F3]"
            }
          >
            <action.icon className="size-4" />
            {action.label}
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

export { QuickActionsCard }
