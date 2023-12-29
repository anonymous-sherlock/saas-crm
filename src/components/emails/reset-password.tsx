import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import * as React from 'react';
interface DropboxResetPasswordEmailProps {
    userFirstname?: string;
    resetPasswordCode?: string
    resetPasswordLink?: string
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

export const AdscrushResetPasswordEmail = ({
    userFirstname = 'Zeno',
    resetPasswordCode = "sparo-ndigo-amurt-secan",
    resetPasswordLink = "/reset-password/step2"
}: DropboxResetPasswordEmailProps) => {

    const resetPasswordImg = {
        src: `${baseUrl}/static/logo.png`,
        alt: "Adscrush Logo",
    }

    return (
        <Html>
            <Head />
            <Preview>Adscrush reset your password</Preview>
            <Tailwind>
                <Body style={main} className='bg-[#DBDDDE]'>
                    <Container style={container} className='border-2 border-[#cacaca] shadow-lg'>
                        <Img
                            src={resetPasswordImg.src}
                            className="w-14 my-6"
                            alt={resetPasswordImg.alt}
                        />
                        <Section>
                            <Text style={text}>Hi {userFirstname},</Text>
                            <Text style={text}>
                                Click the button below to reset your affilate.adscrush.com account password. This link is valid for 4 hours:
                            </Text>
                            {/* <Text style={text}>
                                Someone recently requested a password change for your Adscrush
                                account. If this was you, you can set a new password here:
                            </Text> */}
                            <Button style={button} href={`${baseUrl}${resetPasswordLink}`}>
                                Reset password
                            </Button>
                            <Text style={{ ...text, marginBottom: '14px' }}>
                                copy and paste this reset password code:
                            </Text>
                            <code style={code}>{resetPasswordCode}</code>
                            <Text style={text}>
                                If you don&apos;t want to change your password or didn&apos;t
                                request this, just ignore and delete this message.
                            </Text>
                            <Text style={text}>
                                To keep your account secure, please don&apos;t forward this email
                                to anyone. See our Help Center for{' '}
                                <Link style={anchor} href="https://adscrush.com">
                                    more security tips.
                                </Link>
                            </Text>
                            <Text style={text}>
                                If you have any questions, feedback or suggestions please let us know!
                            </Text>
                            <Text style={text}>- Adscrush Support Team</Text>
                        </Section>
                    </Container>
                    <Container className="text-center font-sans font-bold text-[#858585]">
                        <Text className="pb-4">
                            Made with <span className="text-red-500">♥</span> Adscrush Team
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default AdscrushResetPasswordEmail;

const code = {
    display: 'inline-block',
    padding: '16px 4.5%',
    width: '90.5%',
    backgroundColor: '#f4f4f4',
    borderRadius: '5px',
    border: '1px solid #eee',
    color: '#333',
};
const main = {
    backgroundColor: '#f6f9fc',
    padding: '10px 0',
};

const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f0f0',
    padding: '45px',
};

const text = {
    fontSize: '16px',
    fontFamily:
        "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
    fontWeight: '300',
    color: '#404040',
    lineHeight: '26px',
};

const button = {
    backgroundColor: '#007ee6',
    borderRadius: '4px',
    color: '#fff',
    fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
    fontSize: '15px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    width: '210px',
    padding: '14px 7px',
};

const anchor = {
    textDecoration: 'underline',
};
