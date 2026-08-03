import { apiFetch, fetchAllPages } from "@/lib/api-client"
import type { components } from "@/api/schema"
import type { Block } from "@/lib/blocks/types"

/**
 * The live API accepts and returns a much richer field set on Blog records
 * than the OpenAPI spec documents (verified directly against the running
 * backend, not just the schema) — excerpt, featured image, and full
 * SEO/OG/Twitter metadata all persist even though they're undocumented.
 */
type BlogSeoFields = {
  /**
   * The block-based builder's `Block[]`, sent/returned as a real array (not
   * a JSON string) — best-effort field, not in the OpenAPI spec. Falls back
   * to re-wrapping `content` as a single richtext block on load if it's
   * missing. See src/lib/blocks/legacy.ts.
   */
  contentBlocks?: Block[]
  audienceNote?: string
  excerpt?: string
  featuredImage?: string
  featuredImageAlt?: string
  featuredImageTitle?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  ogUrl?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  robots?: string
}

type Blog = components["schemas"]["Blog"] & BlogSeoFields

/**
 * The generated schema types `reviewerId` as a plain id string, but the live
 * API also accepts `null` to explicitly clear a previously-assigned
 * reviewer (verified directly against the backend) — `undefined` is instead
 * dropped by `JSON.stringify` and leaves the existing value untouched on a
 * partial update, so callers must send `null`, not `undefined`, to clear it.
 */
type BlogCreateBody = Omit<components["schemas"]["BlogCreateBody"], "reviewerId"> &
  BlogSeoFields & { reviewerId?: string | null }
type BlogUpdateBody = Omit<components["schemas"]["BlogUpdateBody"], "reviewerId"> &
  BlogSeoFields & { reviewerId?: string | null }

/**
 * `Blog.reviewerId` can come back as a plain id string or, when the backend
 * populates it, an expanded `{ _id, firstName, lastName, ... }` object —
 * this normalizes either shape down to the id the reviewer <select> needs.
 */
function getReviewerId(blog: Blog): string {
  const value = blog.reviewerId
  if (!value) {
    return ""
  }
  return typeof value === "string" ? value : (value._id ?? "")
}

async function listAllBlogs(): Promise<Blog[]> {
  return fetchAllPages<Blog>("/v1/admin/blogs")
}

async function listBlogs(): Promise<Blog[]> {
  const response = await apiFetch<{ data?: { data?: Blog[] } }>(
    "/v1/admin/blogs?page=1&limit=100"
  )
  return response.data?.data ?? []
}

async function getBlog(blogId: string): Promise<Blog> {
  const response = await apiFetch<{ data?: Blog }>(
    `/v1/admin/blogs/${blogId}`
  )
  if (!response.data) {
    throw new Error("Get post response was missing data.")
  }
  return response.data
}

async function createBlog(payload: BlogCreateBody): Promise<Blog> {
  const response = await apiFetch<{ data?: Blog }>("/v1/admin/blogs", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!response.data) {
    throw new Error("Create post response was missing data.")
  }
  return response.data
}

async function updateBlog(
  blogId: string,
  payload: BlogUpdateBody
): Promise<Blog> {
  const response = await apiFetch<{ data?: Blog }>(
    `/v1/admin/blogs/${blogId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  )
  if (!response.data) {
    throw new Error("Update post response was missing data.")
  }
  return response.data
}

async function deleteBlog(blogId: string): Promise<void> {
  await apiFetch(`/v1/admin/blogs/${blogId}`, { method: "DELETE" })
}

export {
  createBlog,
  deleteBlog,
  getBlog,
  getReviewerId,
  listAllBlogs,
  listBlogs,
  updateBlog,
}
export type { Blog, BlogCreateBody, BlogUpdateBody }
