import { AdscrushResetPasswordEmail } from '@/components/emails/reset-password';
import { env } from '@/lib/env.mjs';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(env.RESEND_API_KEY);

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const data = await resend.sendEmail({
      from: `Adscrush <support@adscrush.com>`,
      to: "layalakash4@gmail.com",
      subject: "reset your account password",

      react: AdscrushResetPasswordEmail({ resetPasswordLink: "/abc", userFirstname: "Akash layal" })
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error });
  }
}
