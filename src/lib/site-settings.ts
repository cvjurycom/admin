import { apiFetch } from "@/lib/api-client"
import type { components } from "@/api/schema"

type SiteSetting = components["schemas"]["SiteSetting"]
type SiteSettingUpdateBody = components["schemas"]["SiteSettingUpdateBody"]

async function getSiteSettings(): Promise<SiteSetting> {
  const response = await apiFetch<{ data?: SiteSetting }>("/v1/admin/settings")
  return response.data ?? {}
}

async function updateSiteSettings(
  payload: SiteSettingUpdateBody
): Promise<SiteSetting> {
  const response = await apiFetch<{ data?: SiteSetting }>(
    "/v1/admin/settings",
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  )
  if (!response.data) {
    throw new Error("Update settings response was missing data.")
  }
  return response.data
}

export { getSiteSettings, updateSiteSettings }
export type { SiteSetting, SiteSettingUpdateBody }
