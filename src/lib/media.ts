import { apiFetch, fetchAllPages } from "@/lib/api-client"
import type { components } from "@/api/schema"

type Media = components["schemas"]["Media"]
type MediaCreateBody = components["schemas"]["MediaCreateBody"]

async function listMedia(): Promise<Media[]> {
  return fetchAllPages<Media>("/v1/admin/media")
}

async function createMedia(payload: MediaCreateBody): Promise<Media> {
  const response = await apiFetch<{ data?: Media }>("/v1/admin/media", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  if (!response.data) {
    throw new Error("Create media response was missing data.")
  }
  return response.data
}

async function deleteMedia(mediaId: string): Promise<void> {
  await apiFetch(`/v1/admin/media/${mediaId}`, { method: "DELETE" })
}

export { createMedia, deleteMedia, listMedia }
export type { Media, MediaCreateBody }
