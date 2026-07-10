import { apiFetch } from "@/lib/api-client"
import type { components } from "@/api/schema"

type AuthorProfile = components["schemas"]["AuthorProfile"]
type AuthorProfileUpdateBody = components["schemas"]["AuthorProfileUpdateBody"]

async function getMyProfile(): Promise<AuthorProfile> {
  // /author/profile is role-gated to author accounts only (403s for admins);
  // /auth/me works for any authenticated user regardless of role.
  const response = await apiFetch<{ data?: AuthorProfile }>("/v1/auth/me")
  if (!response.data) {
    throw new Error("Get profile response was missing data.")
  }
  return response.data
}

async function updateMyProfile(
  payload: AuthorProfileUpdateBody
): Promise<AuthorProfile> {
  const response = await apiFetch<{ data?: AuthorProfile }>("/v1/auth/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  })
  if (!response.data) {
    throw new Error("Update profile response was missing data.")
  }
  return response.data
}

export { getMyProfile, updateMyProfile }
export type { AuthorProfile, AuthorProfileUpdateBody }
