import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { env } from "@/env";
import { AuthError } from "@/exceptions/authError";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";


function getGoogleCredentials(): { clientId: string; clientSecret: string } {
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_SERVER_FROM,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new AuthError("Email and password required", false);
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new AuthError("Invalid Credentials", false);
        }
        if (!user.password) {
          throw new AuthError("You have not signed up using your email. Please try social login.", false);
        }
        // if (!user.active) {
        //   throw new AuthError("Account is not verified", false);
        // }
        const isValidPassword = await compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new AuthError("Invalid email or password", false);
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async session({ token, session, }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
        session.user.actor = token.actor;
        session.user.isImpersonating = token.isImpersonating;
        session.user.company = token.company;

      }
      return session;
    },
    async jwt({ token, user, trigger, session, profile, account }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email!,
        }, include: {
          company: {
            select: {
              id: true,
              name: true,
              address: true,
            }
          }
        }
      });
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      if (!dbUser) { token.id = user!.id; return token; }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        role: dbUser.role,
        isImpersonating: token.isImpersonating,
        actor: token.actor,
        company: dbUser.company
      };

    },
    async redirect({ url, baseUrl }) {
      try {
        const callbacksUrl = new URL(url).searchParams.get("callbackUrl");
        if (callbacksUrl) {
          return `${baseUrl}${callbacksUrl}`;
        }
      } catch (error) {
        console.error("Invalid URL:", url);
        return baseUrl;
      }
      const dashboardUrl = `${baseUrl}/dashboard`;
      return dashboardUrl;
    },
  },
  debug: env.NODE_ENV === "development" ? true : false,
};

