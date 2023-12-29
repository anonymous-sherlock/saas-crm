"use server"

import { cookies } from "next/headers"
import { resend } from "../resend"
import AdscrushResetPasswordEmail from "@/components/emails/reset-password"
import { db } from "@/db"
import { generateSecurePasswordResetCode } from "../utils"

export async function removeResetPasswordCookie() {
    const cookieStore = cookies()
    const deleteResetPasswordCookie = cookieStore.delete("next-auth.reset-password")
    return {
        success: true,
        message: "remove Password reset cookie"
    }
}
