import { apiFetch, fetchAllPages } from "@/lib/api-client"
import type { components } from "@/api/schema"

type AuthorUser = components["schemas"]["User"]

/**
 * `__t` is the Mongoose discriminator key backing `UserType` on the read-side
 * `User` schema, but it isn't documented on AuthorCreateBody/AuthorUpdateBody.
 * Sent best-effort (same pattern as the undocumented Blog fields in
 * src/lib/blogs.ts).
 */
type UserTypeField = {
  __t?: components["schemas"]["UserType"]
}

type AuthorCreateBody = components["schemas"]["AuthorCreateBody"] &
  UserTypeField
type AuthorUpdateBody = components["schemas"]["AuthorUpdateBody"] &
  UserTypeField

async function listUsers(): Promise<AuthorUser[]> {
  return fetchAllPages<AuthorUser>("/v1/admin/authors")
}

async function createUser(payload: AuthorCreateBody): Promise<AuthorUser> {
  const response = await apiFetch<{ data?: AuthorUser }>(
    "/v1/admin/authors",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )
  if (!response.data) {
    throw new Error("Create author response was missing data.")
  }
  return response.data
}

async function updateUser(
  userId: string,
  payload: AuthorUpdateBody
): Promise<AuthorUser> {
  const response = await apiFetch<{ data?: AuthorUser }>(
    `/v1/admin/authors/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  )
  if (!response.data) {
    throw new Error("Update author response was missing data.")
  }
  return response.data
}

async function setUserActive(
  userId: string,
  isActive: boolean
): Promise<AuthorUser> {
  return updateUser(userId, { isActive })
}

async function deleteUser(userId: string): Promise<void> {
  await apiFetch(`/v1/admin/authors/${userId}`, { method: "DELETE" })
}

export {
  createUser,
  deleteUser,
  listUsers,
  setUserActive,
  updateUser,
}
export type { AuthorCreateBody, AuthorUpdateBody, AuthorUser }
