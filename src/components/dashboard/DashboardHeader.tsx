import { Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { getStoredUser } from "@/lib/auth"

function greetingForTime() {
  const hour = new Date().getHours()
  if (hour < 12) {
    return "Good Morning"
  }
  if (hour < 18) {
    return "Good Afternoon"
  }
  return "Good Evening"
}

function DashboardHeader() {
  const user = getStoredUser()
  const firstName = user?.firstName || "there"

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#161616] sm:text-[28px]">
          {greetingForTime()}, {firstName}!
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          Here&apos;s what&apos;s happening with your content today.
        </p>
      </div>
      <Button
        asChild
        size="lg"
        className="h-11 w-fit shrink-0 rounded-full bg-[#E97451] px-5 text-sm font-semibold text-white hover:bg-[#E0552A]"
      >
        <Link to="/posts/new">
          <Plus />
          New Post
        </Link>
      </Button>
    </div>
  )
}

export { DashboardHeader }
