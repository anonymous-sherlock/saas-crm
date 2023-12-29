import { ReactElement } from "react";
import { Resend } from "resend";
import { env } from "@/env";
import ActivateAccountEmail from "@/components/emails/activate-account";
const resend = new Resend(env.RESEND_API_KEY);
interface senActivationEmailProps {
  name: string;
  email: string;
  verifyTokenUrl: string;
}
export async function senActivationEmail({
  name,
  email,
  verifyTokenUrl,
}: senActivationEmailProps) {
  try {
    const data = await resend.emails.send({
      from: `Adscrush <${env.EMAIL_FROM_ADDRESS}>`,
      to: email,
      subject: "🙌 Complete your sign up to Adscrush!",
      react: ActivateAccountEmail({
        name: name,
        verifyTokenUrl: verifyTokenUrl,
      }) as ReactElement,
    });

    return data;
  } catch (error) {
    return error;
  }
}
