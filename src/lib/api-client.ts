const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://cvjury.onrender.com/api"

const ACCESS_TOKEN_KEY = "cvjury_access_token"
// Duplicated from auth.ts's USER_KEY to avoid a circular import between the
// two modules; both must be cleared together when a session expires.
const USER_KEY = "cvjury_user"

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

async function apiFetch<TResponse>(
  path: string,
  options: RequestInit = {}
): Promise<TResponse> {
  const token = getAccessToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      (body && typeof body === "object" && "message" in body
        ? String(body.message)
        : null) ?? "Something went wrong. Please try again."

    // A request that carried a token but comes back 401 (expired/invalid
    // token) or "User not found" (the token is a valid JWT but the account
    // it points at no longer exists — e.g. after a backend data reset)
    // means the session can't continue — force a fresh login rather than
    // let the app keep rendering with stale/unauthenticated data. Requests
    // with no token (login, register, etc.) skip this so a wrong password
    // doesn't get treated as an expired session.
    if (token && (response.status === 401 || message === "User not found")) {
      clearAccessToken()
      localStorage.removeItem(USER_KEY)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    throw new ApiError(message, response.status)
  }

  return body as TResponse
}

const MAX_PAGES = 50

/**
 * Follows `pagination.hasNextPage` across an admin list endpoint until
 * exhausted (capped at MAX_PAGES as a safety guard against runaway loops).
 */
async function fetchAllPages<TItem>(
  path: string,
  limit = 100
): Promise<TItem[]> {
  const items: TItem[] = []
  let page = 1

  while (page <= MAX_PAGES) {
    const response = await apiFetch<{
      data?: { data?: TItem[]; pagination?: { hasNextPage?: boolean } }
    }>(`${path}?page=${page}&limit=${limit}`)

    items.push(...(response.data?.data ?? []))

    if (!response.data?.pagination?.hasNextPage) {
      break
    }
    page += 1
  }

  return items
}

export {
  ApiError,
  apiFetch,
  clearAccessToken,
  fetchAllPages,
  getAccessToken,
  setAccessToken,
}
