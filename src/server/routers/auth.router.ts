import AdscrushResetPasswordEmail from "@/components/emails/reset-password";
import { RESET_PASSWORD_STEP2_LINK, RESET_PASSWORD_TOKEN_EXPIRE_TIME } from "@/constants/index";
import { db } from "@/db";
import { env } from "@/lib/env.mjs";
import { encryptCookie } from "@/lib/helpers/cookie";
import { resend } from "@/lib/resend";
import { absoluteUrl, generateSecurePasswordResetCode } from "@/lib/utils";
import { checkEmailSchema, resetPasswordSchema } from "@/schema/authFormSchema";
import { publicProcedure, router } from "@/server/trpc";
import { ResetPasswordCookie } from "@/types";
import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { cookies } from "next/headers";

export const authRouter = router({
  resetPassword: publicProcedure.input(checkEmailSchema).mutation(async ({ input }) => {
    const { email } = input

    const user = await db.user.findUnique({
      where: {
        email
      }
    })

    if (!user) throw new TRPCError({ code: "NOT_FOUND", "message": "Couldn't find your account." })
    const securePasswordResetCode = generateSecurePasswordResetCode();
    const resetPassword = await db.passwordResetToken.create({
      data: {
        userId: user.id,
        token: securePasswordResetCode,
      },
    })

    const encryptPasswordResetCookie = encryptCookie({ email: user.email, count: 1 } satisfies ResetPasswordCookie)
    const cookieStore = cookies()
    cookieStore.set({
      name: 'next-auth.reset-password',
      value: encryptPasswordResetCookie,
      expires: Date.now() + RESET_PASSWORD_TOKEN_EXPIRE_TIME
    });

    const resetTokenLink = `${RESET_PASSWORD_STEP2_LINK}?token=${resetPassword.token}&email=${user.email}`

    // const data = await resend.sendEmail({
    //   from: `Adscrush <security@${env.RESEND_DOMAIN}>`,
    //   to: email,
    //   subject: "reset your account password",
    //   html: "",
    //   react: AdscrushResetPasswordEmail({ resetPasswordCode: resetPassword.token, userFirstname: user.name, resetPasswordLink: resetTokenLink })
    // });
    return {
      success: true,
      message: `Reset password email sent to ${email}`,
    };
  }),

  changePassword: publicProcedure.input(resetPasswordSchema).mutation(async ({ input }) => {
    const { code, password } = input

    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: {
        token: code,
        createdAt: { gt: new Date(Date.now() - RESET_PASSWORD_TOKEN_EXPIRE_TIME) },
        resetAt: null,
      },
    })
    if (!passwordResetToken) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Password reset token invalid or expired." })
    }

    const encryptedPassword = await hash(password, 16);

    const updateUser = db.user.update({
      where: {
        id: passwordResetToken.userId
      },
      data: {
        password: encryptedPassword,
      },
    })
    const updateToken = db.passwordResetToken.update({
      where: {
        id: passwordResetToken.id,
        token: passwordResetToken.token
      },
      data: {
        resetAt: new Date(),
      },
    })
    await db.$transaction([updateUser, updateToken])
   
    return {
      success: true,
      message: `Password Reset Successful`,
    }
  })
});

export type AuthRouter = typeof authRouter;
