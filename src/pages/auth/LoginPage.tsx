import { CheckCircle2 } from "lucide-react"
import { useState, type SubmitEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { AuthLayout } from "@/components/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { ApiError } from "@/lib/api-client"
import { login } from "@/lib/auth"

function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await login({ email, password })
      toast.success("Signed in successfully")
      navigate("/dashboard")
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Unable to sign in. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="rounded-[16px] border border-[#E8E8EC] p-6 sm:p-8">
        <CardHeader className="px-0 pb-2">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your administrator account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
                className="h-10 rounded-[16px] border border-[#E8E8EC] bg-[#F7F8FA]"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-[#161616]"
                >
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#E97451] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-10 rounded-[16px] border border-[#E8E8EC] bg-[#F7F8FA]"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="font-medium text-[#666666]">
                Remember me for 30 days
              </Label>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-12 w-full rounded-full bg-[#E97451] text-base font-semibold text-white hover:bg-[#E0552A]"
            >
              {isSubmitting ? "Signing in…" : "Sign In →"}
            </Button>

            <div className="flex items-center gap-3 rounded-[16px] border border-[#E8E8EC] bg-[#F7F8FA] p-3.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="size-4" />
              </span>
              <p className="text-xs text-[#8C8C8C]">
                Secure admin access &mdash; all sessions are encrypted and
                audited
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

export default LoginPage
