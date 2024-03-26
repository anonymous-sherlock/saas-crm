import { Company, Role } from "@prisma/client";
import { DefaultSession } from "next-auth";
import { type Session, type User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

type Actor = {
  userId: string;
  actorName: string;
  actorEmail: string;
  image: string | undefined | null;
  company: {
    id: string | undefined;
    name: string | undefined;
    address: string | undefined;
  };
};

type UserWithActor = User & {
  id: UserId;
  name: string;
  role: Role;
  isImpersonating: boolean;
  actor: Actor;
  company: Pick<Company, "id" | "name" | "address">;
};

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: Role;
    isImpersonating: boolean;
    actor: Actor;
    company: Pick<Company, "id" | "name" | "address">;
  }
}

declare module "next-auth" {
  interface Session {
    user: UserWithActor;
  }
}
