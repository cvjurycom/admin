import { apiFetch, fetchAllPages } from "@/lib/api-client"
import type { components } from "@/api/schema"

/**
 * The live API accepts and returns a much richer field set on Blog records
 * than the OpenAPI spec documents (verified directly against the running
 * backend, not just the schema) — excerpt, featured image, and full
 * SEO/OG/Twitter metadata all persist even though they're undocumented.
 */
type BlogSeoFields = {
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
