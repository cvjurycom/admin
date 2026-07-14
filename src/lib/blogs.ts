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
  /**
   * References a User whose __t is "reviewer" (see src/lib/users.ts). Sent
   * best-effort — not in the OpenAPI spec. `reviewerName`/`reviewerTitle`
   * free-text fields were tried first but the backend hard-rejects unknown
   * fields on this endpoint ("X is not allowed"), so this only works if the
   * backend recognizes `reviewerId` specifically.
   */
  reviewerId?: string
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
type BlogCreateBody = components["schemas"]["BlogCreateBody"] & BlogSeoFields
type BlogUpdateBody = components["schemas"]["BlogUpdateBody"] & BlogSeoFields

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

export { createBlog, deleteBlog, getBlog, listAllBlogs, listBlogs, updateBlog }
export type { Blog, BlogCreateBody, BlogUpdateBody }
