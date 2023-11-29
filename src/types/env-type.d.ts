declare namespace NodeJS {
  export interface ProcessEnv {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    DATABASE_URL: string;
    EMAIL_SERVER_HOST: string;
    EMAIL_SERVER_USER: string;
    EMAIL_SERVER_PASSWORD: string;
    EMAIL_SERVER_PORT: number;
    EMAIL_FROM: string;
    NEXT_PUBLIC_BASE_URL: string;
    RESEND_API_KEY: string;
    CDN_DOMAIN: string;
    CDN_API_KEY: string;
    CDN_URL: string;
  }
}
