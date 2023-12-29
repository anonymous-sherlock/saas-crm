import { ResetPasswordStep2Form } from "@/components/auth/reset-password-form-step2"
import { Shell } from "@/components/shells/shell"
import { buttonVariants } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { RESET_PASSWORD_TOKEN_EXPIRE_TIME } from "@/constants/index"
import { db } from "@/db"
import { cn } from "@/lib/utils"
import { type Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Reset Password",
    description: "Enter your email to reset your password",
}

interface ResetPasswordStep2PageProps {
    searchParams: {
        email: string,
        token: string
    }
}
export default async function ResetPasswordStep2Page({ searchParams }: ResetPasswordStep2PageProps) {
    const { email, token } = searchParams
    if (!token || !email) {
        redirect("/reset-password")
    }
    const validToken = await db.passwordResetToken.findUnique({
        where: {
            token: token,
            resetAt: null,
            user: {
                email: email
            },
            createdAt: {
                gte: new Date(Date.now() - RESET_PASSWORD_TOKEN_EXPIRE_TIME)
            }
        }
    })
    if (!validToken) {
        return (
            <Shell className="max-w-lg">
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl">Verification Failed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* <p className="">The password reset link is no longer valid. This may be because the verification token has expired or has already been used.</p> */}


                        <p className="mt-4 ">If you still need to reset your password, please request a new password reset link.</p>
                        <p>
                            If you need any further help, please <Link href="/help" className={cn(buttonVariants({ variant: "link" }), "mx-0 px-0")}>Contact Us</Link>.
                        </p>

                        <Link href="/reset-password" className={cn(buttonVariants({ variant: "default" }), "text-md mt-6 h-11 flex w-full items-center justify-center rounded-lg px-4 font-semibold text-white hover:bg-indigo-900 focus:bg-indigo-400 bg-[#112164]")} >Go Back To Password Reset Page</Link>
                    </CardContent>
                </Card>
            </Shell>
        )
    }

    return (
        <Shell className="max-w-lg">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Reset password</CardTitle>
                    <CardDescription>
                        Enter your email address and we will send you a verification code
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ResetPasswordStep2Form />
                </CardContent>
            </Card>
        </Shell>
    )
}
