import { ArrowLeft, ArrowRight } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError } from "@/lib/api-client"
import { requestPasswordReset } from "@/lib/auth"

function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await requestPasswordReset({ email })
      navigate("/forgot-password/check-email", { state: { email } })
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Unable to send reset code. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="rounded-[16px] border border-[#E8E8EC] p-6 sm:p-8">
        <CardHeader className="px-0 pb-2">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send a reset link
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

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="h-11 w-full rounded-full bg-[#E97451] text-base font-semibold text-white hover:bg-[#E0552A]"
            >
              {isSubmitting ? "Sending…" : "Send reset link"}
              {!isSubmitting && <ArrowRight />}
            </Button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
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

export default ForgotPasswordPage
