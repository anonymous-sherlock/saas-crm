"use server";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "./auth.config";
import { getOnboardingDetails } from "./data/user.data";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { authPages } from "@routes";

export const getAuthSession = () => getServerSession(authOptions);

export const getCurrentUser = async () => {
  const session = await getAuthSession();
  return session?.user;
};
export const getActorUser = async (user: Session["user"] | undefined) => {
  if (!user) return undefined;
  return user?.actor;
};

export const getCurrentRole = async () => {
  const session = await getAuthSession();
  return session?.user?.role;
};

export const getCurrentIsOnboarded = async () => {
  const session = await getAuthSession();
  const onboarding = await getOnboardingDetails(session?.user.id);
  return onboarding;
};

export const getAuthUser = async () => {
  try {
    const user = await getCurrentUser();
    const actor = await getActorUser(user);
    if (!user) redirect(authPages.login);
    const authUserId = actor ? actor.userId : user.id;
    const authUserName = actor ? actor.actorName : user.name;
    const authUserEmail = actor ? actor.actorEmail : user.email;
    const authUserCompany = actor ? actor.company : user.company;
    const authUserImage = actor ? actor.image : user.image;

    return { authUserId, authUserName, authUserEmail, authUserImage, authUserCompany };
  } catch (error) {
    console.error("Error retrieving authenticated user:", error);
    return { authUserId: undefined, authUserName: undefined, authUserImage: undefined, authUserEmail: undefined, authUserCompany: undefined };
  }
};
