import { type Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Shell } from "@/components/shells/shell"
import { Button, buttonVariants } from "@/components/ui/button"
import { ResetPasswordCookie, SearchParams } from "@/types"
import { ArrowLeftToLine } from "lucide-react"
import Link from "next/link"
import { cookies } from "next/headers"
import { cn } from "@/lib/utils"
import { decryptCookie } from "@/lib/helpers/cookie"
import ResetPasswordChangeEmail from "@/components/auth/reset-password-change-email"
import SendResetPasswordMail from "@/components/auth/send-reset-mail-Button"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Enter your email to reset your password",
}

interface ResetPasswordPageProps {
}

export default function ResetPasswordPage({

}: ResetPasswordPageProps) {
  const cookieStore = cookies()
  const resetPassCookie = cookieStore.get('next-auth.reset-password')
  const decryptedResetPassValue: ResetPasswordCookie = decryptCookie(resetPassCookie?.value ?? '');
  return (
    <Shell className={cn("md:max-w-lg")}>
      <Button
        asChild
        className="absolute right-8 top-8 md:right-0 md:top-2  text-sm transition-all duration-300 text-black"
        variant="link"
      >
        <Link href="/login">
          <ArrowLeftToLine className="mr-2" size={16} />
          Go Back To Home
        </Link>
      </Button>
      <Card className="shadow-lg pt-10 md:pt-0">
        <CardHeader className="space-y-1 ">
          <CardTitle className="text-2xl">Reset password</CardTitle>
          <CardDescription>
            Enter your email address and we will send you a verification code
          </CardDescription>
        </CardHeader>
        <CardContent>

          {resetPassCookie ?
            <>
              Password reset instructions have been emailed to you
              <p>
                If you need any further help, please <Link href="/help" className={cn(buttonVariants({ variant: "link" }), "mx-0 px-0")}>Contact Us</Link>.
              </p>
            </>
            :
            <ResetPasswordForm />
          }
        </CardContent>

        {
          resetPassCookie ?
            <CardFooter className="justify-between flex-col md:flex-row gap-2 items-stretch space-x-2">
              <ResetPasswordChangeEmail />
              <SendResetPasswordMail email={decryptedResetPassValue.email} />

            </CardFooter> : null
        }

      </Card>
    </Shell>
  )
}