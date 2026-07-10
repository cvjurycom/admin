import { apiFetch } from "@/lib/api-client"
import type { components } from "@/api/schema"

type Tag = components["schemas"]["Tag"]
type TagCreateBody = components["schemas"]["TagCreateBody"]
type TagUpdateBody = components["schemas"]["TagUpdateBody"]

async function listTags(): Promise<Tag[]> {
  // Unlike every other admin list endpoint, /admin/tags returns a flat
  // array in `data` rather than the paginated `{ data: { data, pagination } }`
  // shape — confirmed against the live API, not just the (incorrect) spec.
  const response = await apiFetch<{ data?: Tag[] }>(
    "/v1/admin/tags?page=1&limit=100"
  )
  return response.data ?? []
}

async function createTag(payload: TagCreateBody): Promise<Tag> {
  const response = await apiFetch<{ data?: Tag }>("/v1/admin/tags", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!response.data) {
    throw new Error("Create tag response was missing data.")
  }
  return response.data
}

async function updateTag(tagId: string, payload: TagUpdateBody): Promise<Tag> {
  const response = await apiFetch<{ data?: Tag }>(
    `/v1/admin/tags/${tagId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  )
  if (!response.data) {
    throw new Error("Update tag response was missing data.")
  }
  return response.data
}

async function deleteTag(tagId: string): Promise<void> {
  await apiFetch(`/v1/admin/tags/${tagId}`, { method: "DELETE" })
}

export { createTag, deleteTag, listTags, updateTag }
export type { Tag, TagCreateBody, TagUpdateBody }
