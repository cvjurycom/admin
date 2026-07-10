import { apiFetch, fetchAllPages } from "@/lib/api-client"
import { listAllBlogs } from "@/lib/blogs"
import type { components } from "@/api/schema"

type Media = components["schemas"]["Media"]
type Pagination = components["schemas"]["Pagination"]

const DAY_MS = 24 * 60 * 60 * 1000

async function fetchCount(path: string): Promise<number> {
  const response = await apiFetch<{ data?: { pagination?: Pagination } }>(
    `${path}?page=1&limit=1`
  )
  return response.data?.pagination?.totalRecords ?? 0
}

function isWithinLastDays(dateString: string | undefined, days: number) {
  if (!dateString) {
    return false
  }
  return Date.now() - new Date(dateString).getTime() <= days * DAY_MS
}

type DashboardStats = {
  totalPosts: number
  postsThisWeek: number
  published: number
  publishedThisWeek: number
  drafts: number
  scheduled: number
  nextScheduledAt: string | null
  categories: number
  mediaAssets: number
  mediaThisMonth: number
}

async function getDashboardStats(): Promise<DashboardStats> {
  const [blogs, media, categories] = await Promise.all([
    listAllBlogs(),
    fetchAllPages<Media>("/v1/admin/media"),
    fetchCount("/v1/admin/blog-categories"),
  ])

  const published = blogs.filter((blog) => blog.status === "published")
  const drafts = blogs.filter((blog) => blog.status === "draft")
  const scheduled = blogs.filter((blog) => blog.status === "scheduled")

  const nextScheduled = scheduled
    .filter(
      (blog) =>
        blog.scheduledAt && new Date(blog.scheduledAt).getTime() > Date.now()
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledAt as string).getTime() -
        new Date(b.scheduledAt as string).getTime()
    )[0]

  return {
    totalPosts: blogs.length,
    postsThisWeek: blogs.filter((blog) => isWithinLastDays(blog.createdAt, 7))
      .length,
    published: published.length,
    publishedThisWeek: published.filter((blog) =>
      isWithinLastDays(blog.publishedAt, 7)
    ).length,
    drafts: drafts.length,
    scheduled: scheduled.length,
    nextScheduledAt: nextScheduled?.scheduledAt ?? null,
    categories,
    mediaAssets: media.length,
    mediaThisMonth: media.filter((item) => isWithinLastDays(item.createdAt, 30))
      .length,
  }
}

export { getDashboardStats }
export type { DashboardStats }
