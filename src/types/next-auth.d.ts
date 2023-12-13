import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";
import { type Session, type User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

type Actor = {
  userId: string;
  actorName: string;
  actorEmail: string;
}

type UserWithActor = User & {
  id: UserId;
  role: UserRole;
  isImpersonating: boolean;
  actor: Actor;
};

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: UserRole;
    isImpersonating: boolean;
    actor: Actor;
  }
}

declare module "next-auth" {
  interface Session {
    user: UserWithActor;
  }
}
