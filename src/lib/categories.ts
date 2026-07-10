import { apiFetch } from "@/lib/api-client"
import { listAllBlogs } from "@/lib/blogs"
import type { components } from "@/api/schema"

type Category = components["schemas"]["BlogCategory"]
type CategoryCreateBody = components["schemas"]["BlogCategoryCreateBody"]
type CategoryUpdateBody = components["schemas"]["BlogCategoryUpdateBody"]

async function listCategories(): Promise<Category[]> {
  const response = await apiFetch<{ data?: { data?: Category[] } }>(
    "/v1/admin/blog-categories?page=1&limit=100"
  )
  return response.data?.data ?? []
}

async function createCategory(payload: CategoryCreateBody): Promise<Category> {
  const response = await apiFetch<{ data?: Category }>(
    "/v1/admin/blog-categories",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )
  if (!response.data) {
    throw new Error("Create category response was missing data.")
  }
  return response.data
}

async function updateCategory(
  categoryId: string,
  payload: CategoryUpdateBody
): Promise<Category> {
  const response = await apiFetch<{ data?: Category }>(
    `/v1/admin/blog-categories/${categoryId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  )
  if (!response.data) {
    throw new Error("Update category response was missing data.")
  }
  return response.data
}

async function deleteCategory(categoryId: string): Promise<void> {
  await apiFetch(`/v1/admin/blog-categories/${categoryId}`, {
    method: "DELETE",
  })
}

/**
 * The BlogCategory schema has no post-count field, so this derives one by
 * fetching every blog and tallying its embedded categories client-side.
 */
async function getCategoryPostCounts(): Promise<Record<string, number>> {
  const blogs = await listAllBlogs()
  const counts: Record<string, number> = {}

  for (const blog of blogs) {
    for (const category of blog.categories ?? []) {
      if (!category._id) {
        continue
      }
      counts[category._id] = (counts[category._id] ?? 0) + 1
    }
  }

  return counts
}

export {
  createCategory,
  deleteCategory,
  getCategoryPostCounts,
  listCategories,
  updateCategory,
}
export type { Category, CategoryCreateBody, CategoryUpdateBody }
