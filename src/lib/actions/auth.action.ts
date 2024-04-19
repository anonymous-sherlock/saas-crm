"use server"

import { cookies } from "next/headers"

export async function removeResetPasswordCookie() {
    const cookieStore = cookies()
    const deleteResetPasswordCookie = cookieStore.delete("next-auth.reset-password")
    return {
        success: true,
        message: "remove Password reset cookie"
    }
}
