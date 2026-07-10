import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { AuthLayout } from "@/components/auth/AuthLayout"
import { Card, CardContent } from "@/components/ui/card"
import { ApiError } from "@/lib/api-client"
import { resendPasswordResetOtp } from "@/lib/auth"

function CheckEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as { email?: string } | null)?.email ?? ""

  const [isResending, setIsResending] = useState(false)

  const handleResend = async () => {
    if (!email) {
      navigate("/forgot-password")
      return
    }

    setIsResending(true)
    try {
      await resendPasswordResetOtp({ email })
      toast.success("Reset code resent")
    } catch (err) {
      toast.error(
        err instanceof ApiError
          ? err.message
          : "Unable to resend the code. Please try again."
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout>
      <Card className="items-center rounded-[16px] border border-[#E8E8EC] p-6 text-center sm:p-8">
        <CardContent className="flex w-full flex-col items-center gap-6 px-0">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
            <CheckCircle2 className="size-7" />
          </span>

          <div className="flex flex-col gap-2">
            <h1 className="text-[20px] font-bold text-[#111111]">
              Check your inbox
            </h1>
            <p className="text-sm text-[#6B6B6B]">
              We sent a password reset code to{" "}
              <strong className="text-[#111111]">{email || "your email"}</strong>
            </p>
          </div>

          <Link
            to="/reset-password"
            state={{ email }}
            className="flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-[#E97451] text-sm font-semibold text-white hover:bg-[#E0552A]"
          >
            Enter reset code
            <ArrowRight className="size-4" />
          </Link>

          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-sm font-medium text-[#E97451] hover:underline disabled:opacity-50"
          >
            {isResending ? "Resending…" : "Resend code"}
          </button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-sm text-[#6B6B6B] hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

export default CheckEmailPage
