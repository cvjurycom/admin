import {
  CheckCircle2,
  Clock,
  FileText,
  Pencil,
  Upload,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api-client"
import { listBlogs, type Blog } from "@/lib/blogs"
import { listMedia, type Media } from "@/lib/media"

type ActivityItem = {
  key: string
  name?: string
  action: string
  title: string
  time: string
  icon: LucideIcon
}

function buildBlogActivity(blog: Blog): ActivityItem | null {
  const title = blog.title ?? "Untitled"
  const name = blog.author || undefined

  if (blog.status === "published" && blog.publishedAt) {
    return {
      key: `blog-${blog._id}-published`,
      name,
      action: "Published",
      title,
      time: blog.publishedAt,
      icon: CheckCircle2,
    }
  }

  if (blog.status === "scheduled" && blog.updatedAt) {
    return {
      key: `blog-${blog._id}-scheduled`,
      name,
      action: "Scheduled",
      title,
      time: blog.updatedAt,
      icon: Clock,
    }
  }

  const wasEdited =
    blog.createdAt &&
    blog.updatedAt &&
    new Date(blog.updatedAt).getTime() - new Date(blog.createdAt).getTime() >
      60_000

  if (wasEdited && blog.updatedAt) {
    return {
      key: `blog-${blog._id}-updated`,
      name,
      action: "Updated",
      title,
      time: blog.updatedAt,
      icon: Pencil,
    }
  }

  if (blog.createdAt) {
    return {
      key: `blog-${blog._id}-created`,
      name,
      action: "Created draft",
      title,
      time: blog.createdAt,
      icon: FileText,
    }
  }

  return null
}

function buildMediaActivity(item: Media): ActivityItem | null {
  if (!item.createdAt) {
    return null
  }
  return {
    key: `media-${item._id}`,
    action: "Uploaded",
    title: item.filename ?? "file",
    time: item.createdAt,
    icon: Upload,
  }
}

function formatRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const diffMinutes = Math.round(diffMs / 60_000)

  if (diffMinutes < 1) {
    return "Just now"
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`
  }
  const diffHours = Math.round(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  }
  const diffDays = Math.round(diffHours / 24)
  if (diffDays === 1) {
    return "Yesterday"
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`
  }
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function RecentActivityCard() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [media, setMedia] = useState<Media[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    Promise.all([listBlogs(), listMedia()])
      .then(([blogsData, mediaData]) => {
        if (!cancelled) {
          setBlogs(blogsData)
          setMedia(mediaData)
        }
      })
      .catch((err) => {
        toast.error(
          err instanceof ApiError
            ? err.message
            : "Unable to load recent activity."
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

  const activity = useMemo(() => {
    const blogEvents = blogs
      .map(buildBlogActivity)
      .filter((item): item is ActivityItem => item !== null)
    const mediaEvents = media
      .map(buildMediaActivity)
      .filter((item): item is ActivityItem => item !== null)

    return [...blogEvents, ...mediaEvents]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5)
  }, [blogs, media])

  return (
    <Card className="rounded-[16px] border border-[#E8E8EC] p-5">
      <CardHeader className="px-0">
        <CardTitle className="text-base font-bold text-[#161616]">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-0">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="size-7 shrink-0 rounded-full" />
              <Skeleton className="h-4 min-w-0 flex-1" />
              <Skeleton className="h-3 w-12 shrink-0" />
            </div>
          ))}

        {!isLoading &&
          activity.map((item) => (
            <div
              key={item.key}
              title={item.title}
              className="flex items-center gap-3"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#0000000D] bg-[#FAFAFA]">
                <item.icon className="size-3.5 text-[#6B6B6B]" />
              </span>
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-[#161616]">
                {item.action}
              </p>
              <span className="shrink-0 text-xs text-[#8C8C8C]">
                {formatRelativeTime(item.time)}
              </span>
            </div>
          ))}

        {!isLoading && activity.length === 0 && (
          <p className="py-6 text-center text-sm text-[#8C8C8C]">
            No recent activity yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export { RecentActivityCard }
