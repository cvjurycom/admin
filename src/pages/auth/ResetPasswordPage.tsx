import { ArrowLeft, ArrowRight } from "lucide-react"
import { useState, type SubmitEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { AuthLayout } from "@/components/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { ApiError } from "@/lib/api-client"
import { resetPassword } from "@/lib/auth"

function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialEmail = (location.state as { email?: string } | null)?.email ?? ""

  const [email, setEmail] = useState(initialEmail)
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsSubmitting(true)
    try {
      await resetPassword({ email, token, password })
      toast.success("Password reset. You can now sign in.")
      navigate("/login")
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Unable to reset password. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="rounded-[16px] border border-[#E8E8EC] p-6 text-center sm:p-8">
        <CardContent className="flex flex-col gap-6 px-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-[20px] font-bold text-[#111111]">
              Set New Password
            </h1>
            <p className="text-sm text-[#6B6B6B]">
              Enter the code we emailed you and choose a new password
            </p>
          </div>

          <form className="flex flex-col gap-5 text-left" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-[#161616]"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@cvjury.com"
                autoComplete="email"
                required
                className="h-10 rounded-[16px] border border-[#E8E8EC] bg-[#F7F8FA]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="token"
                className="text-sm font-medium text-[#161616]"
              >
                Reset Code
              </Label>
              <Input
                id="token"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Enter the code from your email"
                autoComplete="one-time-code"
                required
                className="h-10 rounded-[16px] border border-[#E8E8EC] bg-[#F7F8FA]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-[#161616]"
              >
                New Password
              </Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={8}
                className="h-10 rounded-[16px] border border-[#E8E8EC] bg-[#F7F8FA]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="confirm-password"
                className="text-sm font-medium text-[#161616]"
              >
                Confirm New Password
              </Label>
              <PasswordInput
                id="confirm-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                minLength={8}
                className="h-10 rounded-[16px] border border-[#E8E8EC] bg-[#F7F8FA]"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-11 w-full rounded-full bg-[#E97451] text-base font-semibold text-white hover:bg-[#E0552A]"
            >
              {isSubmitting ? "Resetting…" : "Reset Password"}
              {!isSubmitting && <ArrowRight />}
            </Button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 text-sm text-[#6B6B6B] hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

export default ResetPasswordPage
