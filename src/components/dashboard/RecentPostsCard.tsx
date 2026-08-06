import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ApiError } from "@/lib/api-client"
import { listBlogs, type Blog } from "@/lib/blogs"
import { cloudinaryThumbnail } from "@/lib/cloudinary"

const statusLabels: Record<string, string> = {
  published: "Published",
  draft: "Draft",
  scheduled: "Scheduled",
}

const statusStyles: Record<string, string> = {
  Published: "bg-[#E3F5E9] text-[#16A34A]",
  Draft: "bg-[#F1F1F3] text-[#6B6B6B]",
  Scheduled: "bg-[#E5F0FC] text-[#2563EB]",
}

const swatchPalette = [
  "#E8C9B4",
  "#B9C6D6",
  "#2C3E50",
  "#D8B4A0",
  "#C9D6E3",
  "#A9C4B8",
  "#D6C2A9",
]

function swatchFor(id: string | undefined) {
  if (!id) {
    return swatchPalette[0]
  }
  return swatchPalette[id.charCodeAt(id.length - 1) % swatchPalette.length]
}

function formatDate(post: Blog, label: string) {
  const source =
    label === "Published"
      ? post.publishedAt
      : label === "Scheduled"
        ? post.scheduledAt
        : null
  if (!source) {
    return "—"
  }
  return new Date(source).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function RecentPostsCard() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    listBlogs()
      .then((data) => {
        if (!cancelled) {
          setPosts(data)
        }
      })
      .catch((err) => {
        toast.error(
          err instanceof ApiError ? err.message : "Unable to load recent posts."
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

  const recentPosts = useMemo(
    () =>
      [...posts]
        .sort(
          (a, b) =>
            new Date(b.updatedAt ?? 0).getTime() -
            new Date(a.updatedAt ?? 0).getTime()
        )
        .slice(0, 5),
    [posts]
  )

  return (
    <Card className="rounded-[16px] border border-[#E8E8EC] p-5 lg:col-span-2">
      <CardHeader className="flex items-center justify-between px-0">
        <CardTitle className="text-base font-bold text-[#161616]">
          Recent Posts
        </CardTitle>
        <Link
          to="/posts"
          className="text-sm font-medium text-[#E97451] hover:underline"
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-[#E8E8EC] px-0">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-3.5 first:pt-2"
            >
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}

        {!isLoading &&
          recentPosts.map((post) => {
            const label = statusLabels[post.status ?? ""] ?? "Draft"
            return (
              <button
                key={post._id}
                type="button"
                onClick={() =>
                  navigate("/posts/new", { state: { blogId: post._id } })
                }
                className="flex w-full items-center gap-3 py-3.5 text-left first:pt-2 hover:bg-[#FAFAFA]"
              >
                {post.featuredImage ? (
                  <img
                    src={cloudinaryThumbnail(post.featuredImage, 80)}
                    alt=""
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <span
                    className="size-10 shrink-0 rounded-lg"
                    style={{ backgroundColor: swatchFor(post._id) }}
                    aria-hidden="true"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#161616]">
                    {post.title}
                  </p>
                  <p className="truncate text-xs text-[#8C8C8C]">
                    {post.categories?.[0]?.name ?? "Uncategorized"} &middot;{" "}
                    {post.author ?? "—"}
                  </p>
                </div>
                <Badge className={statusStyles[label]}>
                  <span className="size-1.5 rounded-full bg-current" />
                  {label}
                </Badge>
                <span className="w-20 shrink-0 text-right text-xs text-[#8C8C8C]">
                  {formatDate(post, label)}
                </span>
              </button>
            )
          })}

        {!isLoading && recentPosts.length === 0 && (
          <p className="py-6 text-center text-sm text-[#8C8C8C]">
            No posts yet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export { RecentPostsCard }
