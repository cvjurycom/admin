import {
  apiFetch,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/lib/api-client"
import type { components } from "@/api/schema"

const USER_KEY = "cvjury_user"

type LoginBody = components["schemas"]["LoginBody"]
type AuthLoginData = components["schemas"]["AuthLoginData"]
type User = components["schemas"]["User"]
type EmailBody = components["schemas"]["EmailBody"]
type ResetPasswordBody = components["schemas"]["ResetPasswordBody"]

async function login(credentials: LoginBody): Promise<AuthLoginData> {
  const response = await apiFetch<{ message?: string; data?: AuthLoginData }>(
    "/v1/auth/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    }
  )

  if (!response.data) {
    throw new Error("Login response was missing data.")
  }

  if (response.data.accessToken) {
    setAccessToken(response.data.accessToken)
  }
  if (response.data.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.user))
  }

  return response.data
}

function logout() {
  clearAccessToken()
  localStorage.removeItem(USER_KEY)
}

async function requestPasswordReset(credentials: EmailBody) {
  return apiFetch<{ message?: string }>("/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

async function resendPasswordResetOtp(credentials: EmailBody) {
  return apiFetch<{ message?: string }>("/v1/auth/resend-otp", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

async function resetPassword(payload: ResetPasswordBody) {
  return apiFetch<{ message?: string }>("/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

function setStoredUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

function isAuthenticated(): boolean {
  return getAccessToken() !== null
}

export {
  getAccessToken,
  getStoredUser,
  isAuthenticated,
  login,
  logout,
  requestPasswordReset,
  resendPasswordResetOtp,
  resetPassword,
  setStoredUser,
}
